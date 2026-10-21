import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { NOT_FOUND, PAGES } from './seo'
import { CatalogProvider } from './context/Catalog'
import { ToastProvider } from './context/Toast'
import ErrorBoundary from './components/layout/ErrorBoundary'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { ArrowUpIcon } from './components/ui/Icons'
import { DiscordButton } from './components/ui/Links'
import Home from './pages/Home'

// Páginas secundarias: se descargan solo al visitarlas
const About = lazy(() => import('./pages/About'))
const Catalog = lazy(() => import('./pages/Catalog'))
const Contact = lazy(() => import('./pages/Contact'))
const Launcher = lazy(() => import('./pages/Launcher'))
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('./pages/NotFound'))

const setAttr = (sel, attr, value) => document.querySelector(sel)?.setAttribute(attr, value)

/** Título y etiquetas SEO, scroll arriba y foco en el h1 al cambiar de pantalla. */
function RouteEffects() {
  const { pathname: raw } = useLocation()
  const pathname = raw.length > 1 ? raw.replace(/\/+$/, '') : raw // /catalogo/ == /catalogo
  const first = useRef(true)
  useEffect(() => {
    const page = PAGES[pathname] ?? NOT_FOUND
    document.title = page.title
    setAttr('meta[name="description"]', 'content', page.description)
    for (const [sel, v] of [['meta[property="og:title"]', page.title], ['meta[property="og:description"]', page.description], ['meta[name="twitter:title"]', page.title], ['meta[name="twitter:description"]', page.description]]) setAttr(sel, 'content', v)
    const url = location.origin + pathname
    setAttr('link[rel="canonical"]', 'href', url)
    setAttr('meta[property="og:url"]', 'content', url)
    // La página 404 no debe indexarse
    let robots = document.querySelector('meta[name="robots"]')
    if (!PAGES[pathname]) {
      if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
      robots.content = 'noindex'
    } else robots?.remove()

    scrollTo({ top: 0, behavior: 'instant' })
    if (!first.current) { const h = document.querySelector('main h1'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }) } }
    first.current = false
  }, [pathname])
  return null
}

/** Enlaces antiguos con hash (/#/catalogo) -> URL limpia (/catalogo). */
function LegacyHashRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    const h = location.hash
    if (h.startsWith('#/')) navigate(h.slice(1) === '/inicio' ? '/' : h.slice(1), { replace: true })
  }, [navigate])
  return null
}

function Shell() {
  const { pathname } = useLocation()
  const [showScrollTop, setShowScrollTop] = useState(false)
  useEffect(() => {
    const update = () => setShowScrollTop(scrollY > 400)
    update()
    addEventListener('scroll', update, { passive: true })
    return () => removeEventListener('scroll', update)
  }, [])
  const skip = (e) => { e.preventDefault(); const m = document.getElementById('contenido'); m?.focus({ preventScroll: true }); m?.scrollIntoView() }
  return (
    <>
      <a href="#contenido" onClick={skip}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-400 focus:rounded-md focus:bg-amber focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:uppercase focus:text-[#1a1206]">
        Saltar al contenido
      </a>
      <LegacyHashRedirect />
      <RouteEffects />
      <Header />
      <main id="contenido" tabIndex={-1} className="flex flex-1 flex-col outline-none max-[760px]:pb-[76px]">
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inicio" element={<Navigate to="/" replace />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/launcher" element={<Launcher />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/privacidad" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <div className="fixed inset-x-0 bottom-0 z-90 hidden border-t border-line bg-panel/95 px-3.5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] backdrop-blur-[10px] max-[760px]:flex">
        <DiscordButton className="h-[52px] flex-1" />
      </div>
      <button type="button" aria-label="Volver al inicio" title="Volver al inicio" disabled={!showScrollTop}
        onClick={() => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
        className={`group fixed right-5 bottom-5 z-95 grid size-12 place-items-center rounded-full border border-amber/60 bg-panel/95 text-amber shadow-[0_8px_28px_rgba(0,0,0,.45)] backdrop-blur transition-[opacity,transform,background,color] duration-300 ease-soft hover:bg-amber hover:text-[#1a1206] max-[760px]:right-4 max-[760px]:bottom-[calc(92px+env(safe-area-inset-bottom,0px))] ${showScrollTop ? 'visible opacity-100 [transform:none]' : 'invisible pointer-events-none opacity-0 [transform:translateY(12px)]'}`}>
        <ArrowUpIcon className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CatalogProvider>
          <Shell />
        </CatalogProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
