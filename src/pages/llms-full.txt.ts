import type { APIRoute } from 'astro';
import { SITE, NIVELACION, PRODUCTOS, M2_POR_NIVELADOR } from '../data/site';
import { FAQ_NIVELACION, FAQ_PIKO, FAQ_UNIVERSAL, FAQ_CALCULADORA, FAQ_TRIPODE } from '../data/faqs';
import { TILE_FAQ } from '../data/azulejos';
import { FAQ_NIVELACION_EN, FAQ_PIKO_EN, FAQ_UNIVERSAL_EN, FAQ_CALCULADORA_EN, FAQ_TRIPODE_EN } from '../data/en/faqs';
import { TILE_FAQ_EN } from '../data/en/tiles';
import { PATHS } from '../i18n/routes';

// Versión extendida de llms.txt: todos los datos de producto y todas las preguntas frecuentes en texto plano.
export const GET: APIRoute = () => {
  const U = SITE.url;
  const P = PRODUCTOS.piko;
  const N = PRODUCTOS.universal;
  const qa = (title: string, list: { q: string; a: string }[]) => `## ${title}\n\n${list.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}`;
  const txt = `# KREOX · información completa

> ${SITE.description} Marca de ${SITE.legalName} (CIF ${SITE.cif}), ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city} (${SITE.address.region}), España. Teléfono ${SITE.phone}. Email ${SITE.email}. Exportación ${SITE.emailExport}.

## PIKO · Nivelador Aislamiento 1 (${U}${P.url})
- Uso: ${P.uso}. ${P.fijacion}.
- Peso: ≈ ${P.pesoG} g. Caja de ${P.caja} unidades.
- Medidas (mm): fuste ${P.medidas.altoMm} + punta ${P.medidas.puntaMm}; base Ø${P.medidas.baseMm}; fuste ${P.medidas.fusteMm}; arandela Ø${P.medidas.arandelaMm}.
- Regulación: anilla deslizante ajustada con láser habitual o con receptor. Anilla con aditivo de fibra.
- No se oxida, reutilizable. Recambio: arandela niveladora (caja de 150). Producto patentado, fabricado en España.

## Nivelador Universal · Nivelador Recrecido Universal (${U}${N.url})
- Uso: ${N.uso}. ${N.fijacion}.
- Peso: ≈ ${N.pesoG} g. Caja de ${N.caja} unidades.
- Medidas (mm): fuste ${N.medidas.altoMm}; base ${N.medidas.baseAltoMm} de alto y Ø${N.medidas.baseMm}; arandela Ø${N.medidas.arandelaMm}.
- Base reforzada. Recambios: base niveladora universal (caja 40), anilla metálica niveladora universal (caja 40), arandela niveladora (caja 150). Producto patentado, fabricado en España.

## Regla de cálculo
- Densidad recomendada: aprox. 1 nivelador cada ${M2_POR_NIVELADOR} m² (100 m² ≈ ${Math.ceil(100 / M2_POR_NIVELADOR)} niveladores).
- Calculadora: ${U}${NIVELACION}calculadora/

${qa('Preguntas frecuentes · nivelación', FAQ_NIVELACION)}

${qa('Preguntas frecuentes · PIKO', FAQ_PIKO)}

${qa('Preguntas frecuentes · Nivelador Universal', FAQ_UNIVERSAL)}

${qa('Preguntas frecuentes · cantidades', FAQ_CALCULADORA)}

${qa('Preguntas frecuentes · PIKO frente al trípode de acero', FAQ_TRIPODE)}

${qa('Preguntas frecuentes · colocación de azulejos', TILE_FAQ)}

# English

> KREOX is a Spanish manufacturer of leveling systems for self-leveling mortar (PIKO and Nivelador Universal) and tile installation solutions. English pages: ${U}${PATHS.en.home}

- PIKO (${U}${PATHS.en.piko}): ≈ ${P.pesoG} g, box of ${P.caja}; dimensions (mm): shaft ${P.medidas.altoMm} + tip ${P.medidas.puntaMm}; base Ø${P.medidas.baseMm}; washer Ø${P.medidas.arandelaMm}. Pushed into underfloor heating insulation.
- Nivelador Universal (${U}${PATHS.en.universal}): ≈ ${N.pesoG} g, box of ${N.caja}; dimensions (mm): shaft ${N.medidas.altoMm}; base ${N.medidas.baseAltoMm} high and Ø${N.medidas.baseMm}; washer Ø${N.medidas.arandelaMm}. Rests on its flat base, for screeds.
- Recommended density: about 1 leveler every ${M2_POR_NIVELADOR} m².

${qa('FAQ · leveling', FAQ_NIVELACION_EN)}

${qa('FAQ · PIKO', FAQ_PIKO_EN)}

${qa('FAQ · Nivelador Universal', FAQ_UNIVERSAL_EN)}

${qa('FAQ · quantities', FAQ_CALCULADORA_EN)}

${qa('FAQ · PIKO versus the steel tripod', FAQ_TRIPODE_EN)}

${qa('FAQ · tile installation', TILE_FAQ_EN)}
`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
