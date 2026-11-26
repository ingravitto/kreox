import type { APIRoute } from 'astro';
import { SITE, NIVELACION, AZULEJOS, PRODUCTOS, M2_POR_NIVELADOR } from '../data/site';
import { TILE_PRODUCTS } from '../data/azulejos';
import { getNoticias, noticiaUrl, getNews, newsUrl } from '../data/noticias';
import { TILE_PRODUCTS_EN } from '../data/en/tiles';
import { PATHS } from '../i18n/routes';

// Resumen para asistentes de IA (https://llmstxt.org). Se regenera en cada build con los datos actuales.
export const GET: APIRoute = async () => {
  const U = SITE.url;
  const P = PRODUCTOS.piko;
  const N = PRODUCTOS.universal;
  const noticias = (await getNoticias()).filter((n) => n.data.category === 'nivelacion');
  const news = await getNews();
  const E = PATHS.en;
  const txt = `# KREOX

> Fabricante español (${SITE.address.city}, ${SITE.address.region}) de sistemas de nivelación para mortero autonivelante y de soluciones para la colocación de azulejos. Empresa familiar de tercera generación (${SITE.legalName}). Productos diseñados y fabricados en España; niveladores patentados.

## Nivelación para mortero autonivelante (línea principal)

- [PIKO · Nivelador Aislamiento 1](${U}${P.url}): nivelador que se clava en la placa de aislamiento del suelo radiante y marca la altura del mortero autonivelante con una anilla regulable por láser (habitual o con receptor). Sustituye al trípode de acero: unos ${P.pesoG} g frente a ~1 kg, no se oxida, reutilizable. Medidas: fuste ${P.medidas.altoMm} mm + punta ${P.medidas.puntaMm} mm, base Ø${P.medidas.baseMm} mm, arandela Ø${P.medidas.arandelaMm} mm. Caja de ${P.caja}.
- [Nivelador Universal](${U}${N.url}): nivelador con base plana y reforzada para recrecidos con mortero autonivelante sobre cualquier superficie. Unos ${N.pesoG} g, regulable por láser, reutilizable, con recambios. Medidas: fuste ${N.medidas.altoMm} mm, base ${N.medidas.baseAltoMm} mm de alto y Ø${N.medidas.baseMm} mm. Caja de ${N.caja}.
- Densidad recomendada: aproximadamente 1 nivelador por m² (100 m² ≈ ${Math.ceil(100 / M2_POR_NIVELADOR)} niveladores).
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
- [Contacto](${U}/contacto/). El contacto comercial es por WhatsApp (${SITE.whatsappDisplay}). Teléfono ${SITE.phone} · ${SITE.email} · exportación: ${SITE.emailExport}
- Dirección: ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city} (${SITE.address.region}), España

## English

> Spanish manufacturer (${SITE.address.city}, ${SITE.address.region}) of screed levelling systems and tile installation. Third-generation family business (${SITE.legalName}). Designed and made in Spain; patented levellers. English pages: ${U}${E.home}

- [Insulation Screed Leveller](${U}${E.piko}) (sold as PIKO in Spain): leveller pushed into the insulation board of underfloor heating; marks the liquid screed height with a laser-adjustable ring (standard laser or with receiver). Replaces the metal tripod: about ${P.pesoG} g versus ~1 kg, rust-free, reusable. Box of ${P.caja}.
- [Universal Screed Leveller](${U}${E.universal}) (Nivelador Universal in Spain): leveller with a flat, reinforced base for liquid screeds on any surface. About ${N.pesoG} g, laser adjustable, reusable, with spare parts. Box of ${N.caja}.
- Recommended density: roughly 1 leveller per m² (100 m² ≈ ${Math.ceil(100 / M2_POR_NIVELADOR)} levellers).
- [Spare parts](${U}${E.recambios}) · [Leveller calculator](${U}${E.calculadora}) · [Screed leveller vs metal tripod](${U}${E.vsTripode}) · [Levelling systems](${U}${E.nivelacion}) · [FAQ](${U}${E.faq})
- Tile levelling system: ${TILE_PRODUCTS_EN.map((p) => `[${p.name}](${U}${E.azulejos}${p.slug}/)`).join(' · ')}
${news.map((n) => `- [${n.data.title}](${U}${newsUrl(n)}) (${n.data.date.toISOString().slice(0, 10)})`).join('\n')}
- [Company](${U}${E.empresa}) · [Contact](${U}${E.contacto}). Sales contact is via WhatsApp (${SITE.whatsappDisplay}). Export: ${SITE.emailExport}
`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
