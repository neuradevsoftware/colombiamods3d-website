# Seguridad

## Cabeceras HTTP

Se entregan desde `public/.htaccess` (Apache) o `deploy/nginx.conf` (nginx):

| Cabecera | Valor / propósito |
| --- | --- |
| `Content-Security-Policy` | Política activa (ver abajo) |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (refuerza `frame-ancestors 'none'`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | cámara, micrófono, geolocalización y pagos deshabilitados |

`includeSubDomains; preload` obliga a que **todos** los subdominios (incluido el del backend) respondan por HTTPS. Si no estás seguro, quita `preload` antes de enviar el dominio a la lista de precarga HSTS, porque es difícil de revertir.

## Content-Security-Policy

```
default-src 'self';
script-src 'self' 'wasm-unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://backendmods.colombiamods3d.com;
font-src 'self';
connect-src 'self' blob: https://backendmods.colombiamods3d.com;
worker-src 'self' blob:;
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
upgrade-insecure-requests;
require-trusted-types-for 'script'
```

- **Scripts:** solo del propio origen, sin `unsafe-inline` ni `unsafe-eval`. `wasm-unsafe-eval` es necesario para el decodificador meshopt (WebAssembly) del modelo 3D.
- **Estilos:** `unsafe-inline` se mantiene porque React escribe estilos en línea (`style={…}`) y el CSS crítico va en un `<style>`. No habilita ejecución de scripts.
- **Trusted Types:** `require-trusted-types-for 'script'` impide asignar cadenas a *sinks* como `innerHTML`. El código no los usa (los SVG se pintan como elementos React), de modo que cualquier inyección futura falla en vez de ejecutarse.
- **Dominios externos:** solo la API del catálogo, para imágenes y `fetch`.

> Esta política pasó de modo *Report-Only* a activa. Tras cada despliegue, navega el sitio con DevTools abierto y confirma que la consola no muestra violaciones.

## Formulario de contacto (backend)

- CORS por lista exacta de orígenes (`CORS_ORIGINS`); cualquier otro origen recibe 403.
- Cuerpo JSON limitado a 12 KB y validación de todos los campos.
- Límite de 5 envíos por IP cada 15 minutos (`express-rate-limit`), con `trust proxy` configurable.
- Las credenciales SMTP nunca llegan al navegador; el servicio no arranca si faltan variables.
- `x-powered-by` deshabilitado.

## Secretos

- Las variables `VITE_*` son públicas por diseño.
- `.env` y `backend/.env` están en `.gitignore`; el repositorio solo contiene los `.env.example`.
- Dependabot vigila las dependencias del sitio y del backend (`.github/dependabot.yml`).

## Reportar una vulnerabilidad

Escribe a `support@colombiamods3d.com` con el detalle y los pasos para reproducirla. Evita publicar el problema hasta que esté corregido.
