import { getCollection, type CollectionEntry } from 'astro:content';

export const CATEGORIAS = {
  nivelacion: 'Nivelación autonivelante',
  azulejos: 'Colocación de azulejos',
  empresa: 'Empresa',
  comunidad: 'Comunidad',
} as const;

export async function getNoticias() {
  const all = await getCollection('noticias', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const fecha = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const noticiaUrl = (n: CollectionEntry<'noticias'>) => `/noticias/${n.id}/`;
