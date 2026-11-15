<?php
// Inicio: resumen de SEO, última publicación, métricas (si están configuradas) y accesos rápidos.
require_once __DIR__ . '/../google.php';

$inv = paginas();
$pags = $inv['paginas'] ?? [];
$conAvisos = array_filter($pags, function ($p) { return !empty($p['avisos']); });
$ultima = null;
try { $runs = github()->runs(config()['github']['workflow'], 1); $ultima = $runs[0] ?? null; } catch (GitHubError $e) { $ultima = ['error' => $e->getMessage()]; }
$resumen = null;
if (google_configurado()) {
    try { $resumen = metricas_resumen(28); } catch (Throwable $e) { $resumen = ['error' => $e->getMessage()]; }
}

layout_start('Inicio', 'inicio');
?>
<h1>Hola, <?= e(ucfirst((string) user())) ?></h1>
<p class="muted">Desde aquí gestionas el SEO de cada página, las noticias y ves cómo funciona la web.</p>

<div class="grid grid-3">
  <a class="card stat" href="<?= e(url('seo')) ?>">
    <span class="stat-n"><?= count($pags) ?></span><span class="stat-l">páginas en la web</span>
    <span class="stat-s <?= $conAvisos ? 'is-warn' : 'is-ok' ?>"><?= $conAvisos ? count($conAvisos) . ' con avisos de SEO' : 'Sin avisos de SEO' ?></span>
  </a>
  <a class="card stat" href="<?= e(url('publicaciones')) ?>">
    <?php if (!$ultima): ?>
      <span class="stat-l">Sin publicaciones todavía</span>
    <?php elseif (isset($ultima['error'])): ?>
      <span class="stat-l">GitHub no responde</span><span class="stat-s is-bad"><?= e($ultima['error']) ?></span>
    <?php else: $ok = ($ultima['conclusion'] ?? '') === 'success'; $curso = ($ultima['status'] ?? '') !== 'completed'; ?>
      <span class="stat-n"><?= $curso ? 'En curso' : ($ok ? 'Al día' : 'Error') ?></span><span class="stat-l">última publicación</span>
      <span class="stat-s <?= $curso ? '' : ($ok ? 'is-ok' : 'is-bad') ?>"><?= e(hace($ultima['created_at'])) ?></span>
    <?php endif; ?>
  </a>
  <a class="card stat" href="<?= e(url('metricas')) ?>">
    <?php if (!$resumen): ?>
      <span class="stat-l">Métricas</span><span class="stat-s">Conecta Google Analytics y Search Console para verlas aquí.</span>
    <?php elseif (isset($resumen['error'])): ?>
      <span class="stat-l">Métricas</span><span class="stat-s is-bad"><?= e($resumen['error']) ?></span>
    <?php else: ?>
      <span class="stat-n"><?= e(number_format((int) $resumen['usuarios'], 0, ',', '.')) ?></span><span class="stat-l">visitantes en 28 días</span>
      <span class="stat-s"><?= e(number_format((int) $resumen['clics_google'], 0, ',', '.')) ?> clics desde Google · <?= e(number_format((int) $resumen['whatsapp'], 0, ',', '.')) ?> clics en WhatsApp</span>
    <?php endif; ?>
  </a>
</div>

<h2>Acciones rápidas</h2>
<div class="actions">
  <a class="btn btn--sand" href="<?= e(url('noticia', ['lang' => 'es'])) ?>">Escribir una noticia</a>
  <a class="btn" href="<?= e(url('seo', ['f' => 'avisos'])) ?>">Revisar avisos de SEO</a>
  <a class="btn" href="<?= e(url('metricas')) ?>">Ver métricas</a>
</div>

<?php if ($conAvisos): ?>
<h2>Páginas que conviene revisar</h2>
<ul class="list">
  <?php foreach (array_slice($conAvisos, 0, 6) as $p): ?>
    <li><a href="<?= e(url('seo-editar', ['url' => $p['url']])) ?>"><?= e($p['url']) ?></a> <span class="muted">— <?= e(implode(' ', $p['avisos'])) ?></span></li>
  <?php endforeach; ?>
</ul>
<?php endif; ?>
<?php layout_end();
