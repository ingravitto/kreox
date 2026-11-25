<?php
// Métricas desde Google con una cuenta de servicio (sin cookies ni inicios de sesión de Google en el panel):
//  - Google Analytics 4 (Data API): visitantes, páginas, canales y eventos (clics en WhatsApp, tarifa, formulario).
//  - Search Console (Search Analytics API): clics, impresiones, CTR, posición y búsquedas.
// La cuenta de servicio debe tener acceso de "Lector" en la propiedad de GA4 y de usuario en Search Console.
// Las respuestas se guardan en caché una hora para que el panel vaya rápido y no gaste cuota.

declare(strict_types=1);

/** Eventos que envía la web a GA4 (ver src/components/Analytics.astro). */
const EVENTOS = ['click_whatsapp' => 'Clics en WhatsApp', 'click_telefono' => 'Llamadas (clic en el teléfono)', 'generate_lead' => 'Formularios enviados'];

function google_configurado(): bool
{
    $g = config()['google'];
    return $g['service_account'] !== '' && ($g['ga4_property'] !== '' || $g['gsc_site'] !== '');
}

function google_token(): string
{
    $cache = cache_dir() . '/google-token.json';
    if (is_file($cache)) {
        $c = json_decode((string) file_get_contents($cache), true);
        if (($c['exp'] ?? 0) > time() + 60) return (string) $c['token'];
    }
    $sa = json_decode(config()['google']['service_account'], true);
    if (!is_array($sa) || empty($sa['client_email']) || empty($sa['private_key'])) throw new RuntimeException('La clave de la cuenta de servicio de Google no es válida (secreto GOOGLE_SA_JSON).');
    $b64 = function (string $s): string { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); };
    $now = time();
    $head = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $claims = $b64(json_encode([
        'iss' => $sa['client_email'],
        'scope' => 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
        'aud' => 'https://oauth2.googleapis.com/token',
        'iat' => $now,
        'exp' => $now + 3600,
    ]));
    $sig = '';
    if (!openssl_sign($head . '.' . $claims, $sig, $sa['private_key'], 'sha256WithRSAEncryption')) throw new RuntimeException('No se pudo firmar la petición a Google (clave privada no válida).');
    $r = http_json('POST', 'https://oauth2.googleapis.com/token', null, http_build_query([
        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' => $head . '.' . $claims . '.' . $b64($sig),
    ]), 'application/x-www-form-urlencoded');
    if (empty($r['access_token'])) throw new RuntimeException('Google no ha aceptado la cuenta de servicio: ' . ($r['error_description'] ?? $r['error'] ?? 'error desconocido'));
    file_put_contents($cache, json_encode(['token' => $r['access_token'], 'exp' => $now + (int) ($r['expires_in'] ?? 3600)]), LOCK_EX);
    return (string) $r['access_token'];
}

function http_json(string $method, string $url, ?string $token, $body = null, string $type = 'application/json'): array
{
    $ch = curl_init($url);
    $h = ['Content-Type: ' . $type, 'User-Agent: kreox-panel'];
    if ($token) $h[] = 'Authorization: Bearer ' . $token;
    curl_setopt_array($ch, [CURLOPT_CUSTOMREQUEST => $method, CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $h, CURLOPT_TIMEOUT => 30, CURLOPT_CONNECTTIMEOUT => 10]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($body) ? $body : json_encode($body));
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($raw === false) throw new RuntimeException('No se pudo conectar con Google: ' . $err);
    $data = json_decode((string) $raw, true) ?: [];
    if ($code >= 400 && strpos($url, 'oauth2') === false) {
        $msg = $data['error']['message'] ?? ('HTTP ' . $code);
        if ($code === 403) $msg = 'la cuenta de servicio no tiene acceso. Añádela como usuario en Google Analytics y en Search Console. (' . $msg . ')';
        throw new RuntimeException('Google: ' . $msg);
    }
    return $data;
}

