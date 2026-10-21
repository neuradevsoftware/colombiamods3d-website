import { CONFIG } from '../config'
import { money } from './format'

/* Mismos datos y reglas que el launcher (cm3d-launcher/ui/js/catalog.js) */
const BACKEND = String(CONFIG.backendUrl || '').replace(/\/+$/, '')

const BADGES = { popular: ['hot', 'POPULAR'], nuevo: ['new', 'NUEVO'], actualizado: ['update', 'ACTUALIZADO'] }

// Diferencia entre el reloj del servidor y el del navegador (para ofertas/lanzamientos)
let clockOffset = 0
export const nowMs = () => Date.now() + clockOffset

function mapMod(m) {
  const free = !!m.isFree
  return {
    id: m.slug, title: m.name, brand: m.brand || 'CM3D', type: m.vehicleType || 'camion',
    game: String(m.game || '').toUpperCase().replace(/\s|-/g, ''),
    isFree: free, price: free ? 0 : (m.priceCents || 0),
    originalPriceCents: free ? 0 : (m.originalPriceCents ?? m.priceCents ?? 0),
    finalPriceCents: free ? 0 : (m.finalPriceCents ?? m.priceCents ?? 0),
    discountPercent: m.discountPercent || 0, discountSource: m.discountSource || null, discountEndsAt: m.discountEndsAt || null,
    saleState: m.saleState === 'proximamente' ? 'proximamente' : 'comprar',
    releaseAt: m.releaseAtIso || null, rating: m.rating || 5,
    badge: BADGES[m.badge] || null,
    img: m.coverImageUrl ? BACKEND + m.coverImageUrl : '',
    gallery: (m.images || []).slice(1).map((i) => BACKEND + i.url),
    desc: m.description || 'Sin descripción todavía.',
  }
}

export const isSoon = (v) => v.saleState === 'proximamente' || v.type === 'proximamente'

export function promoKind(v) {
  if (v.isFree || isSoon(v)) return null
  if (v.discountSource !== 'mod' && v.discountSource !== 'general') return null
  if (!(v.discountPercent > 0)) return null
  if (v.discountEndsAt && Date.parse(v.discountEndsAt) <= nowMs()) return null
  return v.discountSource
}

export const releaseIso = (v) => (isSoon(v) && v.releaseAt && Date.parse(v.releaseAt) > nowMs() ? v.releaseAt : null)

/** Estructura del precio para la tarjeta: { free } | { final } | { original, final, percent } */
export function priceParts(v) {
  if (v.isFree) return { free: true }
  if (isSoon(v)) return { final: money(v.originalPriceCents ?? v.price) }
  const f = v.finalPriceCents ?? v.price
  if (v.discountPercent > 0 && v.originalPriceCents != null && f < v.originalPriceCents && promoKind(v)) {
    return { original: money(v.originalPriceCents), final: money(f), percent: v.discountPercent }
  }
  return { final: money(f) }
}

async function api(path) {
  const r = await fetch(BACKEND + path, { headers: { Accept: 'application/json' } })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  const j = await r.json()
  if (j && j.serverTime) {
    const t = Date.parse(j.serverTime)
    if (!isNaN(t)) clockOffset = t - Date.now()
  }
  return j
}

/** Descuento general de la tienda (GET /api/store/settings): { percent, endsAt } si está vigente; si no, null. */
export function generalPromo(settings) {
  if (!settings || !settings.discountActive || !(settings.discountPercent > 0)) return null
  const endsAt = settings.discountEndsAtIso || null
  if (endsAt && Date.parse(endsAt) <= nowMs()) return null
  return { percent: settings.discountPercent, endsAt }
}

/** Mods con oferta vigente que se muestran en Descuentos (mayor descuento primero). Inicio los excluye de "Del catálogo" para no repetirlos. */
export const dealMods = (mods, max = 4) => mods.filter((m) => promoKind(m)).sort((a, b) => b.discountPercent - a.discountPercent).slice(0, max)

/** Mods "Próximamente" con lanzamiento programado en el futuro, el más cercano primero. */
export const upcomingReleases = (mods) => mods.filter((m) => releaseIso(m)).sort((a, b) => Date.parse(a.releaseAt) - Date.parse(b.releaseAt))

export async function fetchCatalog() {
  const [cat, feat, store] = await Promise.all([
    api('/api/catalog'),
    api('/api/catalog/featured').catch(() => null),
    api('/api/store/settings').catch(() => null),
  ])
  return {
    mods: (cat.items || []).map(mapMod),
    featured: feat ? (feat.items || []).map(mapMod) : [],
    settings: (store && store.settings) || null,
  }
}
