import type { APIRoute } from 'astro';
import { SITE, NIVELACION, AZULEJOS } from '../data/site';
import { TILE_PRODUCTS } from '../data/azulejos';
import { getNoticias, noticiaUrl } from '../data/noticias';

// Lista de páginas indexables. scripts/check-build.mjs comprueba que no falte ninguna.
const STATIC = [
  '/',
  NIVELACION,
  `${NIVELACION}piko/`,
  `${NIVELACION}nivelador-universal/`,
  `${NIVELACION}recambios/`,
  `${NIVELACION}lamina-bajo-solera/`,
  `${NIVELACION}calculadora/`,
  `${NIVELACION}piko-vs-tripode/`,
  AZULEJOS,
  ...TILE_PRODUCTS.map((p) => `${AZULEJOS}${p.slug}/`),
  '/noticias/',
  '/empresa/',
  '/contacto/',
  '/aviso-legal/',
  '/politica-privacidad/',
  '/politica-cookies/',
];

export const GET: APIRoute = async () => {
  const noticias = await getNoticias();
  const urls = [
    ...STATIC.map((u) => `<url><loc>${SITE.url}${u}</loc></url>`),
    ...noticias.map((n) => `<url><loc>${SITE.url}${noticiaUrl(n)}</loc><lastmod>${(n.data.updated ?? n.data.date).toISOString().slice(0, 10)}</lastmod></url>`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
