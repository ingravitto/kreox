// English FAQs. Same facts and computed figures as src/data/faqs.ts (translation only, no new data).
import { PRODUCTOS, M2_POR_NIVELADOR, MORTERO_KG_M2_MM, SITE } from '../site';

const n100 = Math.ceil(100 / M2_POR_NIVELADOR);

export const FAQ_PIKO_EN = [
  { q: 'Can the Insulation Screed Leveller be used with anhydrite screed?', a: 'Yes. It sets the datum in the same way with cement-based and anhydrite (calcium sulphate) liquid screed: push it into the insulation board, set the ring with the laser and pump the screed up to the ring.' },
  {
    q: 'What is the KREOX Insulation Screed Leveller?',
    a: 'It is a screed leveller that is pushed into the insulation board of an underfloor heating system and marks, with its adjustable ring, the datum height of the screed. It replaces the traditional metal tripod.',
  },
  {
    q: 'How many Insulation Screed Levellers do I need per square metre?',
    a: `We recommend roughly one leveller per m². For 100 m² you need about ${n100} levellers, so a box of ${PRODUCTOS.piko.caja} units covers about ${PRODUCTOS.piko.caja * M2_POR_NIVELADOR} m².`,
  },
  {
    q: 'Is the Insulation Screed Leveller reusable?',
    a: 'Yes. It is removed after pouring, cleaned with water and, since it does not rust, it can be used on many jobs. If the washer wears out, only that part is replaced.',
  },
  {
    q: 'Does it work with any laser?',
    a: 'Yes, it works with both a standard laser and a laser with receiver.',
  },
  {
    q: 'Why is it better than a metal tripod?',
    a: `It weighs about ${PRODUCTOS.piko.pesoG} g versus nearly 1 kg for a tripod, it does not corrode with the alkaline pH of the screed, it is placed by pushing it into the insulation and its price per unit is lower.`,
  },
  {
    q: 'What are the dimensions of the Insulation Screed Leveller?',
    a: `According to the manufacturer’s drawing: ${PRODUCTOS.piko.medidas.altoMm} mm shaft plus a ${PRODUCTOS.piko.medidas.puntaMm} mm tip, ${PRODUCTOS.piko.medidas.baseMm} mm base diameter, ${PRODUCTOS.piko.medidas.fusteMm} mm shaft and ${PRODUCTOS.piko.medidas.arandelaMm} mm washer.`,
  },
  {
    q: 'Where is the Insulation Screed Leveller made?',
    a: `It is designed and made in Spain by KREOX, a third-generation family business based in ${SITE.address.city} (${SITE.address.region}). It is a patented product.`,
  },
];

export const FAQ_UNIVERSAL_EN = [
  { q: 'Can the Universal Screed Leveller be used with anhydrite screed?', a: 'Yes. It works with cement-based and anhydrite liquid screed. Rest it on the substrate, set the ring to the laser line and pour up to the ring.' },
  {
    q: 'What is the KREOX Universal Screed Leveller used for?',
    a: 'To set the datum height of liquid screed when screeding or levelling on any surface, replacing the metal tripod. It rests on its flat base, with no need to push it in.',
  },
  {
    q: 'How many levellers do I need?',
    a: `Roughly one per m². For 100 m² you would need about ${n100} levellers; each box contains ${PRODUCTOS.universal.caja} units.`,
  },
  {
    q: 'Can it be reused?',
    a: 'Yes. It is removed, cleaned and used again. If a part wears out (base, metal ring or washer), only that part is replaced.',
  },
  {
    q: 'What are the dimensions of the Universal Screed Leveller?',
    a: `According to the manufacturer’s drawing: a ${PRODUCTOS.universal.medidas.altoMm} mm shaft on a base ${PRODUCTOS.universal.medidas.baseAltoMm} mm high and ${PRODUCTOS.universal.medidas.baseMm} mm in diameter, with a ${PRODUCTOS.universal.medidas.arandelaMm} mm washer.`,
  },
  {
    q: 'How is it different from the Insulation Screed Leveller?',
    a: 'The Insulation Screed Leveller has a pointed tip and is pushed into the insulation board of underfloor heating. The Universal Screed Leveller has a flat base and rests on hard surfaces, so it is designed for screeds.',
  },
  {
    q: 'What has improved in the current Universal Screed Leveller?',
    a: 'A reinforced base, harder and more resistant during setting, and a fibre-reinforced ring in a new colour that is more visible on site. All improvements were tested on real jobs before launch.',
  },
];

