# Rendimiento

## Línea base

Lighthouse 13.5, escritorio emulado, carga inicial, 20-oct-2026, antes de las optimizaciones:

| Categoría | Puntaje | | Métrica | Valor |
| --- | --- | --- | --- | --- |
| Rendimiento | 78 | | First Contentful Paint | 0,5 s |
| Accesibilidad | 98 | | Largest Contentful Paint | 1,0 s |
| Prácticas recomendadas | 96 | | Total Blocking Time | 320 ms |
| SEO | 100 | | Cumulative Layout Shift | 0,008 |
| Navegación agéntica | 2/4 | | Speed Index | 2,9 s |

Hallazgos principales: modelo GLB de 20,3 MB que fallaba con `ERR_CONNECTION_FAILED` (ruta crítica de 3175 ms), CSS que bloqueaba el render (≈280 ms), reflow forzado de 40 ms, 110 KiB de JavaScript sin usar, ≈2,3 MiB de imágenes de portada sobredimensionadas y varias auditorías de seguridad y de agentes sin cumplir.

## Qué se cambió y cuánto pesa ahora

Valores medidos sobre los archivos de `dist/`:

| Cambio | Antes | Después |
| --- | --- | --- |
| `columbia.glb` (meshopt + cuantización, sin UV) | 20,3 MB | 1,9 MB |
| JavaScript del bundle inicial (`index-*.js`) | 362 KB | 299 KB (94 KB con gzip) |
| Páginas secundarias, `ModDetail` y `Model3D` | en el bundle inicial | chunks que se cargan al usarlos |
| CSS | archivo externo que bloquea el render | en línea en el HTML (≈16 KB de HTML con gzip por ruta) |
| Captura del launcher (`launcher.webp`) | 163 KB únicos | 97 KB + variantes de 16, 30 y 45 KB con `srcset` |
| Logo | 45 KB para todos los usos | 33 KB (hero/carga) y 20 KB (cabecera y pie) |
| Reflow forzado en el parallax del hero | `offsetHeight` por frame | medidas cacheadas con `ResizeObserver` |
| Origen del backend | conexión tardía | `<link rel="preconnect">` |

## Cómo volver a medir

```sh
npm run build && npm run preview
```

Abre la URL de preview en Chrome, DevTools → Lighthouse → escritorio. Para comparar con producción, ejecuta el mismo informe tras desplegar `dist/`. No se publican aquí puntajes «después» porque dependen del hosting; el cuadro anterior solo recoge lo que se midió en los archivos.

## Pendiente fuera de este repositorio

Las portadas de los mods las sirve el backend del catálogo (`/files/covers/…`). Una está en PNG de 1,6 MB y varias miden 1364–1600 px de ancho para mostrarse a 296 px. Convertirlas a WebP/AVIF y generar miniaturas de ≈600 px al subirlas ahorraría unos 2,3 MB por carga de Inicio.