/** Ejecuta un informe de GA4 y lo devuelve como filas [dim1, …, met1, …]. */
function ga4(array $req): array
{
    $prop = config()['google']['ga4_property'];
    $d = http_json('POST', 'https://analyticsdata.googleapis.com/v1beta/properties/' . rawurlencode($prop) . ':runReport', google_token(), $req);
    $rows = [];
    foreach ($d['rows'] ?? [] as $r) {
        $row = [];
        foreach ($r['dimensionValues'] ?? [] as $v) $row[] = $v['value'];
        foreach ($r['metricValues'] ?? [] as $v) $row[] = (float) $v['value'];
        $rows[] = $row;
    }
    return $rows;
}

function gsc(array $req): array
{
    $site = config()['google']['gsc_site'];
    $d = http_json('POST', 'https://searchconsole.googleapis.com/webmasters/v3/sites/' . rawurlencode($site) . '/searchAnalytics/query', google_token(), $req);
    return $d['rows'] ?? [];
}

function con_cache(string $key, callable $fn, int $ttl = 3600): array
{
    $f = cache_dir() . '/m-' . preg_replace('/[^a-z0-9-]/', '', $key) . '.json';
    if (is_file($f) && time() - filemtime($f) < $ttl) return json_decode((string) file_get_contents($f), true) ?: [];
    $data = $fn();
    $data['_generado'] = date('c');
    file_put_contents($f, json_encode($data), LOCK_EX);
    return $data;
}

