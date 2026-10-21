# Colombia Mods 3D

[English version](./README.en.md)

Sitio web oficial de **Colombia Mods 3D**, estudio colombiano de mods y modelos 3D para *American Truck Simulator*. Muestra el catálogo de mods (consumido en vivo desde una API), el launcher oficial y un formulario de contacto con backend propio.

> Es un proyecto real en producción: [colombiamods3d.com](https://colombiamods3d.com).

## Qué demuestra este proyecto

| Área | Qué hay |
| --- | --- |
| **Frontend** | React 19, React Router 7, Tailwind CSS 4 y Vite 8. Rutas con carga diferida y sin dependencias de UI externas. |
| **3D en el navegador** | three.js: camión animado en el hero y visor interactivo. El modelo se comprimió de 20,3 MB a 1,9 MB con un script reproducible (`scripts/optimize-glb.mjs`). |
| **Rendimiento** | CSS crítico en línea, three.js fuera del bundle inicial, imágenes responsive y `ResizeObserver` en lugar de lecturas de layout en bucles de animación. Detalle en [docs/PERFORMANCE.md](./docs/PERFORMANCE.md). |
| **SEO** | Un plugin de Vite pre-renderiza el `<head>` de cada ruta (título, descripción, canonical, Open Graph) y genera `sitemap.xml` y `robots.txt`. |
| **Accesibilidad** | Enlace «saltar al contenido», foco gestionado al cambiar de ruta, jerarquía de encabezados, `prefers-reduced-motion`. Lighthouse: 98. |
| **Seguridad** | CSP estricta sin `unsafe-inline` en scripts, Trusted Types, HSTS, COOP y el resto de cabeceras. Ver [docs/SECURITY.md](./docs/SECURITY.md). |
| **Backend** | API Node/Express para el formulario: validación, CORS por lista, límite de peticiones, correo HTML con SMTP y pruebas. |
| **Calidad** | ESLint, pruebas con el runner nativo de Node, CI en GitHub Actions y Dependabot. |
| **Agentes de IA** | `llms.txt` y manifiesto `/.well-known/ai-catalog.json` para que modelos y agentes entiendan el sitio. |

## Stack

React 19 · React Router 7 · Vite 8 · Tailwind CSS 4 · three.js · Node.js 22 · Express 5 · Nodemailer · GitHub Actions

## Inicio rápido

Requiere Node.js ≥ 20.19 (se recomienda el de `.nvmrc`).

```sh
npm install
cp .env.example .env     # ajusta las variables (ver «Configuración»)
npm run dev              # http://localhost:5173
```

Para probar el formulario de contacto también necesitas el backend: ver [backend/README.md](./backend/README.md).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` (HTML por ruta, sitemap y robots incluidos) |
| `npm run preview` | Sirve `dist/` en local |
| `npm run lint` | ESLint |
| `npm test` | Pruebas unitarias (`node --test`) |
| `npm run check` | Lint + pruebas + build, lo mismo que ejecuta el CI |
| `npm run optimize:model -- in.glb out.glb` | Comprime un modelo GLB para la web |

## Configuración

Variables del frontend (`.env`, públicas: **nunca pongas secretos**):

| Variable | Descripción |
| --- | --- |
| `VITE_SITE_URL` | Dominio público, sin barra final. Debe coincidir con `SITE_URL` del backend. |
| `VITE_BACKEND_URL` | URL pública de la API del catálogo, sin barra final. |
| `VITE_CONTACT_ENDPOINT` | URL de `POST /api/contact`. En local: `http://localhost:3001/api/contact`. |

Contenido editable sin tocar componentes: `src/config.js` (enlaces, redes, correos, capturas del launcher y datos legales) y `src/seo.js` (título y descripción de cada página). Las credenciales SMTP viven solo en `backend/.env`.

## Estructura

```
src/
  pages/              una pantalla por ruta (carga diferida salvo Inicio)
  components/
    layout/           Header, Footer, PageHero, ErrorBoundary
    ui/               botones, iconos, enlaces, Reveal, OnView, LauncherWindow
    catalog/          ModCard, ModDetail, ModImage, promociones y temporizadores
    scene3d/          HeroScene, HeroTruck y Model3D (three.js)
  context/            Catalog (carga única + modal de detalle) y Toast
  lib/                lógica pura: catálogo, formato, escenario SVG, utilidades three.js
  hooks/              useFlip (animación FLIP del catálogo)
  config.js · seo.js  contenido editable y metadatos por página
backend/              API de contacto (Express + Nodemailer) con sus pruebas
deploy/               ejemplo de nginx
docs/                 arquitectura, rendimiento, despliegue y seguridad
scripts/              herramientas de build de assets
public/               favicons, manifest, modelo GLB, llms.txt, .well-known, .htaccess
```

## Documentación

- [Arquitectura y decisiones de diseño](./docs/ARCHITECTURE.md)
- [Rendimiento: mediciones y optimizaciones](./docs/PERFORMANCE.md)
- [Despliegue (Apache, nginx y backend)](./docs/DEPLOYMENT.md)
- [Seguridad](./docs/SECURITY.md)
- [Historial de cambios](./CHANGELOG.md)

## Notas

- Las tipografías (Oswald, Rajdhani, Share Tech Mono) se sirven desde el propio sitio; no se cargan recursos de terceros.
- No hay cookies ni analítica. Si agregas alguna, actualiza la Política de privacidad (`src/pages/Legal.jsx`).
- Los enlaces antiguos con hash (`/#/catalogo`) redirigen a la URL limpia.

## Licencia

Copyright © 2026 Colombia Mods 3D. **Todos los derechos reservados.** El código se publica solo para consulta y evaluación; ver [LICENSE](./LICENSE).