export const FAQ_NIVELACION_EN = [
  { q: 'Levelling tripods, screed pins or levellers: are they the same thing?', a: 'On site they go by many names: levelling tripods, screed pins, screed rails or screed levellers. They all mark the datum level before pouring the liquid screed. The KREOX Insulation and Universal Screed Levellers are plastic levellers that do this job without the weight or rust of a metal tripod.' },
  { q: 'What is a screed levelling system?', a: 'It is a set of levellers placed on the substrate before pouring that mark, with a laser-adjustable ring, the datum height of the liquid screed. It is used to control the thickness and achieve an even surface.' },
  { q: 'What is the difference between the Insulation and the Universal Screed Leveller?', a: 'The Insulation Screed Leveller has a pointed tip and is pushed into the insulation board of underfloor heating. The Universal Screed Leveller has a flat base and rests on hard surfaces, so it is designed for screeds.' },
  { q: 'How many levellers do I need per m²?', a: `We recommend roughly one leveller per m². For 100 m², about ${n100} levellers.` },
  { q: 'Why not use metal tripods?', a: 'They weigh about 1 kg each, rust with the alkaline pH of the screed, are hard to clean and all three legs must be firmly seated. KREOX levellers weigh between 20 and 250 g, do not rust and are placed in seconds.' },
  { q: 'Are they reusable?', a: 'Yes. They are removed after pouring, cleaned and used again. The parts that wear out (washer, base and metal ring) are sold as spare parts.' },
  { q: 'Where are they made?', a: 'In Spain, in Ibi (Alicante). KREOX is a third-generation family business and its levellers are patented products.' },
];

export const FAQ_CALCULADORA_EN = [
  { q: 'How many screed levellers are needed per m²?', a: `As a guide, KREOX recommends roughly one leveller per m². For 100 m² that is about ${n100} levellers.` },
  { q: 'How many m² does a box of Insulation Screed Levellers cover?', a: `A box contains ${PRODUCTOS.piko.caja} levellers, enough for about ${PRODUCTOS.piko.caja * M2_POR_NIVELADOR} m² in a single pour at the recommended density.` },
  { q: 'How many m² does a box of Universal Screed Levellers cover?', a: `A box contains ${PRODUCTOS.universal.caja} levellers, enough for about ${PRODUCTOS.universal.caja * M2_POR_NIVELADOR} m² in a single pour at the recommended density.` },
  { q: 'How much liquid screed do I need?', a: `As a rough guide, about ${MORTERO_KG_M2_MM} kg per m² for every mm of depth: 100 m² at 30 mm is about ${(100 * 30 * MORTERO_KG_M2_MM).toLocaleString('en-GB')} kg. The real amount depends on the manufacturer and the type of screed: always check its data sheet.` },
  { q: 'If the levellers are reusable, do I need that many?', a: 'You need enough for the area you are going to pour in one go. Afterwards they are removed, cleaned and reused on the next pour or job.' },
];

export const FAQ_TRIPODE_EN = [
  { q: 'What is a levelling tripod?', a: 'A three-legged metal stand with a threaded rod that is set to the finished datum height so the liquid screed is poured up to its mark. The KREOX Insulation and Universal Screed Levellers do the same job without steel.' },
  { q: 'What is the alternative to levelling tripods?', a: `KREOX plastic screed levellers: the Insulation Screed Leveller for underfloor heating, pushed into the insulation board, and the Universal Screed Leveller for screeds on a slab, subfloor or existing floor. They set the datum the same way, with a laser, but weigh between ${PRODUCTOS.piko.pesoG} and ${PRODUCTOS.universal.pesoG} g, do not rust and clean with water.` },
  { q: 'What about stainless steel tripods?', a: `They do not rust, but they are still metal, they are heavy and all three legs have to be seated at every point. The insulation leveller weighs about ${PRODUCTOS.piko.pesoG} g and is pushed into the insulation board without tools.` },
  { q: 'How many tripods or levellers do I need per m²?', a: `With KREOX levellers, one per m² on a 1 m grid: 100 m² is about ${n100} levellers. The calculator on this site gives you units and boxes area by area.` },
  { q: 'Why do levelling tripods rust?', a: 'Because they are made of steel and screed has an alkaline pH. Repeated contact with the screed corrodes them, shortens their life and makes them harder to clean.' },
  { q: 'How much weight do I save with screed levellers versus tripods?', a: `With one leveller per m², 100 m² needs about ${n100} levellers: about ${(n100 * PRODUCTOS.tripode.pesoG) / 1000} kg of metal tripods versus about ${(n100 * PRODUCTOS.piko.pesoG) / 1000} kg of Insulation Screed Levellers.` },
  { q: 'Is a plastic screed leveller as accurate as a tripod?', a: 'Yes. The height is marked with a laser in the same way (standard or with receiver) and the leveller’s ring is adjusted to that line. The ring also acts as a visual reference during pouring.' },
];
