<?php
// Métricas: Google Analytics 4 (visitas y acciones en la web) y Search Console (cómo te encuentran en Google).
require_once __DIR__ . '/../google.php';

$dias = in_array((int) ($_GET['dias'] ?? 28), [7, 28, 90], true) ? (int) $_GET['dias'] : 28;
$n = function ($v, int $dec = 0) { return number_format((float) $v, $dec, ',', '.'); };

layout_start('Métricas', 'metricas');
?>
<div class="head">
  <div><h1>Métricas</h1><p class="muted">Visitas y acciones en la web (Google Analytics) y búsquedas en Google (Search Console).</p></div>
  <nav class="tabs" aria-label="Periodo">
    <?php foreach ([7 => '7 días', 28 => '28 días', 90 => '90 días'] as $k => $t): ?>
      <a href="<?= e(url('metricas', ['dias' => $k])) ?>"<?= $k === $dias ? ' aria-current="page"' : '' ?>><?= e($t) ?></a>
    <?php endforeach; ?>
  </nav>
</div>
<?php
if (!google_configurado()) {
    echo '<section class="card"><h2>Conecta Google Analytics y Search Console</h2><ol class="steps">';
    echo '<li>Crea una cuenta de servicio en Google Cloud (proyecto KREOX) y descarga su clave JSON.</li>';
    echo '<li>Activa en ese proyecto las APIs "Google Analytics Data API" y "Google Search Console API".</li>';
    echo '<li>En Google Analytics → Administrar → Acceso a la propiedad, añade el email de la cuenta de servicio como <strong>Lector</strong>.</li>';
    echo '<li>En Search Console → Configuración → Usuarios y permisos, añade el mismo email con permiso <strong>Restringido</strong>.</li>';
    echo '<li>En GitHub, añade el secreto <code>GOOGLE_SA_JSON</code> (el contenido del JSON) y las variables <code>GA4_PROPERTY_ID</code> y <code>GSC_SITE</code>. Después, publica la web.</li>';
    echo '</ol></section>';
    layout_end();
    return;
}
$m = metricas($dias, isset($_GET['refrescar']));
$ga = $m['ga'];
$sc = $m['gsc'];
?>
<p class="muted small">Datos actualizados <?= e(hace($m['_generado'] ?? date('c'))) ?> · <a href="<?= e(url('metricas', ['dias' => $dias, 'refrescar' => 1])) ?>">Actualizar ahora</a></p>

<h2>Lo que importa</h2>
<div class="grid grid-4 kpis">
  <div class="card kpi"><span class="kpi-n"><?= $ga ? $n($ga['usuarios']) : '—' ?></span><span class="kpi-l">Visitantes</span></div>
  <div class="card kpi"><span class="kpi-n"><?= $ga ? $n($ga['eventos']['click_whatsapp']) : '—' ?></span><span class="kpi-l">Clics en WhatsApp</span></div>
  <div class="card kpi"><span class="kpi-n"><?= $ga ? $n($ga['eventos']['click_telefono']) : '—' ?></span><span class="kpi-l">Llamadas</span></div>
  <div class="card kpi"><span class="kpi-n"><?= $sc ? $n($sc['clics']) : '—' ?></span><span class="kpi-l">Clics desde Google</span></div>
</div>

