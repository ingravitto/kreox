import { getCollection, type CollectionEntry } from 'astro:content';

export const CATEGORIAS = {
  nivelacion: 'Nivelación autonivelante',
  azulejos: 'Colocación de azulejos',
  empresa: 'Empresa',
  comunidad: 'Comunidad',
} as const;

export const CATEGORIES_EN = {
  nivelacion: 'Liquid screed',
  azulejos: 'Tile installation',
  empresa: 'Company',
  comunidad: 'Community',
} as const;

/** Una noticia en español (`noticias`) o en inglés (`news`): misma forma, distinta colección. */
export type Post = CollectionEntry<'noticias'> | CollectionEntry<'news'>;

export async function getNoticias() {
  const all = await getCollection('noticias', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getNews() {
  const all = await getCollection('news', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const fecha = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const dateEn = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const noticiaUrl = (n: CollectionEntry<'noticias'>) => `/noticias/${n.id}/`;
export const newsUrl = (n: CollectionEntry<'news'>) => `/en/news/${n.id}/`;

/** Utilidades que funcionan para las dos colecciones. */
export const postIsEn = (n: Post) => n.collection === 'news';
export const postUrl = (n: Post) => (n.collection === 'news' ? newsUrl(n) : noticiaUrl(n));
export const postDate = (n: Post) => (postIsEn(n) ? dateEn(n.data.date) : fecha(n.data.date));
export const postCategory = (n: Post) => (postIsEn(n) ? CATEGORIES_EN : CATEGORIAS)[n.data.category];
