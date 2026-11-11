import type { ImageMetadata } from 'astro';
import kalzo from '../assets/img/kalzo-separador-kreox.jpg';
import kunaNiv from '../assets/img/kuna-niveladora-kreox.jpg';
import kunaAnti from '../assets/img/kuna-antimanchas-kreox.jpg';
import alikates from '../assets/img/alikates-kreox.jpg';

export interface TileProduct {
  slug: string;
  name: string;
  title: string;
  description: string;
  img: ImageMetadata;
  alt: string;
  intro: string;
  body: string;
  presentacion: string[];
  extra?: { label: string; value: string }[];
  steps: { title: string; text: string }[];
}

const STEPS_SISTEMA = [
  { title: 'Colocar Kalzo Separador', text: 'El Kalzo se ha desarrollado para que su rotura sea rápida y sencilla y siempre rompa por el lugar diseñado, quedando la base bajo la baldosa.' },
  { title: 'Colocar Kuña Niveladora', text: 'Con la segunda baldosa en su sitio, se coloca la Kuña en la junta y se ajusta de forma manual o con Alikates.' },
  { title: 'Liberar tensión', text: 'Es aconsejable macear suavemente la baldosa una vez nivelada para evitar tensiones.' },
  { title: 'Retirar el sistema', text: 'Una vez fraguado el mortero, se golpea el Kalzo por su parte lateral con la maza. La Kuña es reutilizable y el sobrante del Kalzo, reciclable.' },
];

export const TILE_PRODUCTS: TileProduct[] = [
  {
    slug: 'kalzo-separador',
    name: 'Kalzo Separador',
    title: 'Kalzo Separador para nivelación de baldosas | KREOX',
    description: 'Kalzo Separador KREOX: rotura limpia por el punto previsto, compatible con todas las kuñas del mercado. Juntas de 0,5 a 3 mm. Fabricado en España con material reciclado.',
    img: kalzo,
    alt: 'Kalzos separadores KREOX de varios colores según grosor de junta',
    intro: 'Diseñado y fabricado para facilitar y garantizar la colocación de baldosas cerámicas, de pequeño o gran formato, de forma ágil y eficiente.',
    body: 'El Kalzo separador de KREOX rompe de forma rápida y sencilla y siempre por el lugar diseñado para ello, dejando la base bajo la baldosa. Su altura y anchura están pensadas para funcionar con todas las kuñas del mercado.',
    presentacion: ['Bolsa de 100 unidades', 'Bolsa de 300 unidades'],
    extra: [{ label: 'Juntas', value: 'Kalzo 0,5 · 1,0 · 1,5 · 2,0 · 3,0' }, { label: 'Compatibilidad', value: 'Todas las kuñas del mercado' }],
    steps: STEPS_SISTEMA,
  },
  {
    slug: 'kuna-niveladora',
    name: 'Kuña Niveladora',
    title: 'Kuña Niveladora para baldosas de 3 a 15 mm | KREOX',
    description: 'Kuña Niveladora KREOX: abarca losas de 3 a 15 mm sin suplementos, más ancha para una planitud uniforme entre baldosas. Reutilizable. Fabricada en España.',
    img: kunaNiv,
    alt: 'Kuña niveladora KREOX para sistema de nivelación de baldosas',
    intro: 'Como novedad, la Kuña es más ancha: una vez colocada abarca más superficie y garantiza una planitud uniforme entre baldosas.',
    body: 'Permite abarcar espesores de losa entre 3 y 15 mm sin ningún suplemento para aumentar la altura, y queda centrada entre ambas baldosas para conseguir un apriete uniforme. Es reutilizable.',
    presentacion: ['Bolsa de 300 unidades'],
    extra: [{ label: 'Espesor de losa', value: '3 a 15 mm sin suplementos' }, { label: 'Reutilizable', value: 'Sí' }],
    steps: STEPS_SISTEMA,
  },
  {
    slug: 'kuna-antimanchas',
    name: 'Kuña Antimanchas',
    title: 'Kuña Antimanchas para baldosas claras | KREOX',
    description: 'Kuña Antimanchas KREOX: evita el marcado de las baldosas sin protectores. Con aleta para que los alicates no toquen la superficie. Losas de 3 a 15 mm.',
    img: kunaAnti,
    alt: 'Kuña antimanchas KREOX con aleta para proteger baldosas claras',
    intro: 'Pensada y desarrollada para evitar el marcado de las baldosas sin necesidad de usar protectores.',
    body: 'Abarca espesores de losa de 3 a 15 mm sin suplementos y queda centrada entre ambas baldosas. Gracias a la aleta, los Alikates no tienen contacto directo con la superficie y la presión es igual en toda ella.',
    presentacion: ['Bolsa de 300 unidades'],
    extra: [{ label: 'Espesor de losa', value: '3 a 15 mm sin suplementos' }, { label: 'Aleta', value: 'Presión uniforme y sin contacto de los alicates' }],
    steps: STEPS_SISTEMA,
  },
  {
    slug: 'alikates',
    name: 'Alikates',
    title: 'Alikates para sistemas de nivelación de baldosas | KREOX',
    description: 'Alikates KREOX para sistemas de nivelación: presión regulable sobre la kuña para nivelar baldosas en suelos y paredes. Pensados para el instalador profesional.',
    img: alikates,
    alt: 'Alikates KREOX para apretar kuñas de nivelación de baldosas',
    intro: 'Desarrollados para facilitar la instalación de baldosas cerámicas tanto en superficies horizontales como verticales.',
    body: 'Pensados para la comodidad del instalador profesional en proyectos de gran envergadura. Su función es aplicar la presión necesaria a las Kuñas para lograr una nivelación precisa y una superficie uniforme.',
    presentacion: ['Unidad'],
    steps: [
      { title: 'Ajuste del cursor', text: 'Con el tornillo de mariposa, desliza el cursor hasta la posición adecuada al grosor de la loseta y apriétalo firmemente.' },
      { title: 'Ajuste de presión', text: 'Gira el tornillo en sentido horario para aumentar la presión de empuje o antihorario para reducirla.' },
      { title: 'Ajuste correcto', text: 'Es el que permite el máximo empuje sobre la cuña sin romper la base o el clip de soporte.' },
    ],
  },
];

export const TILE_FAQ = [
  { q: '¿El Kalzo de KREOX funciona con kuñas de otras marcas?', a: 'Sí. Su altura y anchura están diseñadas para ser compatibles con todas las kuñas del mercado.' },
  { q: '¿Qué espesores de baldosa admite la Kuña Niveladora?', a: 'Losas de entre 3 y 15 mm sin necesidad de suplementos.' },
  { q: '¿Para qué sirve la Kuña Antimanchas?', a: 'Evita el marcado de las baldosas sin usar protectores. Su aleta impide que los alicates toquen la superficie y reparte la presión.' },
  { q: '¿Las Kuñas son reutilizables?', a: 'Sí. La Kuña es reutilizable y el sobrante del Kalzo separador es reciclable.' },
  { q: '¿De qué material están hechos?', a: 'KREOX fabrica en España con material reciclado.' },
];
