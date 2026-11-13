// Datos únicos de la empresa: se usan en cabecera, pie, schema, llms.txt y páginas legales.
// Si cambia un teléfono o un email, se cambia SOLO aquí.

export const SITE = {
  url: 'https://kreox.es',
  name: 'KREOX',
  legalName: 'TALLERES LA PAZ, S.L.',
  cif: 'B03038932',
  tagline: 'Sistemas de nivelación para mortero autonivelante',
  description:
    'Fabricante español de sistemas de nivelación para mortero autonivelante (PIKO y Nivelador Universal) y de soluciones para la colocación de azulejos.',
  phone: '+34 965 552 170',
  phoneHref: 'tel:+34965552170',
  email: 'comercial@kreox.es',
  emailExport: 'natalia@kreox.es',
  address: {
    street: 'C/ Virgen de la Esperanza, 5',
    postalCode: '03440',
    city: 'Ibi',
    region: 'Alicante',
    country: 'ES',
  },
  social: {
    youtube: 'https://www.youtube.com/@KreoxSistemasdeNivelacion',
    linkedin: 'https://www.linkedin.com/company/kreox/',
    instagram: 'https://www.instagram.com/kreox.es/',
    tiktok: 'https://www.tiktok.com/@kreox.es',
  },
  tileCalculator: 'https://calculadora.kreox.es/',
} as const;

export const NIVELACION = '/nivelacion-mortero-autonivelante/';
export const AZULEJOS = '/colocacion-azulejos/';

export const NAV = [
  {
    label: 'Nivelación autonivelante',
    href: NIVELACION,
    highlight: true,
    children: [
      { label: 'PIKO · Suelo radiante', href: `${NIVELACION}piko/`, note: '20 g · sustituye al trípode de acero' },
      { label: 'Nivelador Universal · Recrecidos', href: `${NIVELACION}nivelador-universal/`, note: 'Base plana para cualquier superficie' },
      { label: 'Recambios y accesorios', href: `${NIVELACION}recambios/`, note: 'Cambia solo la pieza gastada' },
      { label: 'Lámina bajo solera', href: `${NIVELACION}lamina-bajo-solera/`, note: 'Impermeabilización de soleras' },
      { label: 'Calculadora de niveladores', href: `${NIVELACION}calculadora/`, note: '¿Cuántos necesito?' },
      { label: 'PIKO frente al trípode', href: `${NIVELACION}piko-vs-tripode/`, note: 'Comparativa' },
    ],
  },
  {
    label: 'Colocación de azulejos',
    href: AZULEJOS,
    children: [
      { label: 'Kalzo Separador', href: `${AZULEJOS}kalzo-separador/` },
      { label: 'Kuña Niveladora', href: `${AZULEJOS}kuna-niveladora/` },
      { label: 'Kuña Antimanchas', href: `${AZULEJOS}kuna-antimanchas/` },
      { label: 'Alikates', href: `${AZULEJOS}alikates/` },
    ],
  },
  { label: 'Noticias', href: '/noticias/' },
  { label: 'Empresa', href: '/empresa/' },
  { label: 'Ayuda', href: '/preguntas-frecuentes/' },
] as const;

// Densidad recomendada publicada por KREOX: aprox. 1 nivelador cada 2 m².
export const M2_POR_NIVELADOR = 2;

// Datos de producto (los que KREOX publica). Lo no publicado queda fuera, no se inventa.
export const PRODUCTOS = {
  piko: {
    nombre: 'PIKO',
    nombreCompleto: 'PIKO · Nivelador Aislamiento 1',
    url: `${NIVELACION}piko/`,
    uso: 'Suelo radiante sobre placa de aislamiento',
    fijacion: 'Se clava en el aislamiento',
    pesoG: 20,
    caja: 100,
    medidas: { altoMm: 152, puntaMm: 24, baseMm: 50, fusteMm: 20, arandelaMm: 48 },
  },
  universal: {
    nombre: 'Nivelador Universal',
    nombreCompleto: 'Nivelador Recrecido Universal',
    url: `${NIVELACION}nivelador-universal/`,
    uso: 'Recrecidos sobre cualquier superficie',
    fijacion: 'Se apoya sobre su base plana',
    pesoG: 250,
    caja: 40,
    medidas: { altoMm: 142, baseAltoMm: 15, baseMm: 87, fusteMm: 20, arandelaMm: 48 },
  },
  tripode: { pesoG: 1000 },
} as const;
