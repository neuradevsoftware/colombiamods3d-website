# Despliegue

## Sitio (frontend)

1. `npm ci && npm run build`.
2. Sube **todo el contenido de `dist/`**, incluidas las carpetas de rutas, `.htaccess` y `.well-known/`.
3. Cada ruta tiene su propio `index.html`; las reglas del servidor permiten abrirla y recargarla directamente. Las rutas desconocidas caen en la app, que muestra la página 404.

| Hosting | Configuración |
| --- | --- |
| Apache / cPanel | `public/.htaccess` (requiere `mod_rewrite`; `mod_headers` y `mod_deflate` son opcionales pero recomendados) |
| nginx | `deploy/nginx.conf` (ejemplo; ajusta `server_name`, certificado y `root`) |

Ambas configuraciones incluyen caché largo e inmutable para `assets/` (nombres con hash), `no-cache` para HTML, manifest y JSON, compresión (incluido `model/gltf-binary`) y las cabeceras de seguridad descritas en [SECURITY.md](./SECURITY.md).

Tras desplegar:
- Envía `https://TU-DOMINIO/sitemap.xml` a Google Search Console.
- Comprueba la vista previa al compartir (Facebook Sharing Debugger / WhatsApp).
- Abre el sitio con DevTools y confirma que no hay violaciones de CSP en la consola.
- Verifica `https://TU-DOMINIO/llms.txt` y `https://TU-DOMINIO/.well-known/ai-catalog.json` (deben responder con el contenido, no con el `index.html`).

## API de contacto

El formulario necesita desplegar `backend/` en un servidor con Node ≥ 20.19, detrás de HTTPS y de un gestor de procesos (systemd o PM2). Variables, ejemplo de proxy y comprobaciones: [backend/README.md](../backend/README.md).

Puntos de coherencia entre los dos `.env`:

| Frontend (`.env`) | Backend (`backend/.env`) |
| --- | --- |
| `VITE_SITE_URL` | `SITE_URL` (deben ser idénticos) |
| `VITE_CONTACT_ENDPOINT` | `PORT` y el proxy deben enrutar `/api/contact` a ese puerto |
| — | `CORS_ORIGINS` debe listar exactamente los orígenes del sitio |

## Variables de entorno

Las variables `VITE_*` se incrustan en el JavaScript público al compilar: úsalas solo para URLs. Las credenciales SMTP van únicamente en `backend/.env` o como secretos del servidor. Ambos `.env` están en `.gitignore`; usa `.env.example` como plantilla.

## Cambio de dominio del backend

Si cambia el dominio de la API del catálogo, actualízalo en cuatro sitios: `VITE_BACKEND_URL`, `VITE_CONTACT_ENDPOINT`, y las directivas `img-src` y `connect-src` de la CSP en `public/.htaccess` y `deploy/nginx.conf`. También en `public/llms.txt` y `public/.well-known/*.json` si lo referencian.