/** Todas las métricas de un periodo. Cada fuente puede fallar por separado sin romper la otra. */
function metricas(int $dias, bool $refrescar = false): array
{
    $key = 'todo-' . $dias;
    if ($refrescar) @unlink(cache_dir() . '/m-' . $key . '.json');
    return con_cache($key, function () use ($dias) {
        $g = config()['google'];
        $out = ['dias' => $dias, 'ga' => null, 'ga_error' => null, 'gsc' => null, 'gsc_error' => null];
        $range = [['startDate' => $dias . 'daysAgo', 'endDate' => 'yesterday']];
        if ($g['ga4_property'] !== '') {
            try {
                $tot = ga4(['dateRanges' => $range, 'metrics' => [['name' => 'activeUsers'], ['name' => 'sessions'], ['name' => 'screenPageViews'], ['name' => 'engagementRate']]]);
                $diario = ga4(['dateRanges' => $range, 'dimensions' => [['name' => 'date']], 'metrics' => [['name' => 'activeUsers']], 'orderBys' => [['dimension' => ['dimensionName' => 'date']]]]);
                $paginas = ga4(['dateRanges' => $range, 'dimensions' => [['name' => 'pagePath']], 'metrics' => [['name' => 'screenPageViews'], ['name' => 'activeUsers']], 'orderBys' => [['metric' => ['metricName' => 'screenPageViews'], 'desc' => true]], 'limit' => 12]);
                $canales = ga4(['dateRanges' => $range, 'dimensions' => [['name' => 'sessionDefaultChannelGroup']], 'metrics' => [['name' => 'sessions']], 'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]], 'limit' => 8]);
                $paises = ga4(['dateRanges' => $range, 'dimensions' => [['name' => 'country']], 'metrics' => [['name' => 'activeUsers']], 'orderBys' => [['metric' => ['metricName' => 'activeUsers'], 'desc' => true]], 'limit' => 8]);
                $eventos = ga4(['dateRanges' => $range, 'dimensions' => [['name' => 'eventName']], 'metrics' => [['name' => 'eventCount']],
                    'dimensionFilter' => ['filter' => ['fieldName' => 'eventName', 'inListFilter' => ['values' => array_keys(EVENTOS)]]]]);
                $ev = array_fill_keys(array_keys(EVENTOS), 0);
                foreach ($eventos as $r) $ev[$r[0]] = (int) $r[1];
                $t = $tot[0] ?? [0, 0, 0, 0];
                $out['ga'] = ['usuarios' => (int) $t[0], 'sesiones' => (int) $t[1], 'vistas' => (int) $t[2], 'interaccion' => (float) $t[3],
                    'diario' => array_map(function ($r) { return [substr($r[0], 0, 4) . '-' . substr($r[0], 4, 2) . '-' . substr($r[0], 6, 2), (int) $r[1]]; }, $diario),
                    'paginas' => $paginas, 'canales' => $canales, 'paises' => $paises, 'eventos' => $ev];
            } catch (Throwable $e) { $out['ga_error'] = $e->getMessage(); }
        }
        if ($g['gsc_site'] !== '') {
            try {
                // Search Console tiene 2-3 días de retraso
                $fin = date('Y-m-d', strtotime('-3 days'));
                $ini = date('Y-m-d', strtotime('-' . ($dias + 2) . ' days'));
                $base = ['startDate' => $ini, 'endDate' => $fin];
                $tot = gsc($base);
                $diario = gsc($base + ['dimensions' => ['date'], 'rowLimit' => 500]);
                $consultas = gsc($base + ['dimensions' => ['query'], 'rowLimit' => 25]);
                $paginas = gsc($base + ['dimensions' => ['page'], 'rowLimit' => 12]);
                $t = $tot[0] ?? ['clicks' => 0, 'impressions' => 0, 'ctr' => 0, 'position' => 0];
                $out['gsc'] = ['clics' => (int) $t['clicks'], 'impresiones' => (int) $t['impressions'], 'ctr' => (float) $t['ctr'], 'posicion' => (float) $t['position'],
                    'diario' => array_map(function ($r) { return [$r['keys'][0], (int) $r['clicks']]; }, $diario),
                    'consultas' => $consultas, 'paginas' => $paginas, 'desde' => $ini, 'hasta' => $fin];
            } catch (Throwable $e) { $out['gsc_error'] = $e->getMessage(); }
        }
        return $out;
    });
}

function metricas_resumen(int $dias): array
{
    $m = metricas($dias);
    if (!$m['ga'] && !$m['gsc']) throw new RuntimeException($m['ga_error'] ?? $m['gsc_error'] ?? 'Sin datos');
    return ['usuarios' => $m['ga']['usuarios'] ?? 0, 'clics_google' => $m['gsc']['clics'] ?? 0, 'whatsapp' => ($m['ga']['eventos']['click_whatsapp'] ?? 0)];
}

// ---------- Gráfico de línea (SVG en el servidor; el tooltip lo añade panel.js) ----------

function nice_max(float $v): float
{
    if ($v <= 0) return 1;
    $p = pow(10, floor(log10($v)));
    foreach ([1, 2, 2.5, 5, 10] as $m) if ($v <= $m * $p) return $m * $p;
    return 10 * $p;
}

/** $serie: [[fecha 'Y-m-d', valor], …] */
function line_chart(array $serie, string $titulo, string $unidad): string
{
    if (!$serie) return '<p class="muted">Sin datos en este periodo.</p>';
    $W = 720; $H = 240; $L = 44; $R = 16; $T = 16; $B = 30;
    $max = nice_max((float) max(array_map(function ($p) { return $p[1]; }, $serie)));
    $n = count($serie);
    $x = function ($i) use ($n, $W, $L, $R) { return $n === 1 ? ($L + $W - $R) / 2 : $L + $i * ($W - $L - $R) / ($n - 1); };
    $y = function ($v) use ($max, $H, $T, $B) { return $T + ($H - $T - $B) * (1 - $v / $max); };
    $pts = [];
    foreach ($serie as $i => $p) $pts[] = round($x($i), 1) . ',' . round($y($p[1]), 1);
    $grid = '';
    for ($k = 0; $k <= 4; $k++) {
        $v = $max * $k / 4; $yy = round($y($v), 1);
        $grid .= '<line x1="' . $L . '" x2="' . ($W - $R) . '" y1="' . $yy . '" y2="' . $yy . '" class="ch-grid"/>';
        $grid .= '<text x="' . ($L - 8) . '" y="' . ($yy + 4) . '" class="ch-ax" text-anchor="end">' . e(number_format($v, 0, ',', '.')) . '</text>';
    }
    $ticks = '';
    $step = max(1, (int) ceil($n / 6));
    for ($i = 0; $i < $n; $i += $step) {
        $ticks .= '<text x="' . round($x($i), 1) . '" y="' . ($H - 8) . '" class="ch-ax" text-anchor="middle">' . e(date('j/n', strtotime($serie[$i][0]))) . '</text>';
    }
    $area = 'M' . $pts[0] . ' L' . implode(' L', $pts) . ' L' . round($x($n - 1), 1) . ',' . round($y(0), 1) . ' L' . round($x(0), 1) . ',' . round($y(0), 1) . ' Z';
    $data = json_encode(array_map(function ($p, $i) use ($x, $y) { return ['f' => date('j M Y', strtotime($p[0])), 'v' => $p[1], 'x' => round($x($i), 1), 'y' => round($y($p[1]), 1)]; }, $serie, array_keys($serie)));
    $total = array_sum(array_map(function ($p) { return $p[1]; }, $serie));
    $svg = '<figure class="chart" data-chart=\'' . e($data) . '\' data-unit="' . e($unidad) . '">';
    $svg .= '<svg viewBox="0 0 ' . $W . ' ' . $H . '" role="img" aria-label="' . e($titulo . ': ' . number_format($total, 0, ',', '.') . ' ' . $unidad . ' en total. Los datos día a día están en la tabla de abajo.') . '">';
    $svg .= $grid . '<path d="' . $area . '" class="ch-area"/><polyline points="' . implode(' ', $pts) . '" class="ch-line"/>' . $ticks;
    $svg .= '<line class="ch-cross" x1="0" x2="0" y1="' . $T . '" y2="' . ($H - $B) . '" hidden/><circle class="ch-dot" r="5" cx="0" cy="0" hidden/>';
    $svg .= '<rect class="ch-hit" x="' . $L . '" y="' . $T . '" width="' . ($W - $L - $R) . '" height="' . ($H - $T - $B) . '"/></svg>';
    $svg .= '<div class="ch-tip" hidden></div>';
    $svg .= '<details class="ch-table"><summary>Ver los datos día a día</summary><table class="table table--compact"><thead><tr><th scope="col">Día</th><th scope="col">' . e(ucfirst($unidad)) . '</th></tr></thead><tbody>';
    foreach ($serie as $p) $svg .= '<tr><td>' . e(date('j/n/Y', strtotime($p[0]))) . '</td><td>' . e(number_format($p[1], 0, ',', '.')) . '</td></tr>';
    return $svg . '</tbody></table></details></figure>';
}

/** Tabla con barra horizontal de magnitud en la primera columna numérica. */
function bar_table(array $rows, array $heads, string $caption, callable $label, callable $value, ?callable $extra = null): string
{
    if (!$rows) return '<p class="muted">Sin datos en este periodo.</p>';
    $max = max(1, max(array_map($value, $rows)));
    $h = '<div class="table-wrap"><table class="table bars"><caption class="sr">' . e($caption) . '</caption><thead><tr>';
    foreach ($heads as $i => $t) $h .= '<th scope="col"' . ($i ? ' class="num"' : '') . '>' . e($t) . '</th>';
    $h .= '</tr></thead><tbody>';
    foreach ($rows as $r) {
        $v = $value($r);
        $h .= '<tr><th scope="row"><span class="bar-label">' . $label($r) . '</span><span class="bar" style="--w:' . round(100 * $v / $max, 1) . '%" aria-hidden="true"></span></th>';
        $h .= '<td class="num">' . e(number_format($v, 0, ',', '.')) . '</td>' . ($extra ? $extra($r) : '') . '</tr>';
    }
    return $h . '</tbody></table></div>';
}
