# Panel de kreox.es (`/panel/`)

Panel para gestionar la web sin tocar código: **SEO por página**, **noticias** (español e inglés) y **métricas** de Google (Search Console). La web no usa cookies, así que no lleva banner. Cada cambio se guarda en GitHub y la web se vuelve a publicar sola en 2-3 minutos.

- En pruebas: https://nuevo.kreox.es/panel/
- En producción: https://kreox.es/panel/

## Cómo funciona

1. El panel es PHP y vive en el hosting (`public/panel/`).
2. Al guardar, crea un commit en la rama `main` del repositorio con el cambio (`src/data/seo-overrides.json` o `src/content/noticias/*.md` + imagen en `src/assets/img/noticias/`).
3. Después lanza el workflow **Construir y publicar** hacia el mismo destino donde está el panel (pruebas o producción).
4. La configuración (usuarios, token, credenciales de Google) **no está en el repositorio**: el workflow la escribe en `/panel/_config.php` justo antes de subir por FTP, a partir de los secretos de GitHub. El servidor bloquea el acceso directo a todo lo que empieza por `_`.

## Configuración en GitHub (una sola vez)

Repositorio → **Settings → Secrets and variables → Actions**.

### Secretos (pestaña *Secrets*)

| Nombre | Qué poner |
|---|---|
| `PANEL_USERS` | Una línea por persona: `usuario:contraseña` (contraseña de 10 caracteres o más). Ej.: `juan:…` y en otra línea `natalia:…`. Se guardan cifradas en el servidor. |
| `PANEL_GITHUB_TOKEN` | Token *fine-grained* de GitHub: Settings de tu cuenta → Developer settings → Personal access tokens → Fine-grained → *Generate new token*. Repositorio: solo `ingravitto/kreox`. Permisos: **Contents: Read and write** y **Actions: Read and write**. Caducidad: 1 año (apúntate renovarlo). |
| `GOOGLE_SA_JSON` | (Métricas, opcional) Contenido completo del archivo JSON de la cuenta de servicio de Google. |

### Variables (pestaña *Variables*)

| Nombre | Ejemplo | Para qué |
|---|---|---|
| `GSC_SITE` | `sc-domain:kreox.es` | (Opcional) Propiedad de Search Console. Si no se pone, se usa `sc-domain:kreox.es`. |

Después de crearlos: **Actions → Construir y publicar → Run workflow → pruebas**.

## Search Console (métricas del panel)

1. **Search Console**: verifica la propiedad de dominio `kreox.es` (registro DNS TXT en el hosting) y envía el sitemap `https://kreox.es/sitemap.xml`.
2. **Cuenta de servicio** (para que el panel lea los datos):
   - Google Cloud Console → crea un proyecto "kreox-panel" y activa **Google Search Console API**.
   - IAM → Cuentas de servicio → Crear → sin roles → Claves → *Añadir clave* → JSON. Ese archivo va en el secreto `GOOGLE_SA_JSON`.
   - En Search Console → Configuración → Usuarios y permisos: añade el email de la cuenta de servicio con permiso **Restringido**.

La web no usa Google Analytics ni cookies: no hay banner de cookies.

## Seguridad

- Contraseñas cifradas con `password_hash`; 5 intentos fallidos bloquean 15 minutos.
- Protección CSRF en todos los formularios, sesión `HttpOnly` + `SameSite=Strict` + `Secure`, cabecera CSP estricta.
- `/panel/` no se indexa (robots.txt + `X-Robots-Tag`).
- El token de GitHub solo tiene acceso a este repositorio. Si se filtra, se revoca en GitHub y se crea otro.

## Pruebas en local

```bash
npm run build
KREOX_PANEL_CONFIG=/ruta/a/config-de-pruebas.php php -S 127.0.0.1:8099 -t dist
```

`config-de-pruebas.php` tiene la misma forma que la que genera `scripts/panel-config.php`. Con `'github' => ['branch' => 'una-rama-de-pruebas', 'dispatch' => false]` se prueba sin tocar `main` ni publicar.
