// English data for the tile levelling system. Same facts as src/data/azulejos.ts (translation only).
import type { TileProduct } from '../azulejos';
import { TILE_PRODUCTS } from '../azulejos';

const img = (slug: string) => TILE_PRODUCTS.find((p) => p.slug === slug)!.img;

const STEPS_SYSTEM = [
  { title: 'Place the Kalzo spacer clip', text: 'The Kalzo has been developed to break quickly and easily, always at the designed point, leaving the base under the tile.' },
  { title: 'Insert the Kuña levelling wedge', text: 'With the second tile in place, insert the Kuña in the joint and tighten it by hand or with Alikates.' },
  { title: 'Release tension', text: 'It is advisable to tap the tile gently with a mallet once it is level to avoid tension.' },
  { title: 'Remove the system', text: 'Once the screed has set, strike the side of the Kalzo with the mallet. The Kuña is reusable and the leftover Kalzo is recyclable.' },
];

/** `slug` is the English slug; `esSlug` links each product to its Spanish page. */
export const TILE_PRODUCTS_EN: (TileProduct & { esSlug: string })[] = [
  {
    slug: 'kalzo-spacer-clip',
    esSlug: 'kalzo-separador',
    name: 'Kalzo spacer clip',
    title: 'Kalzo spacer clip for tile levelling | KREOX',
    description: 'KREOX Kalzo spacer clip: clean break at the designed point and compatible with every wedge on the market. Joints from 0.5 to 3 mm. Recycled material.',
    img: img('kalzo-separador'),
    alt: 'KREOX Kalzo spacer clips in several colours according to joint width',
    intro: 'Designed and made to make laying ceramic tiles, small or large format, without lippage between tiles.',
    body: 'The KREOX Kalzo spacer clip breaks quickly and easily, always at the point designed for it, leaving the base under the tile. Its height and width are designed to work with every wedge on the market.',
    presentacion: ['Bag of 100 units', 'Bag of 300 units'],
    extra: [{ label: 'Joints', value: 'Kalzo 0.5 · 1.0 · 1.5 · 2.0 · 3.0' }, { label: 'Compatibility', value: 'Every wedge on the market' }],
    steps: STEPS_SYSTEM,
  },
  {
    slug: 'kuna-levelling-wedge',
    esSlug: 'kuna-niveladora',
    name: 'Kuña levelling wedge',
    title: 'Kuña levelling wedge for 3 to 15 mm tiles | KREOX',
    description: 'KREOX Kuña levelling wedge: covers tiles from 3 to 15 mm without spacers, wider for even flatness between tiles. Reusable. Made in Spain.',
    img: img('kuna-niveladora'),
    alt: 'KREOX Kuña levelling wedge for the tile levelling system',
    intro: 'New: the Kuña is wider. Once in place it covers more surface and guarantees even flatness between tiles.',
    body: 'It covers tile thicknesses between 3 and 15 mm without any spacer to increase the height, and sits centred between both tiles for even clamping. It is reusable.',
    presentacion: ['Bag of 300 units'],
    extra: [{ label: 'Tile thickness', value: '3 to 15 mm without spacers' }, { label: 'Reusable', value: 'Yes' }],
    steps: STEPS_SYSTEM,
  },
  {
    slug: 'stain-resistant-kuna-wedge',
    esSlug: 'kuna-antimanchas',
    name: 'Stain-resistant Kuña',
    title: 'Stain-resistant Kuña wedge for light tiles | KREOX',
    description: 'KREOX stain-resistant Kuña: prevents marks on tiles without protectors. With a fin so the pliers never touch the surface. Tiles from 3 to 15 mm.',
    img: img('kuna-antimanchas'),
    alt: 'KREOX stain-resistant Kuña with a fin to protect light-colored tiles',
    intro: 'Designed and developed to prevent marks on tiles without the need for protectors.',
    body: 'It covers tile thicknesses from 3 to 15 mm without spacers and sits centred between both tiles. Thanks to the fin, the Alikates have no direct contact with the surface and the pressure is even across it.',
    presentacion: ['Bag of 300 units'],
    extra: [{ label: 'Tile thickness', value: '3 to 15 mm without spacers' }, { label: 'Fin', value: 'Even pressure, no contact from the pliers' }],
    steps: STEPS_SYSTEM,
  },
  {
    slug: 'alikates-tile-pliers',
    esSlug: 'alikates',
    name: 'Alikates tile pliers',
    title: 'Alikates pliers for tile levelling systems | KREOX',
    description: 'KREOX Alikates for tile levelling systems: adjustable pressure on the wedge to level tiles on floors and walls. Designed for professional installers.',
    img: img('alikates'),
    alt: 'KREOX Alikates pliers for tightening tile levelling wedges',
    intro: 'Developed to make installing ceramic tiles easier on both horizontal and vertical surfaces.',
    body: 'Designed for the comfort of professional installers on large projects. Their job is to apply the pressure needed on the Kuñas to achieve precise levelling and an even surface.',
    presentacion: ['Single unit'],
    steps: [
      { title: 'Set the slider', text: 'Using the wing screw, slide the slider to the position that matches the tile thickness and tighten it firmly.' },
      { title: 'Set the pressure', text: 'Turn the screw clockwise to increase the pushing pressure or counterclockwise to reduce it.' },
      { title: 'Correct setting', text: 'It is the one that gives the maximum push on the wedge without breaking the base or the support clip.' },
    ],
  },
];

// p = productos (posición en el listado) a los que aplica cada pregunta; cada ficha muestra solo las suyas.
export const TILE_FAQ_EN: { q: string; a: string; p: number[] }[] = [
  { q: 'Does the KREOX Kalzo work with other brands’ wedges?', a: 'Yes. Its height and width are designed to be compatible with every wedge on the market.', p: [0] },
  { q: 'What tile thicknesses does the Kuña levelling wedge take?', a: 'Tiles between 3 and 15 mm without the need for spacers.', p: [1] },
  { q: 'What is the stain-resistant Kuña for?', a: 'It prevents marks on tiles without using protectors. Its fin stops the pliers from touching the surface and spreads the pressure.', p: [2, 3] },
  { q: 'Are the Kuñas reusable?', a: 'Yes. The Kuña is reusable and the leftover Kalzo spacer clip is recyclable.', p: [0, 1, 2] },
  { q: 'What are they made of?', a: 'KREOX manufactures in Spain using recycled material.', p: [0, 1, 2, 3] },
];
