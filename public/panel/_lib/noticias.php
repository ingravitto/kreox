<?php
// Lectura y escritura de noticias (Markdown con cabecera YAML) con el formato exacto que usa la web,
// validación con las reglas de CLAUDE.md y una vista previa Markdown sencilla.

declare(strict_types=1);

/** Interpreta el subconjunto de YAML que usan las noticias. */
function parse_noticia(string $raw): array
{
    $raw = str_replace("\r\n", "\n", $raw);
    $data = ['title' => '', 'seoTitle' => '', 'description' => '', 'date' => '', 'updated' => '', 'category' => 'nivelacion', 'products' => [], 'image' => '', 'imageAlt' => '', 'faq' => [], 'draft' => false, 'body' => ''];
    if (!preg_match('/^---\n(.*?)\n---\n?(.*)$/s', $raw, $m)) { $data['body'] = $raw; return $data; }
    $data['body'] = ltrim($m[2], "\n");
    $faq = null;
    foreach (explode("\n", $m[1]) as $line) {
        if (trim($line) === '') continue;
        if (preg_match('/^\s+-\s*q:\s*(.*)$/', $line, $mm)) { $data['faq'][] = ['q' => yaml_scalar($mm[1]), 'a' => '']; $faq = count($data['faq']) - 1; continue; }
        if (preg_match('/^\s+a:\s*(.*)$/', $line, $mm) && $faq !== null) { $data['faq'][$faq]['a'] = yaml_scalar($mm[1]); continue; }
        if (!preg_match('/^(\w+):\s*(.*)$/', $line, $mm)) continue;
        [$k, $v] = [$mm[1], $mm[2]];
        if ($k === 'faq') { $faq = null; continue; }
        if ($k === 'products') { $data['products'] = array_values(array_filter(array_map('trim', explode(',', trim($v, '[] '))))); continue; }
        if ($k === 'draft') { $data['draft'] = trim($v) === 'true'; continue; }
        $data[$k] = yaml_scalar($v);
    }
    return $data;
}

function yaml_scalar(string $v): string
{
    $v = trim($v);
    if ($v === '') return '';
    if ($v[0] === "'" && substr($v, -1) === "'") return str_replace("''", "'", substr($v, 1, -1));
    if ($v[0] === '"' && substr($v, -1) === '"') return stripcslashes(substr($v, 1, -1));
    return $v;
}

function yq(string $s): string { return "'" . str_replace("'", "''", trim(preg_replace('/\s+/', ' ', $s))) . "'"; }

/** Genera el archivo .md con el mismo formato que las noticias existentes. */
function build_noticia(array $d): string
{
    $o = "---\n";
    $o .= 'title: ' . yq($d['title']) . "\n";
    if (trim($d['seoTitle']) !== '') $o .= 'seoTitle: ' . yq($d['seoTitle']) . "\n";
    $o .= 'description: ' . yq($d['description']) . "\n";
    $o .= 'date: ' . $d['date'] . "\n";
    if (!empty($d['updated'])) $o .= 'updated: ' . $d['updated'] . "\n";
    $o .= 'category: ' . $d['category'] . "\n";
    if ($d['products']) $o .= 'products: [' . implode(', ', $d['products']) . "]\n";
    if ($d['image'] !== '') {
        $o .= 'image: ' . $d['image'] . "\n";
        $o .= 'imageAlt: ' . yq($d['imageAlt']) . "\n";
    }
    if ($d['faq']) {
        $o .= "faq:\n";
        foreach ($d['faq'] as $f) $o .= '  - q: ' . yq($f['q']) . "\n    a: " . yq($f['a']) . "\n";
    }
    if (!empty($d['draft'])) $o .= "draft: true\n";
    $o .= "---\n\n" . rtrim(str_replace("\r\n", "\n", $d['body'])) . "\n";
    return $o;
}

