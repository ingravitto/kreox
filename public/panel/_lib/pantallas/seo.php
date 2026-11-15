<?php
// SEO: todas las páginas con su título y descripción tal y como están publicados, y sus avisos.
$inv = paginas();
$pags = $inv['paginas'] ?? [];
$lang = in_array($_GET['lang'] ?? '', ['es', 'en'], true) ? $_GET['lang'] : '';
$soloAvisos = ($_GET['f'] ?? '') === 'avisos';
$q = trim((string) ($_GET['q'] ?? ''));
$langs = array_unique(array_map(function ($p) { return $p['lang']; }, $pags));

$lista = array_filter($pags, function ($p) use ($lang, $soloAvisos, $q) {
    if ($lang && $p['lang'] !== $lang) return false;
    if ($soloAvisos && empty($p['avisos'])) return false;
    if ($q !== '' && stripos($p['url'] . ' ' . $p['title'] . ' ' . $p['description'], $q) === false) return false;
    return true;
});

layout_start('SEO', 'seo');
?>
<div class="head">
  <div><h1>SEO por página</h1>
  <p class="muted">Título y descripción que ve Google en los resultados. Datos de la última publicación<?= isset($inv['generado']) ? ' (' . e(hace($inv['generado'])) . ')' : '' ?>.</p></div>
</div>
<form class="filters" method="get" action="/panel/">
  <input type="hidden" name="p" value="seo">
  <label>Buscar <input type="search" name="q" value="<?= e($q) ?>" placeholder="piko, recrecido…"></label>
  <?php if (count($langs) > 1): ?>
  <label>Idioma <select name="lang"><option value="">Todos</option><option value="es"<?= $lang === 'es' ? ' selected' : '' ?>>Español</option><option value="en"<?= $lang === 'en' ? ' selected' : '' ?>>Inglés</option></select></label>
  <?php endif; ?>
  <label class="check"><input type="checkbox" name="f" value="avisos"<?= $soloAvisos ? ' checked' : '' ?>> Solo con avisos</label>
  <button class="btn" type="submit">Filtrar</button>
</form>
<p class="muted" role="status"><?= count($lista) ?> páginas</p>
<div class="table-wrap"><table class="table seo-table">
  <caption class="sr">Páginas de la web y su SEO</caption>
  <thead><tr><th scope="col">Página</th><th scope="col">Título <span class="muted">(máx. 65)</span></th><th scope="col">Descripción <span class="muted">(máx. 158)</span></th><th scope="col"><span class="sr">Acciones</span></th></tr></thead>
  <tbody>
  <?php foreach ($lista as $p): ?>
    <tr>
      <th scope="row"><a href="<?= e($p['url']) ?>" target="_blank" rel="noopener"><?= e($p['url']) ?><span class="sr"> (se abre en una nueva pestaña)</span></a>
        <?php if ($p['lang'] !== 'es'): ?><span class="pill"><?= e(strtoupper($p['lang'])) ?></span><?php endif; ?>
        <?php if (!empty($p['avisos'])): ?><ul class="warns"><?php foreach ($p['avisos'] as $a): ?><li><?= e($a) ?></li><?php endforeach; ?></ul><?php endif; ?>
      </th>
      <td><?= e($p['title']) ?> <?= count_badge(mb_len($p['title']), 65, 25) ?></td>
      <td><?= e($p['description']) ?> <?= count_badge(mb_len($p['description']), 158, 70) ?></td>
      <td><a class="btn btn--sm" href="<?= e(url('seo-editar', ['url' => $p['url']])) ?>">Editar<span class="sr"> <?= e($p['url']) ?></span></a></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table></div>
<?php layout_end();
