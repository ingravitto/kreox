import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { SITE, NIVELACION, AZULEJOS } from '../data/site';
import { TILE_PRODUCTS } from '../data/azulejos';
import { getNoticias, noticiaUrl, getNews, newsUrl } from '../data/noticias';
import { TILE_PRODUCTS_EN } from '../data/en/tiles';
import { PATHS, alternates } from '../i18n/routes';

import piko from '../assets/img/piko-nivelador-suelo-radiante-kreox.png';
import pikoPlano from '../assets/img/piko-medidas-plano.png';
import pikoSuelo from '../assets/img/hf-piko-suelo-radiante-laser.jpg';
import uni from '../assets/img/nivelador-universal-recrecido-kreox.png';
import uniPlano from '../assets/img/nivelador-universal-medidas-plano.png';
import uniVertido from '../assets/img/hf-universal-recrecido-vertido.jpg';
import hero from '../assets/img/hf-hero-video-poster.jpg';
import estudio from '../assets/img/hf-niveladores-estudio-mortero.jpg';
import arandela from '../assets/img/arandela-niveladora-recambio.png';
import base from '../assets/img/base-niveladora-universal-recambio.png';
import anillaMetal from '../assets/img/anilla-metalica-niveladora-universal.png';
import lamina from '../assets/img/lamina-polietileno-bajo-solera.png';

// Páginas indexables. scripts/check-build.mjs comprueba que no falte ninguna.
const STATIC = [
  '/',
  NIVELACION,
  `${NIVELACION}piko/`,
  `${NIVELACION}nivelador-universal/`,
  `${NIVELACION}recambios/`,
  `${NIVELACION}lamina-bajo-solera/`,
  `${NIVELACION}calculadora/`,
  `${NIVELACION}piko-vs-tripode/`,
  '/preguntas-frecuentes/',
  AZULEJOS,
  ...TILE_PRODUCTS.map((p) => `${AZULEJOS}${p.slug}/`),
  '/noticias/',
  '/empresa/',
  '/contacto/',
  '/aviso-legal/',
  '/politica-privacidad/',
  '/politica-cookies/',
];

// Versión en inglés (mismas páginas; /en/thank-you/ no se indexa).
const E = PATHS.en;
const STATIC_EN = [
  E.home, E.nivelacion, E.piko, E.universal, E.recambios, E.lamina, E.calculadora, E.vsTripode, E.faq,
  E.azulejos, ...TILE_PRODUCTS_EN.map((p) => `${E.azulejos}${p.slug}/`),
  E.noticias, E.empresa, E.contacto, E.avisoLegal, E.privacidad, E.cookies,
];

type Img = { src: ImageMetadata; title: string };
type Vid = { file: string; thumb: ImageMetadata; title: string; description: string; duration: number };

const IMAGES: Record<string, Img[]> = {
  '/': [{ src: hero, title: 'Niveladores PIKO y Universal de KREOX sobre mortero autonivelante' }],
  [NIVELACION]: [{ src: pikoSuelo, title: 'Niveladores PIKO en suelo radiante con láser' }, { src: estudio, title: 'Niveladores KREOX PIKO y Nivelador Universal' }],
  [`${NIVELACION}piko/`]: [
    { src: piko, title: 'PIKO de KREOX, nivelador para mortero autonivelante en suelo radiante' },
    { src: pikoPlano, title: 'Medidas del PIKO' },
    { src: pikoSuelo, title: 'PIKO clavado en placa de suelo radiante con láser' },
  ],
  [`${NIVELACION}nivelador-universal/`]: [
    { src: uni, title: 'Nivelador Universal de KREOX para recrecidos' },
    { src: uniPlano, title: 'Medidas del Nivelador Universal' },
    { src: uniVertido, title: 'Recrecido con mortero autonivelante y Niveladores Universales' },
  ],
  [`${NIVELACION}recambios/`]: [
    { src: arandela, title: 'Arandela niveladora de recambio' },
    { src: base, title: 'Base niveladora universal de recambio' },
    { src: anillaMetal, title: 'Anilla metálica niveladora universal' },
  ],
  [`${NIVELACION}lamina-bajo-solera/`]: [{ src: lamina, title: 'Lámina de polietileno bajo solera' }],
  [E.home]: [{ src: hero, title: 'KREOX Insulation and Universal Screed Levellers on liquid screed' }],
  [E.nivelacion]: [{ src: pikoSuelo, title: 'Insulation Screed Levellers on underfloor heating with a laser' }, { src: estudio, title: 'KREOX Insulation and Universal Screed Levellers' }],
  [E.piko]: [
    { src: piko, title: 'KREOX Insulation Screed Leveller for underfloor heating' },
    { src: pikoPlano, title: 'Insulation Screed Leveller dimensions' },
    { src: pikoSuelo, title: 'Insulation Screed Leveller pushed into an underfloor heating board with a laser' },
  ],
  [E.universal]: [
    { src: uni, title: 'KREOX Universal Screed Leveller for screeds' },
    { src: uniPlano, title: 'Universal Screed Leveller dimensions' },
    { src: uniVertido, title: 'Liquid screed with Universal Screed Levellers' },
  ],
  [E.recambios]: [
    { src: arandela, title: 'Levelling washer spare part' },
    { src: base, title: 'Universal levelling base spare part' },
    { src: anillaMetal, title: 'Universal metal levelling ring' },
  ],
  [E.lamina]: [{ src: lamina, title: 'Underslab polythene sheet' }],
};

