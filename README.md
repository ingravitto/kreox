# kreox.es

Nueva web de **KREOX**, centrada en los sistemas de nivelación para mortero autonivelante (PIKO y Nivelador Universal). Sustituye al WordPress actual.

- **Tecnología:** Astro 5, web 100 % estática: rápida, sin plugins y sin base de datos.
- **SEO/GEO:** un H1 por página, schema (Organization, Product, FAQPage, NewsArticle, BreadcrumbList), sitemap, RSS, `llms.txt` para asistentes de IA y redirecciones 301 desde todas las URLs antiguas.
- **Publicación:** GitHub Actions → FTPS al hosting cPanel.

## Estructura

| Ruta | Contenido |
|---|---|
| `src/data/site.ts` | Datos de empresa, menú y datos técnicos de producto (fuente única) |
| `src/data/faqs.ts`, `src/data/azulejos.ts` | Preguntas frecuentes y productos de azulejos |
| `src/content/noticias/*.md` | Noticias (un archivo Markdown por noticia) |
| `src/pages/` | Páginas: cada archivo es una URL |
| `src/assets/img/` | Imágenes (se convierten solas a WebP en varios tamaños) |
| `public/.htaccess` | Redirecciones 301, HTTPS, caché y seguridad |
| `public/contacto.php` | Envío del formulario de contacto a comercial@kreox.es |
| `scripts/check-build.mjs` | Control de calidad SEO automático |

## Trabajar en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run check    # control de calidad SEO sobre dist/
```

## Publicar

1. Configura en GitHub, en *Settings → Secrets and variables → Actions*, estos secretos:
   - `FTP_SERVER` = `ftp.kreox.es`
   - `FTP_USERNAME` = usuario FTP de publicación
   - `FTP_PASSWORD` = su contraseña
   - `FTP_DIR_PRUEBAS` = carpeta del subdominio de pruebas, p. ej. `/nuevo.kreox.es/`
   - `FTP_DIR_PRODUCCION` = carpeta de kreox.es, p. ej. `/public_html/`
2. Ve a **Actions → Construir y publicar → Run workflow** y elige `pruebas` o `produccion`.

La versión de pruebas se publica con `noindex` para que Google no la indexe.

## Antes de pasar a producción

- [ ] Revisar la web en el subdominio de pruebas.
- [ ] Copia de seguridad completa del WordPress actual (cPanel → Copias de seguridad).
- [ ] Crear la cuenta o alias `web@kreox.es`, remitente del formulario, y hacer un envío de prueba.
- [ ] Versión en inglés: de momento `/en/` redirige temporalmente (302) a la versión en español.
- [ ] Revisión de los textos legales por vuestro asesor (falta el dato de inscripción en el Registro Mercantil).
- [ ] Después del lanzamiento: enviar el sitemap en Google Search Console y vigilar los errores 404 durante 4 semanas.

## Datos pendientes de confirmar por KREOX

Rango de regulación en mm de PIKO y Universal, material de fabricación, referencias/EAN, tipos de placa de aislamiento compatibles, si la anilla con fibra se vende como recambio, y la red de distribuidores.
