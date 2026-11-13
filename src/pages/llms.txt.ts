import type { APIRoute } from 'astro';
import { SITE, NIVELACION, AZULEJOS, PRODUCTOS, M2_POR_NIVELADOR } from '../data/site';
import { TILE_PRODUCTS } from '../data/azulejos';
import { getNoticias, noticiaUrl } from '../data/noticias';

// Resumen para asistentes de IA (https://llmstxt.org). Se regenera en cada build con los datos actuales.
export const GET: APIRoute = async () => {
  const U = SITE.url;
  const P = PRODUCTOS.piko;
  const N = PRODUCTOS.universal;
  const noticias = (await getNoticias()).filter((n) => n.data.category === 'nivelacion');
  const txt = `# KREOX

> Fabricante español (${SITE.address.city}, ${SITE.address.region}) de sistemas de nivelación para mortero autonivelante y de soluciones para la colocación de azulejos. Empresa familiar de tercera generación (${SITE.legalName}). Productos diseñados y fabricados en España; niveladores patentados.

## Nivelación para mortero autonivelante (línea principal)

- [PIKO · Nivelador Aislamiento 1](${U}${P.url}): nivelador que se clava en la placa de aislamiento del suelo radiante y marca la altura del mortero autonivelante con una anilla regulable por láser (habitual o con receptor). Sustituye al trípode de acero: unos ${P.pesoG} g frente a ~1 kg, no se oxida, reutilizable. Medidas: fuste ${P.medidas.altoMm} mm + punta ${P.medidas.puntaMm} mm, base Ø${P.medidas.baseMm} mm, arandela Ø${P.medidas.arandelaMm} mm. Caja de ${P.caja}.
- [Nivelador Universal](${U}${N.url}): nivelador con base plana y reforzada para recrecidos con mortero autonivelante sobre cualquier superficie. Unos ${N.pesoG} g, regulable por láser, reutilizable, con recambios. Medidas: fuste ${N.medidas.altoMm} mm, base ${N.medidas.baseAltoMm} mm de alto y Ø${N.medidas.baseMm} mm. Caja de ${N.caja}.
- Densidad recomendada: aproximadamente 1 nivelador cada ${M2_POR_NIVELADOR} m² (100 m² ≈ ${Math.ceil(100 / M2_POR_NIVELADOR)} niveladores).
- [Recambios](${U}${NIVELACION}recambios/): arandela niveladora (caja 150), base niveladora universal (caja 40), anilla metálica niveladora universal (caja 40).
- [Lámina de polietileno bajo solera](${U}${NIVELACION}lamina-bajo-solera/)
- [Calculadora de niveladores](${U}${NIVELACION}calculadora/)
- [Comparativa PIKO vs trípode de acero](${U}${NIVELACION}piko-vs-tripode/)
- [Página general de sistemas de nivelación](${U}${NIVELACION})
- [Preguntas frecuentes](${U}/preguntas-frecuentes/)
- [Información completa para IA](${U}/llms-full.txt)

## Colocación de azulejos

${TILE_PRODUCTS.map((p) => `- [${p.name}](${U}${AZULEJOS}${p.slug}/): ${p.intro}`).join('\n')}

## Noticias sobre nivelación

${noticias.map((n) => `- [${n.data.title}](${U}${noticiaUrl(n)}) (${n.data.date.toISOString().slice(0, 10)})`).join('\n')}

## Empresa y contacto

- [Empresa](${U}/empresa/)
- [Contacto y tarifa 2026](${U}/contacto/): ${SITE.phone} · ${SITE.email} · exportación: ${SITE.emailExport}
- Dirección: ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city} (${SITE.address.region}), España
`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
