export const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const money = (n) => '$' + Math.round(n).toLocaleString('es-CO')

export function relShort(iso) {
  try {
    const p = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' }).formatToParts(new Date(iso))
    const g = (t) => (p.find((x) => x.type === t) || {}).value || ''
    return (g('day') + ' ' + g('month').replace('.', '').slice(0, 3)).trim().toUpperCase()
  } catch { return '' }
}

export function relLong(iso) {
  try {
    return new Date(iso).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Bogota' }) + ' (hora de Colombia)'
  } catch { return iso }
}

export const prefersReducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function formatCountdown(ms) {
  const total = Math.floor(Math.max(0, ms) / 1000)
  const d = Math.floor(total / 86400), h = Math.floor((total % 86400) / 3600), m = Math.floor((total % 3600) / 60), sec = total % 60
  const pad = (n) => String(n).padStart(2, '0')
  return (d > 0 ? d + 'd ' : '') + pad(h) + ':' + pad(m) + ':' + pad(sec)
}
