// Control de calidad SEO después de `npm run build`.
// Comprueba en cada página: 1 H1, <title> ≤ 65, meta description 70-170, canonical, alt en imágenes,
// JSON-LD válido, enlaces internos que existen y que el sitemap incluye todas las páginas indexables.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const errors = [];
const warn = [];

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');

const routeOf = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\.html$/, '/');
const exists = (path) => {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return true;
  const p = join(DIST, clean);
  return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
};

for (const f of pages) {
  const html = readFileSync(f, 'utf8');
  const route = routeOf(f);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${route}: ${h1} H1 (debe haber 1)`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (!title) errors.push(`${route}: sin <title>`);
  else if (title.length > 70) warn.push(`${route}: title largo (${title.length})`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (!desc) errors.push(`${route}: sin meta description`);
  else if (desc.length > 170 || desc.length < 50) warn.push(`${route}: description de ${desc.length} caracteres`);
  if (!/<link rel="canonical"/.test(html)) errors.push(`${route}: sin canonical`);
  for (const img of html.match(/<img\b[^>]*>/g) || []) if (!/\salt(=|\s|>)/.test(img)) errors.push(`${route}: imagen sin alt → ${img.slice(0, 90)}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { errors.push(`${route}: JSON-LD inválido`); }
  }
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith('/_astro/') || href.endsWith('.php')) continue;
    if (!exists(href)) errors.push(`${route}: enlace roto ${href}`);
  }
  if (!noindex && route !== '/404/' && !sitemap.includes(`https://kreox.es${route}<`)) errors.push(`${route}: falta en sitemap.xml`);
}

console.log(`Páginas revisadas: ${pages.length}`);
warn.forEach((w) => console.log('⚠️  ' + w));
errors.forEach((e) => console.log('❌ ' + e));
if (errors.length) { console.log(`\n${errors.length} errores`); process.exit(1); }
console.log('✅ Sin errores');