<section class="block">
  <h2>Visitas a la web <span class="muted small">Google Analytics</span></h2>
  <?php if ($m['ga_error']): ?><p class="flash flash--error" role="alert"><?= e($m['ga_error']) ?></p>
  <?php elseif ($ga): ?>
    <p class="muted"><?= $n($ga['sesiones']) ?> sesiones · <?= $n($ga['vistas']) ?> páginas vistas · <?= $n($ga['interaccion'] * 100, 0) ?> % de visitas con interacción</p>
    <h3>Visitantes por día</h3>
    <?= line_chart($ga['diario'], 'Visitantes por día', 'visitantes') ?>
    <div class="grid grid-2">
      <div><h3>Páginas más vistas</h3><?= bar_table($ga['paginas'], ['Página', 'Vistas'], 'Páginas más vistas', function ($r) { return '<span class="mono">' . e($r[0]) . '</span>'; }, function ($r) { return (int) $r[1]; }) ?></div>
      <div>
        <h3>De dónde llegan</h3><?= bar_table($ga['canales'], ['Canal', 'Sesiones'], 'Canales de entrada', function ($r) { return e(traducir_canal($r[0])); }, function ($r) { return (int) $r[1]; }) ?>
        <h3>Países</h3><?= bar_table($ga['paises'], ['País', 'Visitantes'], 'Visitantes por país', function ($r) { return e($r[0]); }, function ($r) { return (int) $r[1]; }) ?>
      </div>
    </div>
    <h3>Acciones de contacto</h3>
    <?= bar_table(array_map(null, array_keys(EVENTOS), array_values(EVENTOS)), ['Acción', 'Veces'], 'Acciones de contacto', function ($r) { return e($r[1]); }, function ($r) use ($ga) { return (int) $ga['eventos'][$r[0]]; }) ?>
  <?php endif; ?>
</section>

<section class="block">
  <h2>Cómo te encuentran en Google <span class="muted small">Search Console</span></h2>
  <?php if ($m['gsc_error']): ?><p class="flash flash--error" role="alert"><?= e($m['gsc_error']) ?></p>
  <?php elseif ($sc): ?>
    <p class="muted"><?= $n($sc['impresiones']) ?> veces en resultados · <?= $n($sc['ctr'] * 100, 1) ?> % de clics · posición media <?= $n($sc['posicion'], 1) ?> · del <?= e(date('j/n', strtotime($sc['desde']))) ?> al <?= e(date('j/n', strtotime($sc['hasta']))) ?> (Google tarda 2-3 días)</p>
    <h3>Clics desde Google por día</h3>
    <?= line_chart($sc['diario'], 'Clics desde Google por día', 'clics') ?>
    <h3>Qué buscan</h3>
    <?= bar_table($sc['consultas'], ['Búsqueda', 'Clics', 'Veces visto', 'Posición'], 'Búsquedas en Google', function ($r) { return e($r['keys'][0]); }, function ($r) { return (int) $r['clicks']; },
        function ($r) use ($n) { return '<td class="num">' . $n($r['impressions']) . '</td><td class="num">' . $n($r['position'], 1) . '</td>'; }) ?>
    <h3>Páginas que más aparecen en Google</h3>
    <?= bar_table($sc['paginas'], ['Página', 'Clics', 'Veces visto', 'Posición'], 'Páginas en Google', function ($r) { return '<span class="mono">' . e(preg_replace('#^https?://[^/]+#', '', $r['keys'][0])) . '</span>'; }, function ($r) { return (int) $r['clicks']; },
        function ($r) use ($n) { return '<td class="num">' . $n($r['impressions']) . '</td><td class="num">' . $n($r['position'], 1) . '</td>'; }) ?>
    <p class="hint">Consejo: si una búsqueda sale mucho pero con pocos clics, mejora el título y la descripción de esa página en <a href="<?= e(url('seo')) ?>">SEO</a>.</p>
  <?php endif; ?>
</section>
<?php
layout_end();

function traducir_canal(string $c): string
{
    $t = ['Organic Search' => 'Google y buscadores', 'Direct' => 'Directo (escriben la web)', 'Referral' => 'Otras webs', 'Organic Social' => 'Redes sociales', 'Paid Search' => 'Anuncios en buscadores', 'Email' => 'Email', 'Unassigned' => 'Sin clasificar', 'Organic Video' => 'Vídeo (YouTube)', 'Paid Social' => 'Anuncios en redes'];
    return $t[$c] ?? $c;
}
