import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CATS, SIMNAME } from '../config'
import { Chip, HeroButton } from '../components/ui/Buttons'
import { SearchIcon } from '../components/ui/Icons'
import ModCard from '../components/catalog/ModCard'
import PageHero from '../components/layout/PageHero'
import PromoStrips from '../components/catalog/PromoStrips'
import { useCatalog } from '../context/Catalog'
import useFlip from '../hooks/useFlip'
import { norm } from '../lib/format'
import Screen from './Screen'

const DEFAULT_CAT = 'camion' // el catálogo abre en Camiones

export default function Catalog() {
  const { mods, status, reload, openMod } = useCatalog()
  const { state, key } = useLocation()
  const [cat, setCat] = useState(state?.cat ?? DEFAULT_CAT)
  const [sim, setSim] = useState('all')
  const [input, setInput] = useState('')
  const [q, setQ] = useState('')
  const grid = useRef(null)
  const loaded = status === 'ready'

  // Los enlaces del pie (/catalogo con state.cat) reinician filtros, como en el original
  useEffect(() => { if (state?.cat) { setCat(state.cat); setSim('all'); setInput(''); setQ('') } }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(() => setQ(norm(input.trim())), 120); return () => clearTimeout(t) }, [input])

  const sims = useMemo(() => [...new Set(mods.map((m) => m.game).filter((g) => SIMNAME[g]))], [mods])
  const activeSim = sims.length < 2 ? 'all' : sim
  const list = useMemo(
    () => mods.filter((m) => (cat === 'all' || m.type === cat) && (activeSim === 'all' || m.game === activeSim) && (!q || norm(m.title + ' ' + m.brand).includes(q))),
    [mods, cat, activeSim, q],
  )
  useFlip(grid, list.map((m) => m.id).join('|'))

  const filtered = cat !== DEFAULT_CAT || activeSim !== 'all' || q
  const count = !loaded ? '' : list.length === 0 ? 'Sin resultados' : `${list.length} ${list.length === 1 ? 'mod' : 'mods'} ${filtered ? 'con tus filtros' : 'en el catálogo'}`
  const reset = () => { setCat(DEFAULT_CAT); setSim('all'); setInput(''); setQ('') }

  return (
    <Screen label="Catálogo de mods">
      <PageHero pos="12% 50%" crumb="Catálogo de mods" title="Encuentra tu próximo mod." mono="Mods oficiales de Colombia Mods 3D · mismo catálogo del launcher" />
      <div className="pt-[clamp(28px,4vw,44px)] pb-[clamp(48px,7vw,92px)]">
        <div className="pad empty:hidden pb-4"><PromoStrips /></div>
        <div className="pad flex flex-wrap items-center gap-2 pt-1.5 pb-3">
          <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-3">
            <div role="group" aria-label="Categorías" className="flex flex-wrap items-center gap-2">
              {CATS.map(([k, l]) => <Chip key={k} pressed={k === cat} count={loaded ? mods.filter((m) => m.type === k).length : null} onClick={() => setCat(k)}>{l}</Chip>)}
            </div>
            <label className="ml-auto flex min-h-[38px] w-[min(280px,100%)] items-center gap-2 rounded-md border border-line bg-panel-2 px-3 font-mono text-xs text-steel transition-[border-color,box-shadow] duration-150 focus-within:border-amber focus-within:shadow-[0_0_0_3px_rgba(255,176,32,.18)] max-[760px]:w-full">
              <SearchIcon className="size-3.5 !stroke-steel" />
              <span className="sr-only">Buscar por nombre</span>
              <input type="search" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Buscar por nombre..." autoComplete="off"
                className="h-9 w-full bg-transparent font-mono text-xs text-fg outline-none" />
            </label>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2" hidden={sims.length < 2}>
            <span id="simLab" className="mr-1 font-mono text-[11px] text-steel">Simulador</span>
            <div role="group" aria-labelledby="simLab" className="flex flex-wrap items-center gap-2">
              {[['all', 'Todos'], ...sims.map((g) => [g, SIMNAME[g]])].map(([k, l]) => <Chip key={k} pressed={k === activeSim} onClick={() => setSim(k)}>{l}</Chip>)}
            </div>
            <div className="flex-1" />
          </div>
        </div>
        <p aria-live="polite" className="pad pb-3 font-mono text-[11px] text-steel">{count}</p>
        {status !== 'ready' && (
          <div role="status" className="pad mb-[18px] flex flex-wrap items-center gap-3.5 font-mono text-xs text-steel-light">
            <span>{status === 'loading' ? 'Cargando mods…' : 'No se pudo conectar con el servidor de CM3D.'}</span>
            {status === 'error' && <HeroButton size="sm" onClick={reload}>Reintentar</HeroButton>}
          </div>
        )}
        <div className="pad">
          <div ref={grid} aria-busy={status === 'loading'} hidden={list.length === 0} className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {list.map((m) => <ModCard key={m.id} mod={m} onOpen={openMod} />)}
          </div>
        </div>
        {loaded && list.length === 0 && (
          <div className="mx-(--side) mt-2.5 rounded-[10px] border border-dashed border-[#3a444c] px-5 py-[60px] text-center">
            {mods.length === 0 ? (
              <>
                <h2 className="font-display text-[1.6rem] font-semibold uppercase">Aún no tenemos mods disponibles</h2>
                <p className="mt-1.5 text-steel">Estamos preparando nuevas creaciones para el catálogo. Vuelve pronto para descubrirlas.</p>
              </>
            ) : (
              <>
                <h2 className="font-display text-[1.6rem] font-semibold uppercase">Aún no tenemos mods para esta búsqueda</h2>
                <p className="mt-1.5 mb-5 text-steel">Prueba otra categoría o borra la búsqueda para ver más mods.</p>
                <HeroButton size="sm" onClick={reset}>Borrar filtros</HeroButton>
              </>
            )}
          </div>
        )}
        <div className="h-12" />
      </div>
    </Screen>
  )
}
