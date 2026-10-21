import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useState } from 'react'
import { fetchCatalog } from '../lib/catalog'

const ModDetail = lazy(() => import('../components/catalog/ModDetail')) // solo se descarga al abrir un mod

const Ctx = createContext(null)
export const useCatalog = () => useContext(Ctx)

/** Carga el catálogo una sola vez y comparte datos + modal de detalle entre Inicio y Catálogo. */
export function CatalogProvider({ children }) {
  const [data, setData] = useState({ mods: [], featured: [], settings: null })
  const [status, setStatus] = useState('loading') // loading | error | ready
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setStatus('loading')
    try { setData(await fetchCatalog()); setStatus('ready') } catch { setStatus('error') }
  }, [])
  // Refresco silencioso (sin pantalla de "Cargando"): lo usa la cuenta regresiva cuando una oferta termina o un mod se lanza
  const refresh = useCallback(async () => { try { setData(await fetchCatalog()) } catch { /* se mantiene lo que ya hay */ } }, [])
  useEffect(() => { load() }, [load])

  return (
    <Ctx.Provider value={{ ...data, status, reload: load, refresh, openMod: setSelected }}>
      {children}
      {selected && <Suspense fallback={null}><ModDetail mod={selected} onClose={() => setSelected(null)} /></Suspense>}
    </Ctx.Provider>
  )
}
