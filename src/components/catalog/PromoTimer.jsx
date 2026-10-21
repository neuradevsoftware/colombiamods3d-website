import { useEffect, useSyncExternalStore } from 'react'
import { useCatalog } from '../../context/Catalog'
import { nowMs } from '../../lib/catalog'
import { formatCountdown } from '../../lib/format'
import { ClockIcon, TagIcon } from '../ui/Icons'

// Un solo reloj de 1 s compartido por todas las cuentas regresivas de la página
const subs = new Set()
let tick = Date.now(), timer = 0, lastRefresh = 0
const subscribe = (fn) => {
  subs.add(fn)
  if (subs.size === 1) { tick = Date.now(); timer = setInterval(() => { tick = Date.now(); subs.forEach((f) => f()) }, 1000) }
  return () => { subs.delete(fn); if (!subs.size) clearInterval(timer) }
}
const snapshot = () => tick

/**
 * Cuenta regresiva de una oferta o un lanzamiento.
 * kind: 'mod' | 'general' (oferta, "Termina en") | 'soon' (lanzamiento, "Lanza en").
 * Al llegar a cero vuelve a pedir el catálogo (máx. 1 vez cada 8 s) para que el precio o el estado se actualicen solos.
 */
export default function PromoTimer({ kind = 'mod', endIso, large = false }) {
  useSyncExternalStore(subscribe, snapshot)
  const { refresh } = useCatalog()
  const soon = kind === 'soon'
  const left = Date.parse(endIso) - nowMs()
  const over = left <= 0
  useEffect(() => { if (over && Date.now() - lastRefresh > 8000) { lastRefresh = Date.now(); refresh() } })
  const Icon = soon ? ClockIcon : TagIcon
  return (
    <span className={`promo-timer ${kind}${large ? ' lg' : ''}${!over && left < 3600000 ? ' urgent' : ''}`}>
      <Icon />
      <span>{soon ? 'Lanza en' : 'Termina en'}</span>
      <span className="cd">{over ? (soon ? '¡Ya disponible!' : 'Finalizó') : formatCountdown(left)}</span>
    </span>
  )
}
