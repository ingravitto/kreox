// English FAQs. Same facts and computed figures as src/data/faqs.ts (translation only, no new data).
import { PRODUCTOS, M2_POR_NIVELADOR, SITE } from '../site';

const n100 = Math.ceil(100 / M2_POR_NIVELADOR);

export const FAQ_PIKO_EN = [
  {
    q: 'What is the KREOX PIKO?',
    a: 'It is a leveler for self-leveling mortar that is pushed into the insulation board of an underfloor heating system and marks, with its adjustable ring, the finished height of the mortar. It replaces the traditional steel tripod.',
  },
  {
    q: 'How many PIKO do I need per square meter?',
    a: `We recommend roughly one PIKO every ${M2_POR_NIVELADOR} m². For 100 m² you need about ${n100} levelers, so a box of ${PRODUCTOS.piko.caja} units covers about ${PRODUCTOS.piko.caja * M2_POR_NIVELADOR} m².`,
  },
  {
    q: 'Is the PIKO reusable?',
    a: 'Yes. It is removed after pouring, cleaned with water and, since it does not rust, it can be used on many jobs. If the washer wears out, only that part is replaced.',
  },
  {
    q: 'Does it work with any laser?',
    a: 'Yes, it works with both a standard laser and a laser with receiver.',
  },
  {
    q: 'Why is it better than a steel tripod?',
    a: `It weighs about ${PRODUCTOS.piko.pesoG} g versus nearly 1 kg for a tripod, it does not corrode with the alkaline pH of the mortar, it is placed by pushing it into the insulation and its price per unit is lower.`,
  },
  {
    q: 'What are the dimensions of the PIKO?',
    a: `According to the manufacturer’s drawing: ${PRODUCTOS.piko.medidas.altoMm} mm shaft plus a ${PRODUCTOS.piko.medidas.puntaMm} mm tip, ${PRODUCTOS.piko.medidas.baseMm} mm base diameter, ${PRODUCTOS.piko.medidas.fusteMm} mm shaft and ${PRODUCTOS.piko.medidas.arandelaMm} mm washer.`,
  },
  {
    q: 'Where is the PIKO made?',
    a: `It is designed and made in Spain by KREOX, a third-generation family business based in ${SITE.address.city} (${SITE.address.region}). It is a patented product.`,
  },
];

export const FAQ_UNIVERSAL_EN = [
  {
    q: 'What is the KREOX Nivelador Universal used for?',
    a: 'To mark the finished height of self-leveling mortar in screeds and leveling work on any surface, replacing the steel tripod. It rests on its flat base, with no need to push it in.',
  },
  {
    q: 'How many levelers do I need?',
    a: `Roughly one every ${M2_POR_NIVELADOR} m². For 100 m² you would need about ${n100} levelers; each box contains ${PRODUCTOS.universal.caja} units.`,
  },
  {
    q: 'Can it be reused?',
    a: 'Yes. It is removed, cleaned and used again. If a part wears out (base, metal ring or washer), only that part is replaced.',
  },
  {
    q: 'What are the dimensions of the Nivelador Universal?',
    a: `According to the manufacturer’s drawing: a ${PRODUCTOS.universal.medidas.altoMm} mm shaft on a base ${PRODUCTOS.universal.medidas.baseAltoMm} mm high and ${PRODUCTOS.universal.medidas.baseMm} mm in diameter, with a ${PRODUCTOS.universal.medidas.arandelaMm} mm washer.`,
  },
  {
    q: 'How is it different from the PIKO?',
    a: 'The PIKO has a tip and is pushed into the insulation board of underfloor heating. The Nivelador Universal has a flat base and rests on hard surfaces, so it is designed for screeds.',
  },
  {
    q: 'What is new in the 2026 version?',
    a: 'A reinforced base, harder and more resistant during setting, and a fiber-reinforced ring in a new color that is more visible on site. All improvements were tested on real jobs before launch.',
  },
];

export const FAQ_NIVELACION_EN = [
  { q: 'What is a leveling system for self-leveling mortar?', a: 'It is a set of levelers placed on the substrate before pouring that mark, with a laser-adjustable ring, the finished height of the self-leveling mortar. It is used to control the thickness and achieve an even surface.' },
  { q: 'What is the difference between PIKO and the Nivelador Universal?', a: 'The PIKO has a tip and is pushed into the insulation board of underfloor heating. The Nivelador Universal has a flat base and rests on hard surfaces, so it is designed for screeds.' },
  { q: 'How many levelers do I need per m²?', a: `We recommend roughly one leveler every ${M2_POR_NIVELADOR} m². For 100 m², about ${n100} levelers.` },
  { q: 'Why not use steel tripods?', a: 'They weigh about 1 kg each, rust with the alkaline pH of the mortar, are hard to clean and all three legs must be firmly seated. KREOX levelers weigh between 20 and 250 g, do not rust and are placed in seconds.' },
  { q: 'Are they reusable?', a: 'Yes. They are removed after pouring, cleaned and used again. The parts that wear out (washer, base and metal ring) are sold as spare parts.' },
  { q: 'Where are they made?', a: 'In Spain, in Ibi (Alicante). KREOX is a third-generation family business and its levelers are patented products.' },
];

export const FAQ_CALCULADORA_EN = [
  { q: 'How many self-leveling mortar levelers are needed per m²?', a: `As a guide, KREOX recommends one leveler roughly every ${M2_POR_NIVELADOR} m². For 100 m² that is about ${n100} levelers.` },
  { q: 'How many m² does a box of PIKO cover?', a: `A box contains ${PRODUCTOS.piko.caja} PIKO, enough for about ${PRODUCTOS.piko.caja * M2_POR_NIVELADOR} m² in a single pour at the recommended density.` },
  { q: 'How many m² does a box of Nivelador Universal cover?', a: `A box contains ${PRODUCTOS.universal.caja} levelers, enough for about ${PRODUCTOS.universal.caja * M2_POR_NIVELADOR} m² in a single pour at the recommended density.` },
  { q: 'If the levelers are reusable, do I need that many?', a: 'You need enough for the area you are going to pour in one go. Afterwards they are removed, cleaned and reused on the next pour or job.' },
];

export const FAQ_TRIPODE_EN = [
  { q: 'Why do leveling tripods rust?', a: 'Because they are made of steel and mortar has an alkaline pH. Repeated contact with the mortar corrodes them, shortens their life and makes them harder to clean.' },
  { q: 'How much weight do I save with PIKO versus tripods?', a: `With one leveler every ${M2_POR_NIVELADOR} m², 100 m² needs about ${n100} levelers: about ${(n100 * PRODUCTOS.tripode.pesoG) / 1000} kg of steel tripods versus about ${(n100 * PRODUCTOS.piko.pesoG) / 1000} kg of PIKO.` },
  { q: 'Is the PIKO as accurate as a tripod?', a: 'Yes. The height is marked with a laser in the same way (standard or with receiver) and the PIKO ring is adjusted to that line. The ring also acts as a visual reference during pouring.' },
];
