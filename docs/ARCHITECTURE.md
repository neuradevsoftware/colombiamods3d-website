# Arquitectura y decisiones de diseño

## Vista general

```
Navegador ──► Hosting estático (Apache / nginx)   dist/: HTML por ruta + JS/CSS con hash + modelo GLB
    │
    ├──► API del catálogo (backendmods…)           GET /api/catalog, /api/catalog/featured, /api/store/settings
    └──► API de contacto (backend/)                POST /api/contact  →  SMTP
```

El sitio es una SPA (React Router) servida como archivos estáticos. Los datos del catálogo vienen de una API externa propiedad del mismo estudio y se cargan una sola vez; la API de contacto de este repositorio solo envía correo.

## Decisiones

### Una SPA con HTML pre-renderizado por ruta
Los rastreadores y las vistas previas al compartir (WhatsApp, Facebook) leen el `<head>` sin ejecutar JavaScript. En vez de añadir un framework de SSR, `vite.config.js` incluye un plugin (`cm3d-seo`) que, tras el build, genera `dist/<ruta>/index.html` con título, descripción, canonical y Open Graph propios a partir de `src/seo.js`, además de `sitemap.xml` y `robots.txt`. Es la misma fuente de metadatos que usa la app al navegar (`RouteEffects` en `App.jsx`), así que no se desincronizan. Las reglas de `.htaccess` y nginx sirven cada carpeta sin redirecciones 301.

### CSS crítico en línea
El CSS de Tailwind (≈14 KB con gzip) bloqueaba el primer render. El plugin `cm3d-inline-css` lo inserta en un `<style>` del HTML y elimina el archivo del bundle. Como las páginas por ruta se generan a partir de `dist/index.html`, todas lo heredan.

### three.js fuera del camino crítico
three.js pesa ≈640 KB (160 KB con gzip), así que:
- `HeroTruck` y `Model3D` se cargan con `React.lazy`.
- `Model3D` está en la parte baja de Inicio y se monta con `OnView` solo al acercarse al viewport.
- Las páginas secundarias (`Catalog`, `Contact`, `Launcher`, `Legal`, `About`, `NotFound`) y `ModDetail` también se dividen en chunks.

### Pipeline del modelo 3D
El GLB original (20,3 MB, 1,6 M de vértices renderizados, sin texturas) se comprime con `scripts/optimize-glb.mjs`: soldadura de vértices, cuantización de atributos, eliminación de UV sin uso y compresión **meshopt** (`EXT_meshopt_compression`). Resultado: ≈1,9 MB, mismas dimensiones y las mismas 24 piezas de rueda que anima `HeroTruck`. Los cargadores ya incluyen `MeshoptDecoder`, que va dentro del bundle de three.js (no necesita archivos extra en el servidor).

### Animación sin reflows forzados
El parallax del hero corre en `requestAnimationFrame`. Para no leer geometría del DOM en cada frame, las medidas (`offsetHeight`, `getBoundingClientRect`) se cachean con un `ResizeObserver`, y los visores 3D usan el `contentRect` que entrega el observador en lugar de `clientWidth/clientHeight`. Las capas solo se mueven con `transform`.

### Sin `innerHTML`
Las montañas del hero son SVG generados proceduralmente (`lib/scenery.js`). Devuelven datos (`{d, fill, …}`) y React los pinta como `<path>`, de modo que no hay `dangerouslySetInnerHTML` y la CSP puede exigir Trusted Types. `ridge()` es determinista y periódica (el primer y el último punto tienen la misma altura) para que el bucle no tenga costura; ambas propiedades están cubiertas por pruebas.

### Imágenes
Las capturas locales se sirven en WebP con `srcset` (640/960/1280/1919 px), `width`/`height` y `loading="lazy"`. Las portadas de los mods llegan del backend del catálogo, por lo que su optimización (formato y tamaño) se hace allí, no en este repositorio.

### Llamada a la acción en móvil
El launcher solo existe para Windows, así que la barra fija inferior (visible solo por debajo de 760 px) usa `DiscordButton`, que lleva al servidor de la comunidad, donde también se compran los mods. `LauncherButton` y `DiscordButton` viven juntos en `components/ui/Links.jsx` y comparten el mismo patrón: enlace si la URL está configurada en `config.js` y aviso si no.

### Estado y datos
`context/Catalog.jsx` carga el catálogo una vez (`fetchCatalog` ejecuta las tres peticiones en paralelo) y comparte `mods`, `featured` y `settings` entre Inicio y Catálogo. Las reglas de negocio (ofertas vigentes, lanzamientos futuros, formato de precio, desfase de reloj con el servidor) están en `lib/catalog.js` como funciones puras, separadas de los componentes.

## Estructura de `src/`

| Carpeta | Responsabilidad |
| --- | --- |
| `pages/` | Una pantalla por ruta |
| `components/layout/` | Estructura global: Header, Footer, PageHero, ErrorBoundary |
| `components/ui/` | Piezas reutilizables sin lógica de negocio |
| `components/catalog/` | Tarjetas, detalle de mod, promociones y cuentas regresivas |
| `components/scene3d/` | Todo lo que usa three.js |
| `context/` | Estado compartido (catálogo y notificaciones) |
| `lib/` | Lógica pura y testeable (sin React) |
| `hooks/` | Hooks reutilizables |

## Pruebas

`npm test` ejecuta con el runner nativo de Node las pruebas de las funciones puras (`lib/format`, `lib/scenery`, `seo`) y las del backend. Se mantuvo la lógica testeable fuera de React a propósito para no depender de un entorno de DOM.
