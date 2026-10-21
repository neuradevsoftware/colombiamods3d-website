import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { DEFAULT_SITE_URL, PAGES } from './src/seo.js'

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/**
 * SEO en build:
 *  - sustituye __SITE_URL__ en index.html
 *  - genera dist/<ruta>/index.html con título, descripción, canonical y Open Graph propios de cada página
 *    (los rastreadores y las vistas previas al compartir leen el <head> sin ejecutar JS)
 *  - genera sitemap.xml y robots.txt
 */
function seo(siteUrl, backendUrl) {
  let outDir = 'dist'
  const setMeta = (html, attr, name, value) =>
    html.replace(new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`), `$1${esc(value)}$2`)

  return {
    name: 'cm3d-seo',
    configResolved(c) { outDir = c.build.outDir },
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl).replaceAll('__BACKEND_URL__', backendUrl),
    closeBundle() {
      const base = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const [path, p] of Object.entries(PAGES)) {
        const url = siteUrl + (path === '/' ? '/' : path)
        let html = base.replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`)
        for (const [attr, name, v] of [
          ['name', 'description', p.description], ['property', 'og:title', p.title], ['property', 'og:description', p.description],
          ['property', 'og:url', url], ['name', 'twitter:title', p.title], ['name', 'twitter:description', p.description],
        ]) html = setMeta(html, attr, name, v)
        html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
        if (path === '/') { writeFileSync(join(outDir, 'index.html'), html); continue }
        mkdirSync(join(outDir, path.slice(1)), { recursive: true })
        writeFileSync(join(outDir, path.slice(1), 'index.html'), html)
      }
      const day = new Date().toISOString().slice(0, 10)
      const urls = Object.keys(PAGES).map((p) => `  <url><loc>${siteUrl}${p === '/' ? '/' : p}</loc><lastmod>${day}</lastmod></url>`).join('\n')
      writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
    },
  }
}

/**
 * Inserta el CSS principal dentro del HTML: elimina la solicitud que bloquea el renderizado (Lighthouse: «Solicitudes que bloquean el renderizado»).
 * Las rutas pre-renderizadas heredan el <style> porque se generan a partir de dist/index.html.
 */
function inlineCss() {
  return {
    name: 'cm3d-inline-css',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html // dev server
        return html.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g, (tag, href) => {
          const key = Object.keys(ctx.bundle).find((k) => href.endsWith('/' + k) || href === k)
          const css = key && ctx.bundle[key]?.source
          if (!css) return tag
          delete ctx.bundle[key]
          return `<style>${String(css).replace(/<\/style/gi, '<\\/style')}</style>`
        })
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')
  const backendUrl = (env.VITE_BACKEND_URL || 'https://backendmods.colombiamods3d.com').replace(/\/+$/, '')
  return {
    plugins: [react(), tailwindcss(), seo(siteUrl, backendUrl), inlineCss()],
    build: {
      target: 'es2022',
      sourcemap: true, // mapas de origen públicos para depurar en producción (y auditoría de Lighthouse)
      chunkSizeWarningLimit: 900, // three.js (≈650 kB) se carga aparte y solo en Inicio
    },
  }
})
