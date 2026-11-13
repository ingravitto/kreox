import { PRODUCTOS, M2_POR_NIVELADOR, SITE } from './site';

const n100 = Math.ceil(100 / M2_POR_NIVELADOR);

export const FAQ_PIKO = [
  {
    q: '¿Qué es el PIKO de KREOX?',
    a: 'Es un nivelador para mortero autonivelante que se clava en la placa de aislamiento del suelo radiante y marca, con su anilla regulable, la altura de acabado del mortero. Sustituye al trípode de acero tradicional.',
  },
  {
    q: '¿Cuántos PIKO necesito por metro cuadrado?',
    a: `Se recomienda aproximadamente un PIKO cada ${M2_POR_NIVELADOR} m². Para 100 m² se necesitan unos ${n100} niveladores, es decir, una caja de ${PRODUCTOS.piko.caja} unidades cubre unos ${PRODUCTOS.piko.caja * M2_POR_NIVELADOR} m².`,
  },
  {
    q: '¿El PIKO es reutilizable?',
    a: 'Sí. Se retira después del vertido, se limpia con agua y, como no se oxida, sirve para muchas obras. Si la arandela se desgasta, se cambia solo esa pieza.',
  },
  {
    q: '¿Funciona con cualquier láser?',
    a: 'Sí, es compatible tanto con láser habitual como con láser con receptor.',
  },
  {
    q: '¿Por qué es mejor que un trípode de acero?',
    a: `Pesa unos ${PRODUCTOS.piko.pesoG} g frente a cerca de 1 kg del trípode, no se corroe con el pH alcalino del mortero, se coloca clavándolo en el aislamiento y su precio por unidad es más económico.`,
  },
  {
    q: '¿Qué medidas tiene el PIKO?',
    a: `Según el plano del fabricante: ${PRODUCTOS.piko.medidas.altoMm} mm de fuste más ${PRODUCTOS.piko.medidas.puntaMm} mm de punta, base de ${PRODUCTOS.piko.medidas.baseMm} mm de diámetro, fuste de ${PRODUCTOS.piko.medidas.fusteMm} mm y arandela de ${PRODUCTOS.piko.medidas.arandelaMm} mm.`,
  },
  {
    q: '¿Dónde se fabrica el PIKO?',
    a: `Lo diseña y fabrica en España KREOX, empresa familiar de tercera generación con sede en ${SITE.address.city} (${SITE.address.region}). Es un producto patentado.`,
  },
];

export const FAQ_UNIVERSAL = [
  {
    q: '¿Para qué sirve el Nivelador Universal de KREOX?',
    a: 'Para marcar la altura de acabado del mortero autonivelante en recrecidos y nivelaciones sobre cualquier superficie, sustituyendo al trípode de acero. Se apoya sobre su base plana, sin necesidad de clavarlo.',
  },
  {
    q: '¿Cuántos niveladores necesito?',
    a: `Aproximadamente uno cada ${M2_POR_NIVELADOR} m². Para 100 m² harían falta unos ${n100} niveladores; cada caja trae ${PRODUCTOS.universal.caja} unidades.`,
  },
  {
    q: '¿Se puede reutilizar?',
    a: 'Sí. Se retira, se limpia y se vuelve a usar. Si una pieza se desgasta (base, anilla metálica o arandela) se cambia solo esa pieza.',
  },
  {
    q: '¿Qué medidas tiene el Nivelador Universal?',
    a: `Según el plano del fabricante: fuste de ${PRODUCTOS.universal.medidas.altoMm} mm sobre una base de ${PRODUCTOS.universal.medidas.baseAltoMm} mm de alto y ${PRODUCTOS.universal.medidas.baseMm} mm de diámetro, con arandela de ${PRODUCTOS.universal.medidas.arandelaMm} mm.`,
  },
  {
    q: '¿Qué diferencia hay con el PIKO?',
    a: 'El PIKO tiene punta y se clava en la placa de aislamiento del suelo radiante. El Nivelador Universal tiene base plana y se apoya sobre superficies duras, por lo que está pensado para recrecidos.',
  },
  {
    q: '¿Qué mejoras trae la versión 2026?',
    a: 'Base reforzada, más dura y resistente durante el fraguado, y anilla con aditivo de fibra en un nuevo color más visible en obra. Todas las mejoras se probaron en obra real antes de lanzarlas.',
  },
];

