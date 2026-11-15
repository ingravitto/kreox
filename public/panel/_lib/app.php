<?php
// Núcleo del panel de KREOX: configuración, sesión, seguridad (CSRF, límite de intentos), utilidades y plantilla.
// Compatible con PHP 7.4+. La configuración (usuarios, token de GitHub, credenciales de Google) NO está en el
// repositorio: la escribe el despliegue en /panel/_config.php a partir de los GitHub Secrets.

declare(strict_types=1);

if (!function_exists('str_starts_with')) {
    function str_starts_with(string $h, string $n): bool { return $n === '' || strpos($h, $n) === 0; }
}
if (!function_exists('str_contains')) {
    function str_contains(string $h, string $n): bool { return $n === '' || strpos($h, $n) !== false; }
}

const PANEL_DIR = __DIR__ . '/..';

function config(): array
{
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $file = getenv('KREOX_PANEL_CONFIG') ?: PANEL_DIR . '/_config.php';
    $cfg = is_file($file) ? (array) require $file : [];
    $cfg += ['users' => [], 'github' => [], 'google' => [], 'site_url' => 'https://kreox.es'];
    $cfg['github'] += ['token' => '', 'repo' => 'ingravitto/kreox', 'branch' => 'main', 'workflow' => 'deploy.yml', 'destino' => 'pruebas', 'dispatch' => true];
    $cfg['google'] += ['service_account' => '', 'ga4_property' => '', 'gsc_site' => ''];
    return $cfg;
}

function cache_dir(): string
{
    $d = PANEL_DIR . '/_cache';
    if (!is_dir($d)) {
        @mkdir($d, 0700, true);
        @file_put_contents($d . '/.htaccess', "Require all denied\n");
    }
    return $d;
}

// ---------- Sesión y seguridad ----------

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('kreox_panel');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/panel/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict']);
    session_start();
    // Caduca tras 8 horas sin actividad
    if (isset($_SESSION['seen']) && time() - (int) $_SESSION['seen'] > 8 * 3600) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['seen'] = time();
}

