<?php
// Crear o editar una noticia. Guarda el .md (y la imagen, si se sube) en un único commit y publica.
$lang = isset(COLECCIONES[$_GET['lang'] ?? '']) ? $_GET['lang'] : 'es';
$col = COLECCIONES[$lang];
$slug = preg_replace('/[^a-z0-9-]/', '', (string) ($_GET['slug'] ?? ''));
$nueva = $slug === '';
$gh = github();

if ($nueva) {
    $d = parse_noticia('');
    $d['date'] = date('Y-m-d');
} else {
    $raw = $gh->read($col['dir'] . '/' . $slug . '.md');
    if ($raw === null) { flash('No se ha encontrado la noticia.', 'error'); redirect(url('noticias', ['lang' => $lang])); }
    $d = parse_noticia($raw);
}

$errores = [];
$avisos = [];
$preview = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $clean = function ($k) { return trim(preg_replace('/[ \t]+/', ' ', (string) ($_POST[$k] ?? ''))); };
    $d['title'] = $clean('title');
    $d['seoTitle'] = $clean('seoTitle');
    $d['description'] = $clean('description');
    $d['date'] = $clean('date');
    $d['category'] = $clean('category');
    $d['products'] = array_values(array_intersect(array_keys(PRODUCTOS), (array) ($_POST['products'] ?? [])));
    $d['imageAlt'] = $clean('imageAlt');
    $d['body'] = str_replace("\r\n", "\n", (string) ($_POST['body'] ?? ''));
    $d['draft'] = !empty($_POST['draft']);
    if (!$nueva && !empty($_POST['actualizada'])) $d['updated'] = date('Y-m-d');
    $d['faq'] = [];
    foreach ((array) ($_POST['faq_q'] ?? []) as $i => $q) {
        $a = (string) ($_POST['faq_a'][$i] ?? '');
        if (trim($q) === '' && trim($a) === '') continue;
        $d['faq'][] = ['q' => trim($q), 'a' => trim($a)];
    }
    $nuevoSlug = $nueva ? slugify((string) ($_POST['slug'] ?? '') ?: $d['title']) : $slug;

    // Imagen subida
    $imagenOriginal = $d['image'];
    $imagen = null;
    if (!empty($_FILES['imagen']['tmp_name']) && is_uploaded_file($_FILES['imagen']['tmp_name'])) {
        $info = @getimagesize($_FILES['imagen']['tmp_name']);
        $tipos = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
        if (!$info || !isset($tipos[$info[2]])) $errores[] = 'La imagen debe ser JPG, PNG o WebP.';
        elseif ($_FILES['imagen']['size'] > 6 * 1024 * 1024) $errores[] = 'La imagen no puede pasar de 6 MB.';
        else {
            if ($info[0] < 1200) $avisos[] = 'La imagen mide ' . $info[0] . ' px de ancho: mejor 1200 px o más para que se vea nítida.';
            $nombre = $nuevoSlug . '.' . $tipos[$info[2]];
            $imagen = [IMG_DIR . '/' . $nombre, (string) file_get_contents($_FILES['imagen']['tmp_name'])];
            $d['image'] = '../../assets/img/noticias/' . $nombre;
        }
    } elseif (!empty($_POST['quitar_imagen'])) {
        $d['image'] = '';
        $d['imageAlt'] = '';
    }

    $existentes = [];
    if ($nueva) foreach ($gh->listDir($col['dir']) as $f) $existentes[] = preg_replace('/\.md$/', '', $f['name']);
    [$e2, $w2] = validar_noticia($d, $nueva, $existentes, $nuevoSlug);
    $errores = array_merge($errores, $e2);
    $avisos = array_merge($avisos, $w2);

    $guardar = ($_POST['accion'] ?? '') !== 'preview' && !$errores;
    if (!$guardar && $imagen) {
        // La imagen subida solo se guarda al publicar: si no se guarda ahora, hay que volver a elegirla.
        $d['image'] = $imagenOriginal;
        $avisos[] = 'Vuelve a elegir la imagen antes de guardar: no se conserva en la vista previa ni cuando hay errores.';
    }
    if (($_POST['accion'] ?? '') === 'preview') {
        $preview = md_preview($d['body']);
    } elseif ($guardar) {
        $files = [$col['dir'] . '/' . $nuevoSlug . '.md' => ['text' => build_noticia($d)]];
        if ($imagen) $files[$imagen[0]] = ['binary' => $imagen[1]];
        $msg = ($nueva ? 'Noticia nueva: ' : 'Noticia editada: ') . $d['title'];
        flash(save_and_publish($files, $msg));
        foreach ($avisos as $w) flash($w, 'warn');
        redirect(url('noticias', ['lang' => $lang]));
    }
}

