import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cada noticia es un archivo Markdown en src/content/noticias/.
// Al añadir uno, se generan solos: su página, el listado, el RSS, el sitemap, el schema y su línea en llms.txt.
const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticias' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string().max(65).optional(),
      description: z.string().max(170),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.enum(['nivelacion', 'azulejos', 'empresa', 'comunidad']),
      products: z.array(z.enum(['piko', 'universal', 'recambios', 'kalzo', 'kunas', 'alikates'])).default([]),
      image: image().optional(),
      imageAlt: z.string().optional(),
      author: z.string().default('Equipo KREOX'),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { noticias };