const REEL: Vid = { file: '/videos/reel-kreox-piko-universal.mp4', thumb: pikoSuelo, title: 'Nivelar un suelo nunca fue tan fácil: PIKO y Nivelador Universal', description: 'Cómo se nivela mortero autonivelante con PIKO en suelo radiante y con Nivelador Universal en recrecidos, en 30 segundos.', duration: 32 };

const VIDEOS: Record<string, Vid[]> = {
  '/': [{ file: '/videos/hero-niveladores-kreox.mp4', thumb: hero, title: 'Niveladores KREOX sobre mortero autonivelante', description: 'PIKO y Nivelador Universal de KREOX sobre mortero autonivelante recién vertido.', duration: 12 }, REEL],
  [`${NIVELACION}piko/`]: [{ file: '/videos/piko-vertido-suelo-radiante.mp4', thumb: pikoSuelo, title: 'PIKO: vertido de mortero autonivelante sobre suelo radiante', description: 'El mortero autonivelante cubre el suelo radiante y sube hasta la anilla de los niveladores PIKO, marcada con láser.', duration: 8 }, REEL],
  [`${NIVELACION}nivelador-universal/`]: [
    { file: '/videos/universal-vertido-recrecido.mp4', thumb: uniVertido, title: 'Nivelador Universal: recrecido con mortero autonivelante', description: 'El mortero autonivelante avanza sobre la solera entre los Niveladores Universales de KREOX.', duration: 8 },
    { file: '/videos/nivelador-universal-instalacion.mp4', thumb: uniPlano, title: 'Instalación del Nivelador Universal en obra', description: 'Marcado de la cota con láser con receptor y ajuste de la anilla del Nivelador Universal.', duration: 119 },
  ],
  [E.home]: [{ file: '/videos/hero-niveladores-kreox.mp4', thumb: hero, title: 'KREOX levellers on liquid screed', description: 'KREOX Insulation and Universal Screed Levellers on freshly poured liquid screed.', duration: 12 }],
  [E.piko]: [{ file: '/videos/piko-vertido-suelo-radiante.mp4', thumb: pikoSuelo, title: 'Insulation Screed Leveller: pouring liquid screed over underfloor heating', description: 'Liquid screed covers the underfloor heating and rises up to the ring of the Insulation Screed Levellers, set with a laser.', duration: 8 }],
  [E.universal]: [{ file: '/videos/universal-vertido-recrecido.mp4', thumb: uniVertido, title: 'Universal Screed Leveller: liquid screed on a slab', description: 'Liquid screed flows over the slab between KREOX Universal Screed Levellers.', duration: 8 }],
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p: string) => new URL(p, SITE.url).href;

async function entry(path: string, lastmod?: string) {
  const imgs = await Promise.all(
    (IMAGES[path] ?? []).map(async (i) => {
      const o = await getImage({ src: i.src, width: 1600, format: 'webp' });
      return `<image:image><image:loc>${abs(o.src)}</image:loc><image:title>${esc(i.title)}</image:title></image:image>`;
    }),
  );
  const vids = await Promise.all(
    (VIDEOS[path] ?? []).map(async (v) => {
      const t = await getImage({ src: v.thumb, width: 1280, format: 'jpeg' });
      return `<video:video><video:thumbnail_loc>${abs(t.src)}</video:thumbnail_loc><video:title>${esc(v.title)}</video:title><video:description>${esc(v.description)}</video:description><video:content_loc>${abs(v.file)}</video:content_loc><video:duration>${v.duration}</video:duration><video:family_friendly>yes</video:family_friendly></video:video>`;
    }),
  );
  // hreflang: cada URL declara sus versiones en español e inglés (y x-default = español).
  const alt = alternates(path);
  const links = alt.es && alt.en
    ? ['es', 'en'].map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(alt[l as 'es' | 'en']!)}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${abs(alt.es)}"/>`
    : '';
  return `<url><loc>${SITE.url}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${links}${imgs.join('')}${vids.join('')}</url>`;
}

export const GET: APIRoute = async () => {
  const noticias = await getNoticias();
  const news = await getNews();
  const urls = [
    ...(await Promise.all(STATIC.map((u) => entry(u)))),
    ...(await Promise.all(noticias.map((n) => entry(noticiaUrl(n), (n.data.updated ?? n.data.date).toISOString().slice(0, 10))))),
    ...(await Promise.all(STATIC_EN.map((u) => entry(u)))),
    ...(await Promise.all(news.map((n) => entry(newsUrl(n), (n.data.updated ?? n.data.date).toISOString().slice(0, 10))))),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
