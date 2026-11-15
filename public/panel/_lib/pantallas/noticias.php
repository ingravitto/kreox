<?php
// Listado de noticias por idioma, leídas directamente del repositorio (siempre la última versión).
$lang = isset(COLECCIONES[$_GET['lang'] ?? '']) ? $_GET['lang'] : 'es';
$lista = listar_noticias($lang);

layout_start('Noticias', 'noticias');
?>
<div class="head">
  <div><h1>Noticias y blog</h1><p class="muted">Las guías de nivelación con mortero autonivelante son las que más visitas traen desde Google.</p></div>
  <a class="btn btn--sand" href="<?= e(url('noticia', ['lang' => $lang])) ?>">Nueva noticia</a>
</div>
<nav class="tabs" aria-label="Idioma de las noticias">
  <?php foreach (COLECCIONES as $k => $c): ?>
    <a href="<?= e(url('noticias', ['lang' => $k])) ?>"<?= $k === $lang ? ' aria-current="page"' : '' ?>><?= e($c['nombre']) ?></a>
  <?php endforeach; ?>
</nav>
<div class="table-wrap"><table class="table">
  <caption class="sr">Noticias en <?= e(COLECCIONES[$lang]['nombre']) ?></caption>
  <thead><tr><th scope="col">Título</th><th scope="col">Fecha</th><th scope="col">Categoría</th><th scope="col">Estado</th><th scope="col"><span class="sr">Acciones</span></th></tr></thead>
  <tbody>
  <?php foreach ($lista as $n): ?>
    <tr>
      <th scope="row"><?= e($n['title']) ?><br><span class="muted mono"><?= e($n['url']) ?></span></th>
      <td><time datetime="<?= e($n['date']) ?>"><?= e(fecha_es($n['date'])) ?></time></td>
      <td><?= e(CATEGORIAS[$n['category']] ?? $n['category']) ?></td>
      <td><?= $n['draft'] ? '<span class="pill pill--warn">Borrador</span>' : '<span class="pill pill--ok">Publicada</span>' ?></td>
      <td class="nowrap">
        <a class="btn btn--sm" href="<?= e(url('noticia', ['lang' => $lang, 'slug' => $n['slug']])) ?>">Editar<span class="sr"> <?= e($n['title']) ?></span></a>
        <?php if (!$n['draft']): ?><a class="btn btn--sm btn--ghost" href="<?= e($n['url']) ?>" target="_blank" rel="noopener">Ver<span class="sr"> <?= e($n['title']) ?> (se abre en una nueva pestaña)</span></a><?php endif; ?>
      </td>
    </tr>
  <?php endforeach; ?>
  <?php if (!$lista): ?><tr><td colspan="5">Todavía no hay noticias en este idioma.</td></tr><?php endif; ?>
  </tbody>
</table></div>
<?php layout_end();
