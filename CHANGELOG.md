# Historial de cambios

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.1.0] — 2026-10-21

### Rendimiento
- Modelo GLB comprimido de 20,3 MB a 1,9 MB (meshopt, cuantización, sin UV sin uso) con un script reproducible.
- CSS crítico en línea: se elimina la solicitud que bloqueaba el renderizado.
- Páginas secundarias, `ModDetail` y el visor 3D inferior se cargan bajo demanda; el bundle inicial baja de 362 KB a 299 KB.
- Imágenes del launcher con `srcset`, dimensiones explícitas y logos recomprimidos.
- `preconnect` hacia la API del catálogo.
- El parallax del hero y los visores 3D dejan de leer geometría del DOM en cada frame (`ResizeObserver`).

### Seguridad
- La CSP pasa de *Report-Only* a activa y exige Trusted Types; HSTS con `includeSubDomains; preload`; COOP `same-origin`.
- Las montañas del hero se renderizan como elementos React en lugar de `dangerouslySetInnerHTML`.

### Accesibilidad y SEO
- Jerarquía de encabezados corregida (sin saltos de nivel).
- `llms.txt` y manifiesto `/.well-known/ai-catalog.json` (también como `ard.json`).
- Mapas de origen generados en el build.

### Interfaz móvil
- La barra fija inferior ofrece «Unirme al Discord» en lugar de «Descargar launcher»: el launcher es solo para Windows y no se puede instalar en móvil.
- El camión del hero queda más abajo en pantallas pequeñas y ya no tapa los botones.

### Mantenimiento
- Código muerto eliminado: `RichText`, `priceText`, `mapAnnouncement`, `SITE_NAME`, la configuración `announcements` (el sitio ya no la usaba) y exports sin consumidores.
- `components/` reorganizado por dominio (`layout`, `ui`, `catalog`, `scene3d`).
- Pruebas unitarias para `format`, `scenery` y `seo`; el CI ejecuta lint, pruebas y build del sitio, y las comprobaciones del backend.
- Dependabot, `.nvmrc`, `.gitattributes` (LF) y `package-lock.json`.
- Licencia «todos los derechos reservados» (`LICENSE`, `license: UNLICENSED`).
- Documentación reorganizada en `README.md`, `README.en.md` y `docs/`.

## [1.0.0] — 2026-10-17

- Primera versión pública: catálogo conectado a la API, launcher, contacto con backend SMTP, SEO por ruta y modelo 3D.