export const FAQ_NIVELACION = [
  { q: '¿Qué es un sistema de nivelación para mortero autonivelante?', a: 'Es un conjunto de niveladores que se colocan sobre el soporte antes del vertido y marcan, con una anilla regulable por láser, la altura de acabado del mortero autonivelante. Sirve para controlar el espesor y conseguir una superficie uniforme.' },
  { q: '¿Qué diferencia hay entre PIKO y el Nivelador Universal?', a: 'El PIKO tiene punta y se clava en la placa de aislamiento del suelo radiante. El Nivelador Universal tiene base plana y se apoya sobre superficies duras, por lo que está pensado para recrecidos.' },
  { q: '¿Cuántos niveladores necesito por m²?', a: `Se recomienda aproximadamente un nivelador cada ${M2_POR_NIVELADOR} m². Para 100 m², unos ${Math.ceil(100 / M2_POR_NIVELADOR)} niveladores.` },
  { q: '¿Por qué no usar trípodes de acero?', a: 'Pesan cerca de 1 kg cada uno, se oxidan con el pH alcalino del mortero, se limpian mal y requieren asentar bien sus tres patas. Los niveladores KREOX pesan entre 20 y 250 g, no se oxidan y se colocan en segundos.' },
  { q: '¿Son reutilizables?', a: 'Sí. Se retiran tras el vertido, se limpian y se vuelven a usar. Las piezas que se desgastan (arandela, base y anilla metálica) se venden como recambio.' },
  { q: '¿Dónde se fabrican?', a: 'En España, en Ibi (Alicante). KREOX es una empresa familiar de tercera generación y sus niveladores son productos patentados.' },
];

export const FAQ_CALCULADORA = [
  { q: '¿Cuántos niveladores de mortero autonivelante se necesitan por m²?', a: `Como referencia, KREOX recomienda un nivelador cada ${M2_POR_NIVELADOR} m² aproximadamente. Para 100 m² son unos ${Math.ceil(100 / M2_POR_NIVELADOR)} niveladores.` },
  { q: '¿Cuántos m² cubre una caja de PIKO?', a: `Una caja trae ${PRODUCTOS.piko.caja} PIKO, suficiente para unos ${PRODUCTOS.piko.caja * M2_POR_NIVELADOR} m² en un mismo vertido con la densidad recomendada.` },
  { q: '¿Cuántos m² cubre una caja de Niveladores Universales?', a: `Una caja trae ${PRODUCTOS.universal.caja} niveladores, suficiente para unos ${PRODUCTOS.universal.caja * M2_POR_NIVELADOR} m² en un mismo vertido con la densidad recomendada.` },
  { q: 'Si los niveladores son reutilizables, ¿necesito tantos?', a: 'Necesitas los suficientes para la superficie que vas a verter de una vez. Después se retiran, se limpian y se reutilizan en el siguiente vertido u obra.' },
];

export const FAQ_TRIPODE = [
  { q: '¿Por qué se oxidan los trípodes de nivelación?', a: 'Porque son de acero y el mortero tiene un pH alcalino. El contacto repetido con el mortero los corroe, los hace menos duraderos y dificulta su limpieza.' },
  { q: '¿Cuánto peso ahorro con PIKO frente a trípodes?', a: `Con un nivelador cada ${M2_POR_NIVELADOR} m², 100 m² necesitan unos ${Math.ceil(100 / M2_POR_NIVELADOR)} niveladores: unos ${(Math.ceil(100 / M2_POR_NIVELADOR) * PRODUCTOS.tripode.pesoG) / 1000} kg en trípodes de acero frente a unos ${(Math.ceil(100 / M2_POR_NIVELADOR) * PRODUCTOS.piko.pesoG) / 1000} kg en PIKO.` },
  { q: '¿El PIKO es igual de preciso que un trípode?', a: 'Sí. La altura se marca igualmente con láser (habitual o con receptor) y la anilla del PIKO se ajusta a esa línea. Además, la anilla sirve de referencia visual durante el vertido.' },
];