/** Comprueba las reglas de la web. Devuelve [errores, avisos]. */
function validar_noticia(array $d, bool $nueva, array $slugsExistentes, string $slug): array
{
    $err = [];
    $warn = [];
    if (trim($d['title']) === '') $err[] = 'El título es obligatorio.';
    if (mb_len($d['seoTitle']) > 65) $err[] = 'El título SEO no puede pasar de 65 caracteres (tiene ' . mb_len($d['seoTitle']) . ').';
    $dl = mb_len(trim($d['description']));
    if ($dl === 0) $err[] = 'La descripción es obligatoria.';
    elseif ($dl > 170) $err[] = 'La descripción no puede pasar de 170 caracteres (tiene ' . $dl . ').';
    elseif ($dl > 158) $warn[] = 'Google puede cortar la descripción a partir de unos 158 caracteres.';
    elseif ($dl < 70) $warn[] = 'La descripción es corta: mejor entre 120 y 158 caracteres.';
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $d['date'])) $err[] = 'La fecha no es válida.';
    if (!isset(CATEGORIAS[$d['category']])) $err[] = 'Elige una categoría.';
    foreach ($d['products'] as $p) if (!isset(PRODUCTOS[$p])) $err[] = 'Producto no válido: ' . $p;
    if ($d['image'] !== '' && trim($d['imageAlt']) === '') $err[] = 'Describe la imagen (texto alternativo): es obligatorio para la accesibilidad.';
    foreach ($d['faq'] as $i => $f) if (trim($f['q']) === '' || trim($f['a']) === '') $err[] = 'La pregunta frecuente ' . ($i + 1) . ' necesita pregunta y respuesta.';
    if (trim($d['body']) === '') $err[] = 'El texto de la noticia está vacío.';
    if (!preg_match('#\]\(/(en/)?(nivelacion-mortero-autonivelante|colocacion-azulejos|screed-levellers|tile-levelling-system)/#', $d['body'])) {
        $err[] = 'Enlaza al menos una ficha de producto en el texto, por ejemplo [PIKO](/nivelacion-mortero-autonivelante/piko/).';
    }
    if (preg_match('/\b(Pikos?|PiKo|pico)\b/u', $d['title'] . ' ' . $d['body'])) $warn[] = 'El producto se escribe siempre "PIKO" (en mayúsculas).';
    if ($nueva) {
        if ($slug === '' || !preg_match('/^[a-z0-9]+(-[a-z0-9]+)*$/', $slug)) $err[] = 'La dirección (URL) solo puede tener minúsculas, números y guiones.';
        elseif (in_array($slug, $slugsExistentes, true)) $err[] = 'Ya existe una noticia con esa dirección.';
    }
    return [$err, $warn];
}

/** Lista las noticias de un idioma desde GitHub (leídas en paralelo). */
function listar_noticias(string $lang): array
{
    $col = COLECCIONES[$lang];
    $gh = github();
    $files = array_filter($gh->listDir($col['dir']), function ($f) { return substr($f['name'], -3) === '.md'; });
    $raws = $gh->readMany(array_map(function ($f) { return $f['path']; }, $files));
    $out = [];
    foreach ($files as $f) {
        $slug = substr($f['name'], 0, -3);
        $d = parse_noticia($raws[$f['path']] ?? '');
        $d['slug'] = $slug;
        $d['url'] = $col['url'] . $slug . '/';
        $out[] = $d;
    }
    usort($out, function ($a, $b) { return strcmp($b['date'], $a['date']); });
    return $out;
}

/** Markdown sencillo para la vista previa (encabezados, negrita, cursiva, enlaces, listas y párrafos). */
function md_preview(string $md): string
{
    $md = str_replace("\r\n", "\n", $md);
    $html = '';
    $blocks = preg_split("/\n{2,}/", trim($md));
    $inline = function (string $t): string {
        $t = e($t);
        $t = preg_replace('/\*\*(.+?)\*\*/s', '<strong>$1</strong>', $t);
        $t = preg_replace('/(?<!\*)\*(?!\*)(.+?)\*/s', '<em>$1</em>', $t);
        return preg_replace_callback('/\[([^\]]+)\]\(([^)\s]+)\)/', function ($m) {
            return '<a href="' . $m[2] . '">' . $m[1] . '</a>';
        }, $t);
    };
    foreach ($blocks as $b) {
        if (preg_match('/^(#{1,4})\s+(.*)$/', $b, $m)) { $l = strlen($m[1]) + 1; $html .= "<h$l>" . $inline($m[2]) . "</h$l>"; continue; }
        $lines = explode("\n", $b);
        if (preg_match('/^\s*[-*]\s+/', $lines[0])) {
            $html .= '<ul>' . implode('', array_map(function ($l) use ($inline) { return '<li>' . $inline(preg_replace('/^\s*[-*]\s+/', '', $l)) . '</li>'; }, $lines)) . '</ul>';
            continue;
        }
        if (preg_match('/^\s*\d+\.\s+/', $lines[0])) {
            $html .= '<ol>' . implode('', array_map(function ($l) use ($inline) { return '<li>' . $inline(preg_replace('/^\s*\d+\.\s+/', '', $l)) . '</li>'; }, $lines)) . '</ol>';
            continue;
        }
        if ($b[0] === '>') { $html .= '<blockquote>' . $inline(preg_replace('/^>\s?/m', '', $b)) . '</blockquote>'; continue; }
        $html .= '<p>' . $inline(implode(' ', $lines)) . '</p>';
    }
    return $html;
}
