<?php
// Editar el título y la descripción de una página. Se guardan en src/data/seo-overrides.json,
// que la web aplica al construir (Base.astro). "Restablecer" vuelve al texto original de la página.
$url = (string) ($_GET['url'] ?? '');
$pag = null;
foreach ((paginas()['paginas'] ?? []) as $p) if ($p['url'] === $url) { $pag = $p; break; }
if (!$pag) { flash('Esa página no existe.', 'error'); redirect(url('seo')); }

$gh = github();
$raw = $gh->read(SEO_FILE);
$ov = $raw ? (json_decode($raw, true) ?: []) : [];
$actual = $ov[$url] ?? null;
$title = $actual['title'] ?? $pag['title'];
$desc = $actual['description'] ?? $pag['description'];
$errores = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    if (isset($_POST['restablecer'])) {
        unset($ov[$url]);
        ksort($ov);
        flash(save_and_publish([SEO_FILE => ['text' => json_encode($ov, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n"]], 'SEO: restablecer ' . $url));
        redirect(url('seo'));
    }
    $title = trim(preg_replace('/\s+/', ' ', (string) ($_POST['title'] ?? '')));
    $desc = trim(preg_replace('/\s+/', ' ', (string) ($_POST['description'] ?? '')));
    if (mb_len($title) < 10) $errores[] = 'El título es demasiado corto.';
    if (mb_len($title) > 70) $errores[] = 'El título no puede pasar de 70 caracteres (Google lo corta a partir de unos 60-65).';
    if (mb_len($desc) < 50) $errores[] = 'La descripción es demasiado corta (mínimo 50 caracteres).';
    if (mb_len($desc) > 170) $errores[] = 'La descripción no puede pasar de 170 caracteres.';
    if (preg_match('/\b(Pikos?|PiKo|pico)\b/u', $title . ' ' . $desc)) $errores[] = 'El producto se escribe siempre "PIKO".';
    if (!$errores) {
        if ($title === $pag['title'] && $desc === $pag['description'] && !$actual) {
            flash('No has cambiado nada.');
            redirect(url('seo'));
        }
        $ov[$url] = ['title' => $title, 'description' => $desc];
        ksort($ov);
        flash(save_and_publish([SEO_FILE => ['text' => json_encode($ov, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n"]], 'SEO: ' . $url));
        redirect(url('seo'));
    }
}

$host = preg_replace('#^https?://#', '', config()['site_url']);
layout_start('SEO de ' . $url, 'seo');
?>
<p><a href="<?= e(url('seo')) ?>">← Todas las páginas</a></p>
<h1>SEO de <span class="mono"><?= e($url) ?></span></h1>
<?php foreach ($errores as $er): ?><p class="flash flash--error" role="alert"><?= e($er) ?></p><?php endforeach; ?>
<div class="split">
  <form method="post" action="<?= e(url('seo-editar', ['url' => $url])) ?>" class="form card">
    <?= csrf_field() ?>
    <label>Título en Google
      <input name="title" value="<?= e($title) ?>" maxlength="70" required data-count="65" data-serp="title" aria-describedby="h-title">
    </label>
    <p class="hint" id="h-title"><span data-counter-for="title"></span> Ideal: hasta 60-65 caracteres, con la palabra clave al principio y "| KREOX" al final.</p>
    <label>Descripción en Google
      <textarea name="description" rows="4" maxlength="170" required data-count="158" data-serp="description" aria-describedby="h-desc"><?= e($desc) ?></textarea>
    </label>
    <p class="hint" id="h-desc"><span data-counter-for="description"></span> Ideal: 120-158 caracteres. Responde a lo que busca la persona e invita a entrar.</p>
    <div class="actions">
      <button class="btn btn--sand" type="submit">Guardar y publicar</button>
      <?php if ($actual): ?><button class="btn" type="submit" name="restablecer" value="1" formnovalidate>Restablecer el original</button><?php endif; ?>
    </div>
    <?php if ($actual): ?><p class="hint">Esta página tiene un título o descripción personalizados desde el panel.</p><?php endif; ?>
  </form>
  <aside class="card">
    <h2 class="h3">Así se verá en Google</h2>
    <div class="serp" aria-hidden="true">
      <div class="serp-site"><span class="serp-fav">K</span><span><strong>KREOX</strong><br><span class="serp-url"><?= e($host . rtrim(str_replace('/', ' › ', $url), ' › ')) ?></span></span></div>
      <div class="serp-title" data-serp-out="title"><?= e($title) ?></div>
      <div class="serp-desc" data-serp-out="description"><?= e($desc) ?></div>
    </div>
    <h2 class="h3">Datos de la página</h2>
    <dl class="dl">
      <dt>Titular (H1)</dt><dd><?= e($pag['h1']) ?></dd>
      <dt>Palabras</dt><dd><?= (int) $pag['words'] ?></dd>
      <dt>Datos estructurados</dt><dd><?= e($pag['schema'] ? implode(', ', $pag['schema']) : '—') ?></dd>
      <dt>Idioma</dt><dd><?= e($pag['lang'] === 'en' ? 'Inglés' : 'Español') ?></dd>
    </dl>
  </aside>
</div>
<?php layout_end();
