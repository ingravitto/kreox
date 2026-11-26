# kreox.es: instrucciones para Claude

Web estática de KREOX (marca de TALLERES LA PAZ, S.L.) construida con Astro 5. Se publica en un hosting cPanel/Apache por FTPS con GitHub Actions.

## Prioridad de negocio
La línea principal es **nivelación con mortero autonivelante**: PIKO (suelo radiante) y Nivelador Universal (recrecidos), más los recambios. La colocación de azulejos (Kalzo, Kuñas, Alikates) es secundaria. Todo cambio de contenido debe reforzar esta prioridad.

## Reglas de contenido
- **No inventar datos técnicos.** Los datos de producto están en `src/data/site.ts` (`PRODUCTOS`) y salen de la web original y de los planos del fabricante. Si falta un dato (rango de regulación, material, EAN, distribuidores…), se pregunta; no se rellena.
- Nombres de producto siempre iguales: "PIKO" y "Nivelador Universal" (nombre completo: "Nivelador Recrecido Universal"). Nunca "pico", "PiKo" ni "Pikos".
- **Densidad: 1 nivelador por m²** en cuadrícula de 1 m, igual que la calculadora oficial (calculadora.kreox.es), confirmado por el cliente. Constantes en `src/data/site.ts`: `M2_POR_NIVELADOR`, `SEPARACION_M` y `MORTERO_KG_M2_MM` (1,8 kg/m²·mm, orientativo). La calculadora completa es `CalculadoraObra.astro` (zonas, altura, producto, pedido por WhatsApp); la corta de las fichas, `Calculadora.astro`.
- PIKO y Nivelador Universal valen para autonivelante **de cemento y de anhidrita** (confirmado por el cliente; `morteros` en `PRODUCTOS`).
- Teléfonos, emails y dirección solo en `src/data/site.ts`.
- Las FAQ visibles y el schema FAQPage salen del mismo array (`src/data/faqs.ts` o el frontmatter `faq` de cada noticia).

## Tono y estilo (identidad KREOX)
- Fabricante familiar de Ibi que habla de obra: tú, frases concretas y vocabulario del oficio (cota, anilla, vertido, solera, forjado, recrecido, cejas, tirar el láser).
- Evitar copy genérico o "de IA": "solución innovadora", "eficiente/eficiencia", "perfecto", "descubre", "precisión y eficiencia" y titulares de dos frases cortas tipo eslogan ("X. Y.").
- No repetir el mismo argumento en una página ni en bloques seguidos: la comparativa completa con el trípode vive en /tripodes-de-nivelacion/ (página que ataca la búsqueda "trípodes de nivelación" / "arañas"); en la portada solo el peso (`WeightBars`); en las fichas, la tabla (`CompareTripode`). Las FAQ de azulejos se filtran por producto (`p` en `TILE_FAQ`).
- Cierre de cada página: `CtaContacto` con su `tema` (home, nivelacion, calculadora, tripode, lamina, empresa, azulejos, guia), no el mismo texto en todas.

## Noticias
Archivo Markdown nuevo en `src/content/noticias/<slug>.md` con este frontmatter: `title`, `seoTitle` (opcional, ≤65), `description` (≤170), `date`, `category` (nivelacion | azulejos | empresa | comunidad), `products`, `image`, `imageAlt`, `faq`. El primer párrafo debe responder directamente a la pregunta del título. Hay que enlazar al menos una ficha de producto.

## Versión en inglés (/en/)
- **Inglés británico** (mercado del Reino Unido) con los términos del sector: "screed levellers", "liquid screed", "underfloor heating (UFH)", "insulation board", "datum height", "metal tripod", "levelling", "colour", "fibre", "metres".
- **Nombres de producto en inglés:** el PIKO se llama **"Insulation Screed Leveller"** y el Nivelador Universal **"Universal Screed Leveller"** (en frases sucesivas: "the insulation leveller" / "the universal leveller"). "PIKO" y "Nivelador Universal" solo se usan en español y como `alternateName` del schema (y en el aviso legal, como marcas). Kalzo, Kuña y Alikates no se traducen. Textos compartidos: claves `prodPiko` / `prodUni` de `src/i18n/ui.ts`.
- Rutas: /en/screed-levellers/ (insulation-screed-leveller, universal-screed-leveller, spare-parts, calculator, screed-leveller-vs-metal-tripod, underslab-polythene-sheet) y /en/tile-levelling-system/.
- Al cambiar palabras en inglés, no tocar CSS, JS, identificadores ni nombres de archivo (p. ej. `color`, `center`, `piko-nuevo-color.jpg`).
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
- Al sustituir un vídeo o una imagen de `public/`, cambia el nombre del archivo (p. ej. `-v2`): el navegador los guarda 30 días y seguiría mostrando el antiguo.
- Vídeos: siempre con `AutoVideo` (preload none, póster diferido). No poner `poster` directo en vídeos fuera de la primera pantalla.
- Cabecera: píldora flotante fija (cristal oscuro, separada de los bordes; `--header-h` = margen + altura). Menú: `NAV` / `NAV_EN` en `src/data/site.ts`. Arriba solo "Productos" (panel por líneas + calculadora), Noticias, Empresa, Ayuda y Contacto. Un producto nuevo se añade a su grupo; las comparativas y guías no van en el menú. Panel: botón con `aria-expanded`; Escape cierra.

## Contacto (WhatsApp)
- **No hay botones de tarifa** en la web (decisión del cliente). El contacto principal es WhatsApp con `waConsulta(interes, lang)` de `src/data/site.ts`: `interes` = piko | universal | recambios | nivelacion | azulejos | general, y el mensaje ya escrito cambia según el producto de la página.
- Barra fija del móvil: "WhatsApp" (principal) y "Llamar". En escritorio, botón flotante de WhatsApp; la cabecera no lleva botón.
- Bloque final de cada página: `CtaContacto` (WhatsApp + llamar) con el `interes` de la página.
- El formulario de /contacto/ es para consultas técnicas o por email.