$faqRows = $d['faq'] ?: [['q' => '', 'a' => '']];
layout_start($nueva ? 'Nueva noticia' : 'Editar noticia', 'noticias');
?>
<p><a href="<?= e(url('noticias', ['lang' => $lang])) ?>">← Noticias</a></p>
<h1><?= $nueva ? 'Nueva noticia' : 'Editar noticia' ?> <span class="pill"><?= e($col['nombre']) ?></span></h1>
<?php if ($errores): ?><div class="flash flash--error" role="alert"><p><strong>Revisa estos puntos antes de publicar:</strong></p><ul><?php foreach ($errores as $er): ?><li><?= e($er) ?></li><?php endforeach; ?></ul></div><?php endif; ?>
<?php foreach ($avisos as $w): ?><p class="flash flash--warn"><?= e($w) ?></p><?php endforeach; ?>

<form method="post" enctype="multipart/form-data" action="<?= e(url('noticia', ['lang' => $lang, 'slug' => $slug])) ?>" class="form editor">
  <?= csrf_field() ?>
  <div class="split split--wide">
    <div>
      <label>Título <span class="req">obligatorio</span>
        <input name="title" value="<?= e($d['title']) ?>" required data-slug-source aria-describedby="h-t">
      </label>
      <p class="hint" id="h-t">Si es una guía, que sea la pregunta que la gente busca: "Cómo nivelar…", "Cuántos niveladores…".</p>
      <?php if ($nueva): ?>
      <label>Dirección (URL)
        <span class="prefix"><span class="mono"><?= e($col['url']) ?></span><input name="slug" value="<?= e((string) ($_POST['slug'] ?? '')) ?>" pattern="[a-z0-9]+(-[a-z0-9]+)*" data-slug-target placeholder="se-crea-sola-con-el-titulo" aria-describedby="h-s"></span>
      </label>
      <p class="hint" id="h-s">Solo minúsculas, números y guiones. No se puede cambiar después de publicar.</p>
      <?php endif; ?>
      <label>Título para Google <span class="opt">opcional</span>
        <input name="seoTitle" value="<?= e($d['seoTitle']) ?>" maxlength="65" data-count="65" aria-describedby="h-st">
      </label>
      <p class="hint" id="h-st"><span data-counter-for="seoTitle"></span> Si lo dejas vacío se usa el título + "| KREOX".</p>
      <label>Descripción <span class="req">obligatorio</span>
        <textarea name="description" rows="3" maxlength="170" required data-count="158" aria-describedby="h-d"><?= e($d['description']) ?></textarea>
      </label>
      <p class="hint" id="h-d"><span data-counter-for="description"></span> Sale en Google y en la cabecera de la noticia. Ideal 120-158 caracteres.</p>

      <label>Texto de la noticia <span class="req">obligatorio</span>
        <textarea name="body" rows="22" class="mono" required aria-describedby="h-b"><?= e($d['body']) ?></textarea>
      </label>
      <div class="hint" id="h-b">
        <p>El <strong>primer párrafo</strong> debe responder directamente a la pregunta del título. Enlaza al menos una ficha de producto.</p>
        <p class="md-help"><code>## Subtítulo</code> · <code>**negrita**</code> · <code>[PIKO](/nivelacion-mortero-autonivelante/piko/)</code> · <code>- elemento de lista</code> · deja una línea en blanco entre párrafos.</p>
      </div>
      <?php if ($preview): ?>
      <section class="card preview" aria-label="Vista previa del texto"><h2 class="h3">Vista previa</h2><div class="prose"><?= $preview ?></div></section>
      <?php endif; ?>

      <fieldset class="faq-edit">
        <legend>Preguntas frecuentes <span class="opt">opcional</span></legend>
        <p class="hint">Salen al final de la noticia y Google las puede mostrar en los resultados.</p>
        <div data-faq-rows>
        <?php foreach ($faqRows as $i => $f): ?>
          <div class="faq-row" data-faq-row>
            <label>Pregunta <input name="faq_q[]" value="<?= e($f['q']) ?>"></label>
            <label>Respuesta <textarea name="faq_a[]" rows="2"><?= e($f['a']) ?></textarea></label>
            <button type="button" class="link" data-faq-remove>Quitar esta pregunta</button>
          </div>
        <?php endforeach; ?>
        </div>
        <button type="button" class="btn btn--sm" data-faq-add>Añadir pregunta</button>
      </fieldset>
    </div>

    <div class="side-col">
      <div class="card sticky">
        <label>Fecha <input type="date" name="date" value="<?= e($d['date']) ?>" required></label>
        <?php if (!$nueva): ?><label class="check"><input type="checkbox" name="actualizada" value="1"> Marcar como actualizada hoy</label><?php endif; ?>
        <label>Categoría
          <select name="category"><?php foreach (CATEGORIAS as $k => $v): ?><option value="<?= e($k) ?>"<?= $d['category'] === $k ? ' selected' : '' ?>><?= e($v) ?></option><?php endforeach; ?></select>
        </label>
        <fieldset><legend>Productos</legend>
          <?php foreach (PRODUCTOS as $k => $v): ?><label class="check"><input type="checkbox" name="products[]" value="<?= e($k) ?>"<?= in_array($k, $d['products'], true) ? ' checked' : '' ?>> <?= e($v) ?></label><?php endforeach; ?>
        </fieldset>
        <fieldset><legend>Imagen principal</legend>
          <?php if ($d['image']): ?><p class="hint">Actual: <span class="mono"><?= e(basename($d['image'])) ?></span></p><label class="check"><input type="checkbox" name="quitar_imagen" value="1"> Quitar la imagen</label><?php endif; ?>
          <label>Subir <?= $d['image'] ? 'otra' : 'una' ?> imagen <input type="file" name="imagen" accept="image/jpeg,image/png,image/webp" aria-describedby="h-i"></label>
          <p class="hint" id="h-i">JPG, PNG o WebP, mínimo 1200 px de ancho. La web la optimiza sola.</p>
          <label>Descripción de la imagen <input name="imageAlt" value="<?= e($d['imageAlt']) ?>" aria-describedby="h-a"></label>
          <p class="hint" id="h-a">Qué se ve en la foto (para personas ciegas y para Google).</p>
        </fieldset>
        <label class="check"><input type="checkbox" name="draft" value="1"<?= $d['draft'] ? ' checked' : '' ?>> Guardar como borrador (no se publica)</label>
        <div class="actions actions--col">
          <button class="btn btn--sand" type="submit" name="accion" value="guardar">Guardar y publicar</button>
          <button class="btn" type="submit" name="accion" value="preview" formnovalidate>Vista previa del texto</button>
        </div>
      </div>
    </div>
  </div>
</form>
<template id="faq-row-tpl"><div class="faq-row" data-faq-row><label>Pregunta <input name="faq_q[]"></label><label>Respuesta <textarea name="faq_a[]" rows="2"></textarea></label><button type="button" class="link" data-faq-remove>Quitar esta pregunta</button></div></template>
<?php layout_end();
