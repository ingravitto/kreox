import type { APIRoute } from 'astro';
import { SITE, NIVELACION, PRODUCTOS, M2_POR_NIVELADOR } from '../data/site';
import { FAQ_NIVELACION, FAQ_PIKO, FAQ_UNIVERSAL, FAQ_CALCULADORA, FAQ_TRIPODE } from '../data/faqs';
import { TILE_FAQ } from '../data/azulejos';

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
- Regulación: anilla deslizante ajustada con láser habitual o con receptor. Versión 2026 con anilla con aditivo de fibra.
- No se oxida, reutilizable. Recambio: arandela niveladora (caja de 150). Producto patentado, fabricado en España.

## Nivelador Universal · Nivelador Recrecido Universal (${U}${N.url})
- Uso: ${N.uso}. ${N.fijacion}.
- Peso: ≈ ${N.pesoG} g. Caja de ${N.caja} unidades.
- Medidas (mm): fuste ${N.medidas.altoMm}; base ${N.medidas.baseAltoMm} de alto y Ø${N.medidas.baseMm}; arandela Ø${N.medidas.arandelaMm}.
- Base reforzada en 2026. Recambios: base niveladora universal (caja 40), anilla metálica niveladora universal (caja 40), arandela niveladora (caja 150). Producto patentado, fabricado en España.

## Regla de cálculo
- Densidad recomendada: aprox. 1 nivelador cada ${M2_POR_NIVELADOR} m² (100 m² ≈ ${Math.ceil(100 / M2_POR_NIVELADOR)} niveladores).
- Calculadora: ${U}${NIVELACION}calculadora/

${qa('Preguntas frecuentes · nivelación', FAQ_NIVELACION)}

${qa('Preguntas frecuentes · PIKO', FAQ_PIKO)}

${qa('Preguntas frecuentes · Nivelador Universal', FAQ_UNIVERSAL)}

${qa('Preguntas frecuentes · cantidades', FAQ_CALCULADORA)}

${qa('Preguntas frecuentes · PIKO frente al trípode de acero', FAQ_TRIPODE)}

${qa('Preguntas frecuentes · colocación de azulejos', TILE_FAQ)}
`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
