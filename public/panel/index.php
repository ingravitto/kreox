<?php
// Panel de kreox.es — enrutador. Cada pantalla está en _lib/pantallas/<nombre>.php.
declare(strict_types=1);

require __DIR__ . '/_lib/app.php';
require __DIR__ . '/_lib/github.php';
require __DIR__ . '/_lib/noticias.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self'; style-src-attr 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'");

start_session();

$page = preg_replace('/[^a-z-]/', '', (string) ($_GET['p'] ?? 'inicio')) ?: 'inicio';
$publicas = ['entrar'];

if (!config()['users']) {
    layout_start('Panel sin configurar');
    echo '<section class="card narrow"><h1>Panel sin configurar</h1><p>Falta crear los usuarios del panel. Añade el secreto <code>PANEL_USERS</code> en GitHub y vuelve a publicar la web.</p></section>';
    layout_end();
    exit;
}

if (!user() && !in_array($page, $publicas, true)) redirect(url('entrar'));

$pantallas = ['entrar', 'salir', 'inicio', 'seo', 'seo-editar', 'noticias', 'noticia', 'metricas', 'publicaciones'];
if (!in_array($page, $pantallas, true)) { http_response_code(404); $page = 'inicio'; }

try {
    require __DIR__ . '/_lib/pantallas/' . $page . '.php';
} catch (GitHubError $ex) {
    layout_start('Error');
    echo '<section class="card narrow"><h1>No se ha podido completar</h1><p class="flash flash--error" role="alert">' . e($ex->getMessage()) . '</p>';
    echo '<p><a class="btn" href="' . e(url('inicio')) . '">Volver al inicio</a></p></section>';
    layout_end();
}
