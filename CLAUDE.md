# kreox.es: instrucciones para Claude

Web estática de KREOX (marca de TALLERES LA PAZ, S.L.) construida con Astro 5. Se publica en un hosting cPanel/Apache por FTPS con GitHub Actions.

## Prioridad de negocio
La línea principal es **nivelación con mortero autonivelante**: PIKO (suelo radiante) y Nivelador Universal (recrecidos), más los recambios. La colocación de azulejos (Kalzo, Kuñas, Alikates) es secundaria. Todo cambio de contenido debe reforzar esta prioridad.

## Reglas de contenido
- **No inventar datos técnicos.** Los datos de producto están en `src/data/site.ts` (`PRODUCTOS`) y salen de la web original y de los planos del fabricante. Si falta un dato (rango de regulación, material, EAN, distribuidores…), se pregunta; no se rellena.
- Nombres de producto siempre iguales: "PIKO" y "Nivelador Universal" (nombre completo: "Nivelador Recrecido Universal"). Nunca "pico", "PiKo" ni "Pikos".
- Teléfonos, emails y dirección solo en `src/data/site.ts`.
- Las FAQ visibles y el schema FAQPage salen del mismo array (`src/data/faqs.ts` o el frontmatter `faq` de cada noticia).

## Noticias
Archivo Markdown nuevo en `src/content/noticias/<slug>.md` con este frontmatter: `title`, `seoTitle` (opcional, ≤65), `description` (≤170), `date`, `category` (nivelacion | azulejos | empresa | comunidad), `products`, `image`, `imageAlt`, `faq`. El primer párrafo debe responder directamente a la pregunta del título. Hay que enlazar al menos una ficha de producto.

## Comprobaciones antes de hacer commit
```
npm run build && npm run check
```
`check` falla si una página no tiene exactamente un H1, si falta la meta description o el canonical, si hay imágenes sin alt, JSON-LD inválido, enlaces internos rotos o páginas fuera del sitemap.

## Redirecciones
Las URLs de la web WordPress anterior se redirigen en `public/.htaccess`. Si cambia una URL, hay que añadir su 301 ahí.

## Accesibilidad y rendimiento (no romper)
- Objetivo: Lighthouse 100 en accesibilidad, buenas prácticas y SEO, y ≥ 95 en rendimiento (móvil). axe sin errores WCAG 2.2 AA.
- Texto arena sobre fondo claro: usar `var(--sand-strong)` (#7d6447). `var(--sand)` solo sobre fondo oscuro (`.section--dark`, `.on-dark`).
- Los vídeos y el `Marquee` se reproducen solos **sin botones de play/pausa visibles** (decisión del cliente). Para cumplir WCAG 2.2.2 se pausan tocándolos y llevan un botón de pausa que solo aparece con el foco del teclado (`.av-toggle`, `.mq-toggle`). Con `prefers-reduced-motion` no arrancan solos.
- Vídeos con sonido (reel, instalación): `data-inview` + botón "Activar sonido"; sin `controls`.
- El titular (H1) del hero no lleva animación de opacidad: es el elemento LCP.
- Vídeos: siempre con `AutoVideo` (preload none, póster diferido). No poner `poster` directo en vídeos fuera de la primera pantalla.
- Submenús: botón con `aria-expanded`; Escape cierra.

## Tarifa y contacto
- La tarifa (ahora **Tarifa 2027**) se pide **solo por WhatsApp**: usar `waTarifa(interes)` de `src/data/site.ts` en cualquier botón de tarifa. Nunca enlazar la tarifa al formulario.
- Barra fija del móvil: solo "WhatsApp" y "Nueva tarifa 2027" (las dos abren WhatsApp). En escritorio, botón flotante de WhatsApp.
- El formulario de /contacto/ es para otras consultas.
