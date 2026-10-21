import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { CONFIG } from '../config'
import logo from '../assets/logo.webp'
import { ArrowRightIcon } from '../components/ui/Icons'
import { HeroButton } from '../components/ui/Buttons'
import HeroScene from '../components/scene3d/HeroScene'
import LauncherWindow, { ShotPlaceholder } from '../components/ui/LauncherWindow'
import { LauncherButton } from '../components/ui/Links'
import ModCard from '../components/catalog/ModCard'
import NewsOffers from '../components/catalog/NewsOffers'
import OnView from '../components/ui/OnView'
import Reveal from '../components/ui/Reveal'
import { useCatalog } from '../context/Catalog'
import { dealMods, isSoon } from '../lib/catalog'
import Screen from './Screen'

// three.js se carga aparte para no pesar en la primera pantalla
const Model3D = lazy(() => import('../components/scene3d/Model3D'))
let hasShownHomeLoader = false

export default function Home() {
  const [showLoader, setShowLoader] = useState(() => !hasShownHomeLoader)
  const [loadingModel, setLoadingModel] = useState(showLoader)
  const onModelReady = useCallback(() => setLoadingModel(false), [])
  const { mods, featured, openMod } = useCatalog()
  useEffect(() => { hasShownHomeLoader = true }, [])
  useEffect(() => {
    if (!showLoader || loadingModel) return
    const timeout = setTimeout(() => setShowLoader(false), 650)
    return () => clearTimeout(timeout)
  }, [showLoader, loadingModel])
  const shot = CONFIG.launcher.screenshots[0]
  const inDeals = new Set(dealMods(mods).map((m) => m.id)) // ya salen en Descuentos: no se repiten aquí
  const avail = (l) => l.filter((m) => !isSoon(m) && !inDeals.has(m.id))
  const feat = avail(featured), seen = new Set(feat.map((m) => m.id))
  const list = [...feat, ...avail(mods).filter((m) => !seen.has(m.id))].slice(0, 4)

  return (
    <Screen label="Inicio">
      <HeroScene onModelReady={onModelReady} />
      {showLoader && (
        createPortal(
          <div role="status" aria-label="Cargando el modelo 3D" aria-hidden={!loadingModel} className={`fixed inset-0 z-[200] grid place-items-center bg-black transition-opacity duration-[650ms] ease-soft motion-reduce:duration-0 ${loadingModel ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
            <div className={`flex flex-col items-center gap-6 transition-transform duration-[650ms] ease-soft motion-reduce:duration-0 ${loadingModel ? 'scale-100' : 'scale-[.96]'}`}>
              <img src={logo} alt="Colombia Mods 3D" className="w-[min(72vw,320px)]" />
              <span aria-hidden="true" className="size-6 animate-spin rounded-full border-2 border-white/25 border-t-amber" />
              <span className="sr-only">Cargando el modelo 3D…</span>
            </div>
          </div>,
          document.body,
        )
      )}

      <div id="home-launcher" className="border-y border-line bg-panel py-[clamp(48px,7vw,92px)]">
        <div className="pad">
          <Reveal className="grid grid-cols-[1.1fr_1fr] items-start gap-x-12 gap-y-7 rounded-[10px] border border-line bg-panel-2 bg-[linear-gradient(135deg,rgba(255,176,32,.07),transparent_55%)] p-[clamp(22px,3vw,40px)] max-[1100px]:grid-cols-1">
            <div>
              <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold uppercase leading-[1.1] tracking-[.4px]">Todo tu contenido, desde un solo lugar.</h2>
              <p className="mt-2.5 mb-[22px] max-w-[44ch] text-steel-light">Descarga el launcher oficial de Colombia Mods 3D y accede a nuestro contenido para simuladores.</p>
              <LauncherButton size="xl" />
            </div>
            <figure className="w-full min-w-0" aria-label="Vista previa del launcher">
              <LauncherWindow>
                {shot
                  ? <img src={shot.src} srcSet={shot.srcSet} sizes="(max-width:1100px) 92vw, 560px" width={shot.width} height={shot.height} alt={shot.alt || 'Captura del launcher'} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                  : <ShotPlaceholder title="Captura del launcher" text="Espacio reservado para mostrar la imagen del launcher." />}
              </LauncherWindow>
            </figure>
          </Reveal>
        </div>
      </div>

      {list.length > 0 && (
        <div className="py-[clamp(48px,7vw,92px)]">
          <div className="pad mb-[26px] flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div>
              <h2 className="max-w-[24ch] font-display text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold uppercase leading-[1.05] tracking-[.4px]">Del catálogo</h2>
              <p className="mt-2 font-mono text-[11.5px] text-steel">Los mismos mods que ves en el launcher.</p>
            </div>
            <Link to="/catalogo" className="group inline-flex min-h-11 items-center gap-2 font-display text-[13px] uppercase leading-none tracking-[1px] text-amber transition-[gap,color] duration-200 ease-soft hover:gap-[13px] hover:text-[#ffc247]">
              <span className="block pt-px">Ver catálogo</span><ArrowRightIcon className="size-[15px]" />
            </Link>
          </div>
          <div className="pad"><div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">{list.map((m) => <ModCard key={m.id} mod={m} onOpen={openMod} />)}</div></div>
        </div>
      )}

      <NewsOffers />

      <div className="py-[clamp(48px,7vw,92px)]">
        <div className="pad">
          <div className="grid grid-cols-[1.1fr_1fr] items-center gap-x-[clamp(28px,5vw,64px)] gap-y-8 max-[1100px]:grid-cols-1">
            <Reveal>
              <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold uppercase leading-[1.05] tracking-[.4px]">Pasión por el detalle. Creaciones para simuladores.</h2>
              <p className="mt-3 mb-[22px] max-w-[50ch] text-steel-light">En Colombia Mods 3D creamos mods y modelos 3D para simuladores de conducción, combinando creatividad y atención al detalle para ofrecer nuevas experiencias de juego.</p>
              <HeroButton as={Link} to="/nosotros">Quiénes somos</HeroButton>
            </Reveal>
            <div className="min-w-0 rounded-[10px] border border-line bg-card bg-[linear-gradient(rgba(255,176,32,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,176,32,.045)_1px,transparent_1px)] bg-[length:40px_40px,40px_40px] p-[clamp(12px,2vw,24px)]">
              <OnView className="mx-auto h-[clamp(280px,32vw,400px)] w-full max-w-[600px]"><Suspense fallback={null}><Model3D wireframe src={CONFIG.modelUrl} label="Modelo 3D del camión Columbia" className="size-full" /></Suspense></OnView>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}
