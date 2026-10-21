import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONFIG } from '../../config'
import { clamp, prefersReducedMotion } from '../../lib/format'
import { ridge } from '../../lib/scenery'
import { HeroButton } from '../ui/Buttons'
import { LauncherButton } from '../ui/Links'

// three.js se carga aparte para no pesar en la primera pantalla
const HeroTruck = lazy(() => import('./HeroTruck'))

// Tile de montañas repetido 3 veces; la animación lo desplaza un tile en bucle (sin costura)
const Hills = ({ paths, anim }) => (
  <div className={`absolute -top-[4%] -left-[4%] flex h-[108%] w-max ${anim}`}>
    {[0, 1, 2].map((i) => (
      <svg key={i} className="h-full w-auto min-w-[100vw] flex-none" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        {paths.map((a, k) => <path key={k} {...a} />)}
      </svg>
    ))}
  </div>
)
const layer = 'pointer-events-none absolute inset-0 will-change-transform'

export default function HeroScene({ onModelReady }) {
  const [ready, setReady] = useState(false)
  const heroRef = useRef(null), copyRef = useRef(null)

  const far = useMemo(() => [...ridge(31, 470, 150, '#2a3945', 1600, 900, 0.9, 'rgba(255,176,100,.22)'), ...ridge(34, 540, 110, '#1f2c37', 1600, 900, 1, 'rgba(255,176,100,.12)')], [])
  const mid = useMemo(() => ridge(41, 640, 100, '#15212a', 1600, 900), [])
  const near = useMemo(() => ridge(52, 760, 60, '#0c141a', 1600, 900), [])

  useEffect(() => { const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true))); return () => cancelAnimationFrame(id) }, [])

  // Parallax por scroll + puntero (port directo del tick() original)
  useEffect(() => {
    const hero = heroRef.current, copy = copyRef.current
    const layers = [...hero.querySelectorAll('[data-speed]')]
    const RM = prefersReducedMotion(), FINE = matchMedia('(pointer: fine)').matches
    let sy = scrollY, mx = 0, my = 0, cx = 0, cy = 0, on = true, raf = 0
    let hh = 1, hl = 0, ht = 0, hw = 1 // medidas del hero, actualizadas por ResizeObserver (evita reflows forzados)
    const ro = new ResizeObserver(([e]) => { const b = e.target.getBoundingClientRect(); hh = e.contentRect.height || 1; hw = e.contentRect.width || 1; hl = b.left; ht = b.top + scrollY })
    ro.observe(hero)
    const tick = () => {
      cx += (mx - cx) * 0.07; cy += (my - cy) * 0.07
      const p = clamp(sy / hh, 0, 1)
      layers.forEach((l) => {
        const sp = +l.dataset.speed, d = +l.dataset.depth || 0
        l.style.transform = l.dataset.truck
          ? `translate3d(0,${sy * sp}px,0) scale(${1 - p * 0.07})`
          : `translate3d(${cx * d}px,${sy * sp + cy * d * 0.5}px,0)`
      })
      copy.style.transform = `translate3d(${-cx * 6}px,${-sy * 0.1}px,0)`
      copy.style.opacity = clamp(1 - p * 1.25, 0, 1)
      raf = on && !RM ? requestAnimationFrame(tick) : 0
    }
    const start = () => { if (!raf && !RM) raf = requestAnimationFrame(tick) }
    const onScroll = () => { sy = scrollY; if (on) start() }
    const move = (e) => { mx = ((e.clientX - hl) / hw - 0.5) * 2; my = ((e.clientY + scrollY - ht) / hh - 0.5) * 2 }
    const leave = () => { mx = 0; my = 0 }
    const io = new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) start() })
    io.observe(hero)
    addEventListener('scroll', onScroll, { passive: true })
    if (!RM) {
      if (FINE && innerWidth > 900) hero.addEventListener('pointermove', move)
      hero.addEventListener('pointerleave', leave)
      start()
    }
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); removeEventListener('scroll', onScroll); hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave) }
  }, [])

  const hin = (delay = 0) => ({
    className: `[transform:translateY(16px)] opacity-0 motion-reduce:!opacity-100 motion-reduce:![transform:none] ${ready ? 'animate-fadeup' : ''}`,
    style: { animationDelay: `${delay}s` },
  })
  const line = (delay) => ({
    className: `block [transform:translateY(110%)] motion-reduce:![transform:none] ${ready ? 'animate-rise' : ''}`,
    style: { animationDelay: `${delay}s` },
  })

  return (
    <div ref={heroRef} className="relative isolate h-[clamp(620px,100svh,900px)] overflow-hidden bg-deep [perspective:1400px] max-[760px]:h-auto max-[760px]:min-h-[770px]">
      <div className={`${layer} bg-[linear-gradient(#070a0d_0%,#101820_42%,#2a2a2e_68%,#8a4f22_100%)]`} data-speed="0" />
      <div className={layer} data-speed=".06" data-depth="4">
        <div className="absolute top-[52%] left-[66%] size-[70vmax] -translate-1/2 bg-[radial-gradient(closest-side,rgba(255,190,110,.30),rgba(255,190,110,.08)_55%,transparent)]" />
      </div>
      <div className={`${layer} opacity-80 mix-blend-screen bg-[conic-gradient(from_200deg_at_66%_55%,transparent_0_8deg,rgba(255,190,110,.05)_10deg_14deg,transparent_18deg_30deg,rgba(255,190,110,.04)_32deg_36deg,transparent_40deg)]`} data-speed=".08" data-depth="6" />
      <div className={layer} data-speed=".12" data-depth="8"><Hills paths={far} anim="animate-drift-far" /></div>
      <div className={layer} data-speed=".22" data-depth="16"><Hills paths={mid} anim="animate-drift-mid" /></div>
      <div className={layer} data-speed=".3" data-depth="24"><Hills paths={near} anim="animate-drift-near" /></div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[16%] border-t border-[#2c322f] bg-linear-to-b from-[#1b1e1d] to-[#0d0f0e] before:absolute before:inset-x-0 before:top-[48%] before:h-1 before:animate-lane before:bg-[repeating-linear-gradient(90deg,rgba(238,241,243,.5)_0_70px,transparent_70px_150px)] before:content-['']" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-[11%] bg-linear-to-b from-transparent to-deep" />
      <div role="img" aria-label="Camión 3D circulando por una carretera de montaña" data-speed=".16" data-depth="36" data-truck="1"
        className="pointer-events-none absolute inset-0 z-3 will-change-transform">
        <Suspense fallback={null}><HeroTruck src={CONFIG.modelUrl} onReady={onModelReady} /></Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 z-4 bg-[radial-gradient(120%_90%_at_60%_60%,transparent_55%,rgba(4,6,8,.65)),linear-gradient(90deg,rgba(6,8,10,.75),transparent_55%)]" />

      <div ref={copyRef} className="pad relative z-6 will-change-[transform,opacity] pt-[calc(var(--hh)+clamp(28px,7vh,72px))]">
        <div {...hin()}>
          <span className="mb-3.5 inline-flex items-center gap-1.5 rounded-[3px] border border-amber/50 bg-amber/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[1.5px] text-amber before:size-1.5 before:rounded-full before:bg-amber before:shadow-[0_0_8px_var(--color-amber)] before:content-['']">American Truck Simulator</span>
        </div>
        <h1 id="h1" className="font-display text-[clamp(2.2rem,4.9vw,4.9rem)] font-bold uppercase leading-none tracking-[1px] [text-shadow:0_4px_20px_rgba(0,0,0,.6)] max-[760px]:text-[clamp(2.1rem,10vw,3.4rem)]">
          <span className="block overflow-hidden pb-[.05em]"><span {...line(0.15)}>Mods para simuladores,</span></span>
          <span className="block overflow-hidden pb-[.05em]"><span {...line(0.3)}>a otro nivel.</span></span>
        </h1>
        <p {...hin(0.6)} className={`mt-3.5 max-w-[48ch] text-[clamp(1.1rem,1.4vw,1.3rem)] leading-[1.4] text-steel-light ${hin().className}`}>Mods personalizados de alta calidad para American Truck Simulator. Camiones, trailers y accesorios con cada detalle cuidado.</p>
        <div {...hin(0.75)} className={`mt-[22px] flex flex-wrap gap-2.5 ${hin().className}`}>
          <LauncherButton />
          <HeroButton as={Link} to="/catalogo" variant="ghost">Explorar catálogo</HeroButton>
        </div>
      </div>
      <a href="/" {...hin(1.1)} onClick={(e) => { e.preventDefault(); document.getElementById('home-launcher')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }) }}
        className={`absolute bottom-[22px] left-(--side) z-7 flex items-center gap-3 font-mono text-[11px] tracking-[.05em] text-steel-light max-[760px]:hidden ${hin().className}`}>
        <i className="relative block h-10 w-0.5 overflow-hidden bg-white/[.18] after:absolute after:left-0 after:-top-1/2 after:h-1/2 after:w-full after:animate-cue after:bg-amber after:content-['']" />
        <span>Desliza para explorar</span>
      </a>
    </div>
  )
}
