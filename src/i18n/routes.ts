// Idiomas de la web y mapa único de rutas ES ↔ EN.
// Se usa para: <html lang>, hreflang, og:locale, el selector de idioma y las alternativas del sitemap.
// Si se crea una página nueva con versión en inglés, se añade aquí su pareja.

export type Lang = 'es' | 'en';
export const LANGS: Lang[] = ['es', 'en'];

/** El idioma sale de la URL: todo lo que cuelga de /en/ es inglés. */
export const langFromPath = (path: string): Lang => (path === '/en' || path.startsWith('/en/') ? 'en' : 'es');

const ES_NIV = '/nivelacion-mortero-autonivelante/';
const ES_AZU = '/colocacion-azulejos/';
const EN_NIV = '/en/screed-levellers/';
const EN_AZU = '/en/tile-levelling-system/';

/** Rutas de cada idioma, para construir enlaces sin escribir URLs a mano en los componentes. */
export const PATHS = {
  es: {
    home: '/',
    nivelacion: ES_NIV,
    piko: `${ES_NIV}piko/`,
    universal: `${ES_NIV}nivelador-universal/`,
    recambios: `${ES_NIV}recambios/`,
    lamina: `${ES_NIV}lamina-bajo-solera/`,
    calculadora: `${ES_NIV}calculadora/`,
    vsTripode: `${ES_NIV}tripodes-de-nivelacion/`,
    azulejos: ES_AZU,
    kalzo: `${ES_AZU}kalzo-separador/`,
    kunaNiveladora: `${ES_AZU}kuna-niveladora/`,
    kunaAntimanchas: `${ES_AZU}kuna-antimanchas/`,
    alikates: `${ES_AZU}alikates/`,
    noticias: '/noticias/',
    empresa: '/empresa/',
    contacto: '/contacto/',
    faq: '/preguntas-frecuentes/',
    gracias: '/gracias/',
    avisoLegal: '/aviso-legal/',
    privacidad: '/politica-privacidad/',
    cookies: '/politica-cookies/',
  },
  en: {
    home: '/en/',
    nivelacion: EN_NIV,
    piko: `${EN_NIV}insulation-screed-leveller/`,
    universal: `${EN_NIV}universal-screed-leveller/`,
    recambios: `${EN_NIV}spare-parts/`,
    lamina: `${EN_NIV}underslab-polythene-sheet/`,
    calculadora: `${EN_NIV}calculator/`,
    vsTripode: `${EN_NIV}screed-leveller-vs-metal-tripod/`,
    azulejos: EN_AZU,
    kalzo: `${EN_AZU}kalzo-spacer-clip/`,
    kunaNiveladora: `${EN_AZU}kuna-levelling-wedge/`,
    kunaAntimanchas: `${EN_AZU}stain-resistant-kuna-wedge/`,
    alikates: `${EN_AZU}alikates-tile-pliers/`,
    noticias: '/en/news/',
    empresa: '/en/company/',
    contacto: '/en/contact/',
    faq: '/en/faq/',
    gracias: '/en/thank-you/',
    avisoLegal: '/en/legal-notice/',
    privacidad: '/en/privacy-policy/',
    cookies: '/en/cookie-policy/',
  },
} as const;

export type PathKey = keyof (typeof PATHS)['es'];

/** Noticias traducidas: slug ES → slug EN (las que no están aquí solo existen en español). */
export const NEWS_PAIRS: [string, string][] = [
  ['como-nivelar-mortero-autonivelante-suelo-radiante', 'how-to-level-liquid-screed-over-underfloor-heating'],
  ['recrecido-mortero-autonivelante-como-marcar-la-cota', 'liquid-screed-how-to-set-the-datum-level'],
  ['sistemas-de-nivelacion-para-mortero-autonivelante', 'screed-levelling-systems'],
];

// Pares de páginas (excepto /gracias/, que no se indexa, pero sí se enlaza en el selector).
const PAIRS: [string, string][] = [
  ...(Object.keys(PATHS.es) as PathKey[]).map((k) => [PATHS.es[k], PATHS.en[k]] as [string, string]),
  ...NEWS_PAIRS.map(([es, en]) => [`/noticias/${es}/`, `/en/news/${en}/`] as [string, string]),
];
const ES_TO_EN = new Map(PAIRS);
const EN_TO_ES = new Map(PAIRS.map(([es, en]) => [en, es]));

/** Versiones de una página en cada idioma (solo las que existen). */
export function alternates(path: string): Partial<Record<Lang, string>> {
  if (ES_TO_EN.has(path)) return { es: path, en: ES_TO_EN.get(path)! };
  if (EN_TO_ES.has(path)) return { es: EN_TO_ES.get(path)!, en: path };
  return { [langFromPath(path)]: path };
}

/** Página equivalente en el otro idioma; si no existe, la portada de ese idioma. */
export function counterpart(path: string, to: Lang): string {
  return alternates(path)[to] ?? PATHS[to].home;
}