function user(): ?string { return $_SESSION['user'] ?? null; }

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function csrf_field(): string { return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">'; }

function require_csrf(): void
{
    if (!hash_equals(csrf_token(), (string) ($_POST['csrf'] ?? ''))) {
        http_response_code(400);
        exit('La sesión ha caducado. Vuelve atrás y recarga la página.');
    }
}

function client_key(): string { return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|kreox'); }

/** Devuelve los segundos de bloqueo restantes (0 si puede intentarlo). 5 fallos → 15 minutos. */
function login_blocked(): int
{
    $f = cache_dir() . '/login-' . client_key() . '.json';
    if (!is_file($f)) return 0;
    $d = json_decode((string) file_get_contents($f), true) ?: [];
    if (($d['n'] ?? 0) >= 5 && time() - ($d['t'] ?? 0) < 900) return 900 - (time() - (int) $d['t']);
    return 0;
}

function login_failed(): void
{
    $f = cache_dir() . '/login-' . client_key() . '.json';
    $d = is_file($f) ? (json_decode((string) file_get_contents($f), true) ?: []) : [];
    if (time() - ($d['t'] ?? 0) > 900) $d = ['n' => 0];
    $d['n'] = ($d['n'] ?? 0) + 1;
    $d['t'] = time();
    file_put_contents($f, json_encode($d), LOCK_EX);
}

function login_ok(string $u): void
{
    @unlink(cache_dir() . '/login-' . client_key() . '.json');
    session_regenerate_id(true);
    $_SESSION['user'] = $u;
}

function check_password(string $u, string $p): bool
{
    $users = config()['users'];
    $hash = $users[$u] ?? null;
    if (!$hash) { password_verify($p, '$2y$10$2Zb5NhM5jz46cgn0Eq4GuuoC1l01Y48aOuZ.yiAU8h2Tv3SHfe92m'); return false; } // mismo tiempo de respuesta con usuario inexistente
    return password_verify($p, $hash);
}

// ---------- Utilidades ----------

function e($s): string { return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

function url(string $page, array $q = []): string
{
    return '/panel/?' . http_build_query(['p' => $page] + $q);
}

function redirect(string $to): void { header('Location: ' . $to, true, 303); exit; }

function flash(?string $msg = null, string $type = 'ok')
{
    if ($msg !== null) { $_SESSION['flash'][] = [$type, $msg]; return null; }
    $f = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    return $f;
}

function mb_len(string $s): int { return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen(utf8_decode($s)); }

function slugify(string $s): string
{
    $map = ['á'=>'a','à'=>'a','ä'=>'a','â'=>'a','é'=>'e','è'=>'e','ë'=>'e','ê'=>'e','í'=>'i','ì'=>'i','ï'=>'i','î'=>'i','ó'=>'o','ò'=>'o','ö'=>'o','ô'=>'o','ú'=>'u','ù'=>'u','ü'=>'u','û'=>'u','ñ'=>'n','ç'=>'c'];
    $s = strtr(function_exists('mb_strtolower') ? mb_strtolower($s, 'UTF-8') : strtolower($s), $map);
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim((string) $s, '-');
}

function fecha_es(string $iso): string
{
    $ts = strtotime($iso);
    if (!$ts) return $iso;
    $m = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return date('j', $ts) . ' de ' . $m[(int) date('n', $ts) - 1] . ' de ' . date('Y', $ts);
}

function hace(string $iso): string
{
    $d = time() - (int) strtotime($iso);
    if ($d < 90) return 'hace un momento';
    if ($d < 3600) return 'hace ' . round($d / 60) . ' min';
    if ($d < 86400) return 'hace ' . round($d / 3600) . ' h';
    return 'hace ' . round($d / 86400) . ' días';
}

/** Inventario de páginas generado en la construcción (scripts/panel-data.mjs). */
function paginas(): array
{
    $f = PANEL_DIR . '/_data/paginas.json';
    return is_file($f) ? (json_decode((string) file_get_contents($f), true) ?: []) : [];
}

// ---------- Datos de la web ----------

const CATEGORIAS = ['nivelacion' => 'Nivelación autonivelante', 'azulejos' => 'Colocación de azulejos', 'empresa' => 'Empresa', 'comunidad' => 'Comunidad'];
const PRODUCTOS = ['piko' => 'PIKO', 'universal' => 'Nivelador Universal', 'recambios' => 'Recambios', 'kalzo' => 'Kalzo', 'kunas' => 'Kuñas', 'alikates' => 'Alikates'];
/** Colecciones de noticias por idioma: carpeta en el repositorio y prefijo de URL. */
const COLECCIONES = [
    'es' => ['dir' => 'src/content/noticias', 'url' => '/noticias/', 'nombre' => 'Español'],
    'en' => ['dir' => 'src/content/news', 'url' => '/en/news/', 'nombre' => 'Inglés'],
];
const IMG_DIR = 'src/assets/img/noticias';
const SEO_FILE = 'src/data/seo-overrides.json';

// ---------- Plantilla ----------

function asset(string $f): string
{
    $p = PANEL_DIR . '/assets/' . $f;
    return '/panel/assets/' . $f . '?v=' . (is_file($p) ? filemtime($p) : '1');
}

function layout_start(string $title, string $active = ''): void
{
    header('Content-Type: text/html; charset=utf-8');
    $nav = ['inicio' => 'Inicio', 'seo' => 'SEO', 'noticias' => 'Noticias', 'metricas' => 'Métricas', 'publicaciones' => 'Publicaciones'];
    echo '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<meta name="robots" content="noindex, nofollow"><title>' . e($title) . ' · Panel KREOX</title>';
    echo '<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="' . e(asset('panel.css')) . '">';
    echo '<script src="' . e(asset('panel.js')) . '" defer></script></head><body>';
    echo '<a class="skip" href="#contenido">Saltar al contenido</a>';
    if (user()) {
        echo '<header class="top"><div class="wrap top-in"><a class="brand" href="' . e(url('inicio')) . '"><img src="/panel/assets/kreox-logo-blanco.png" alt="KREOX" width="98" height="24"><span>Panel</span></a>';
        echo '<nav aria-label="Panel"><ul>';
        foreach ($nav as $k => $label) {
            $cur = $k === $active ? ' aria-current="page"' : '';
            echo '<li><a href="' . e(url($k)) . '"' . $cur . '>' . e($label) . '</a></li>';
        }
        echo '</ul></nav><div class="who"><a href="/" target="_blank" rel="noopener">Ver web<span class="sr"> (se abre en una nueva pestaña)</span></a>';
        echo '<form method="post" action="' . e(url('salir')) . '">' . csrf_field() . '<button type="submit" class="link">Salir (' . e(user()) . ')</button></form></div></div></header>';
    }
    echo '<main id="contenido" class="wrap">';
    foreach (flash() as [$type, $msg]) {
        echo '<p class="flash flash--' . e($type) . '" role="' . ($type === 'error' ? 'alert' : 'status') . '">' . e($msg) . '</p>';
    }
}

function layout_end(): void
{
    echo '</main><footer class="wrap foot"><p>Panel de kreox.es · Los cambios se publican en la web en 2-3 minutos.</p></footer></body></html>';
}

function count_badge(int $n, int $max, int $min = 0): string
{
    $cls = $n > $max ? 'bad' : ($n < $min ? 'warn' : 'ok');
    return '<span class="cnt cnt--' . $cls . '">' . $n . '</span>';
}
