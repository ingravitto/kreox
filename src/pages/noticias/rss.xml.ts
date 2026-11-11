import type { APIRoute } from 'astro';
import { getNoticias, noticiaUrl } from '../../data/noticias';
import { SITE } from '../../data/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const items = (await getNoticias())
    .map((n) => `<item><title>${esc(n.data.title)}</title><link>${SITE.url}${noticiaUrl(n)}</link><guid>${SITE.url}${noticiaUrl(n)}</guid><pubDate>${n.data.date.toUTCString()}</pubDate><description>${esc(n.data.description)}</description></item>`)
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Noticias KREOX</title><link>${SITE.url}/noticias/</link><description>Novedades de KREOX sobre sistemas de nivelación</description><language>es</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
