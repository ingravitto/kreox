// Inventario de páginas para el panel (/panel/ → SEO). Se ejecuta después de `astro build`:
// lee cada HTML de dist/ y guarda título, descripción, H1, idioma, palabras y avisos en dist/panel/_data/paginas.json.
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => decode(h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const pages = [];
for (const f of walk(DIST).filter((f) => f.endsWith('index.html'))) {
  const url = '/' + relative(DIST, f).replace(/index\.html$/, '');
  if (url.startsWith('/panel/')) continue;
  const html = readFileSync(f, 'utf8');
  const get = (re) => decode(html.match(re)?.[1] ?? '');
  const title = get(/<title>([\s\S]*?)<\/title>/);
  const description = get(/<meta name="description" content="([^"]*)"/);
  const robots = get(/<meta name="robots" content="([^"]*)"/);
  const lang = get(/<html[^>]*\slang="([^"]+)"/) || 'es';
  const h1 = text(html.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? '');
  const main = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '';
  const words = text(main).split(' ').filter(Boolean).length;
  const schema = [...new Set([...html.matchAll(/"@type":"(Product|FAQPage|HowTo|NewsArticle|VideoObject|ItemList|BreadcrumbList)"/g)].map((m) => m[1]))];
  const avisos = [];
  if (title.length > 65) avisos.push(`Título largo (${title.length} caracteres): Google lo cortará.`);
  if (title.length < 25) avisos.push(`Título corto (${title.length} caracteres).`);
  if (description.length > 158) avisos.push(`Descripción larga (${description.length}): Google la cortará.`);
  if (description.length < 70) avisos.push(`Descripción corta (${description.length}).`);
  const noindex = /noindex/.test(robots);
  pages.push({ url, lang, title, description, h1, words, schema, noindex, avisos });
}
pages.sort((a, b) => a.url.localeCompare(b.url));
mkdirSync(join(DIST, 'panel/_data'), { recursive: true });
writeFileSync(join(DIST, 'panel/_data/paginas.json'), JSON.stringify({ generado: new Date().toISOString(), paginas: pages }));
console.log(`Panel: inventario de ${pages.length} páginas`);
