<?php
// Publicaciones: estado de los últimos despliegues y botón para publicar a mano.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $cfg = config()['github'];
    github()->dispatch($cfg['workflow'], $cfg['destino']);
    flash('Publicación lanzada. En 2-3 minutos la web estará al día.');
    redirect(url('publicaciones'));
}

function estado_run(array $r): array
{
    if (($r['status'] ?? '') !== 'completed') return ['En curso', 'run'];
    switch ($r['conclusion'] ?? '') {
        case 'success': return ['Publicada', 'ok'];
        case 'cancelled': return ['Cancelada', 'warn'];
        default: return ['Ha fallado', 'bad'];
    }
}

$cfg = config()['github'];
$runs = github()->runs($cfg['workflow'], 12);
layout_start('Publicaciones', 'publicaciones');
?>
<div class="head">
  <div><h1>Publicaciones</h1><p class="muted">Cada cambio guardado en el panel publica la web en <strong><?= e($cfg['destino'] === 'produccion' ? 'kreox.es' : 'nuevo.kreox.es (pruebas)') ?></strong>.</p></div>
  <form method="post" action="<?= e(url('publicaciones')) ?>"><?= csrf_field() ?><button class="btn btn--sand" type="submit">Publicar ahora</button></form>
</div>
<?php if ($runs && estado_run($runs[0])[1] === 'run'): ?><meta http-equiv="refresh" content="20"><p class="flash" role="status">Hay una publicación en curso. Esta página se actualiza sola.</p><?php endif; ?>
<div class="table-wrap"><table class="table">
  <caption class="sr">Últimas publicaciones</caption>
  <thead><tr><th scope="col">Estado</th><th scope="col">Cuándo</th><th scope="col">Detalle</th></tr></thead>
  <tbody>
  <?php foreach ($runs as $r): [$txt, $cls] = estado_run($r); ?>
    <tr>
      <td><span class="pill pill--<?= e($cls) ?>"><?= e($txt) ?></span></td>
      <td><time datetime="<?= e($r['created_at']) ?>"><?= e(hace($r['created_at'])) ?></time></td>
      <td><a href="<?= e($r['html_url']) ?>" target="_blank" rel="noopener">Ver en GitHub<span class="sr"> (se abre en una nueva pestaña)</span></a></td>
    </tr>
  <?php endforeach; ?>
  <?php if (!$runs): ?><tr><td colspan="3">Todavía no hay publicaciones.</td></tr><?php endif; ?>
  </tbody>
</table></div>
<?php layout_end();
