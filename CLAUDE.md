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

## Versión en inglés (/en/)
- **Inglés británico** (mercado del Reino Unido) con los términos del sector: "screed levellers", "liquid screed", "underfloor heating (UFH)", "insulation board", "datum height", "metal tripod", "levelling", "colour", "fibre", "metres". PIKO = "insulation screed leveller"; Nivelador Universal = "universal screed leveller". Los nombres "PIKO", "Nivelador Universal", Kalzo, Kuña y Alikates no se traducen.
- Rutas: /en/screed-levellers/ (piko, universal-screed-leveller, spare-parts, calculator, piko-vs-metal-tripod, underslab-polythene-sheet) y /en/tile-levelling-system/.
- El idioma sale de la URL (`/en/…`). Textos de interfaz compartidos: `src/i18n/ui.ts` (`useT(Astro.url)` devuelve `lang`, `t()` y las rutas `P`). Rutas ES↔EN: `src/i18n/routes.ts` (alimenta hreflang, selector de idioma y sitemap). Página nueva con versión inglesa = añadir su pareja ahí.
- Datos en inglés: `src/data/en/` (FAQ, azulejos) y `NAV_EN`; WhatsApp en inglés con `waTarifa(interes, 'en')` y `waInfo('en')`.
- Portada, contacto y FAQ son vistas compartidas (`src/views/`) con los textos de los dos idiomas; el resto de páginas inglesas están en `src/pages/en/`. Si cambia un texto o dato en español, actualizar también el inglés.
- Noticias en inglés: colección `news` (`src/content/news/`); su pareja española se declara en `NEWS_PAIRS` de `src/i18n/routes.ts`.

## Panel (/panel/) y Analytics
- El panel (PHP, `public/panel/`) guarda cambios en `main` y lanza el despliegue. Guía: `docs/panel.md`.
- `src/data/seo-overrides.json` lo escribe el panel: `{ "/ruta/": { "title", "description" } }`. Base.astro lo aplica; no cambiar su forma.
- Noticias creadas en el panel: imagen en `src/assets/img/noticias/`, mismo frontmatter. Las reglas de "Noticias" se validan también en el panel (`public/panel/_lib/noticias.php`); si cambian, actualizar ambos.
- La configuración del panel (usuarios, tokens) se escribe en el job de despliegue desde GitHub Secrets. Nunca en el repositorio ni en el artefacto.
- Google Analytics 4 solo se carga tras "Aceptar" en el banner (`Analytics.astro`); Aceptar y Rechazar con el mismo peso visual. Eventos: `click_whatsapp` (parámetro `producto`), `click_telefono`, `generate_lead`. Si se añade otra herramienta con cookies, actualizar las dos políticas de cookies.

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

## Contacto (WhatsApp)
- **No hay botones de tarifa** en la web (decisión del cliente). El contacto principal es WhatsApp con `waConsulta(interes, lang)` de `src/data/site.ts`: `interes` = piko | universal | recambios | nivelacion | azulejos | general, y el mensaje ya escrito cambia según el producto de la página.
- Barra fija del móvil: "WhatsApp" (principal) y "Llamar". En escritorio, botón flotante de WhatsApp; la cabecera no lleva botón.
- Bloque final de cada página: `CtaContacto` (WhatsApp + llamar) con el `interes` de la página.
- El formulario de /contacto/ es para consultas técnicas o por email.
