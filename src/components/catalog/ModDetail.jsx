import { useEffect, useRef, useState } from 'react'
import { CAT_LABEL } from '../../config'
import { priceParts, promoKind, releaseIso } from '../../lib/catalog'
import { prefersReducedMotion, relLong, relShort } from '../../lib/format'
import { CloseIcon } from '../ui/Icons'
import ModImage from './ModImage'
import PromoTimer from './PromoTimer'
import { ModAction } from './ModCard'

const PICTO = /\p{Extended_Pictographic}/u
const ONLY_SYMBOLS = /^[\p{Extended_Pictographic}\uFE0F\u200D\s]+$/u
const LEAD_MARK = /^[\p{Extended_Pictographic}\uFE0F\u200D\s•▪▫◆◇●○·*✔✓–-]+/u

/**
 * Convierte la descripción (texto plano con emojis) en bloques compactos:
 * títulos de sección (línea en MAYÚSCULAS con emoji), viñetas (línea que empieza con emoji o símbolo) y párrafos.
 */
function parseDesc(text) {
  const blocks = []
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || ONLY_SYMBOLS.test(line)) continue
    const clean = line.replace(LEAD_MARK, '').trim()
    if (!clean) continue
    const marked = LEAD_MARK.test(line)
    if (marked && PICTO.test(line.slice(0, 3)) && clean.length < 90 && clean === clean.toUpperCase() && !/[.:]$/.test(clean)) blocks.push({ t: 'h', text: clean })
    else if (marked) {
      const last = blocks[blocks.length - 1]
      if (last?.t === 'ul') last.items.push(clean)
      else blocks.push({ t: 'ul', items: [clean] })
    } else blocks.push({ t: 'p', text: line })
  }
  return blocks
}

function Chip({ children, tone = '' }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[12px] leading-none ${tone || 'border-line bg-deep/60 text-steel-light'}`}>{children}</span>
}

export default function ModDetail({ mod: v, onClose }) {
  const [shown, setShown] = useState(false)
  const [idx, setIdx] = useState(0)
  const card = useRef(null), closeBtn = useRef(null), last = useRef(document.activeElement)

  const close = () => { setShown(false); setTimeout(onClose, prefersReducedMotion() ? 0 : 260) }

  useEffect(() => {
    document.body.classList.add('lock')
    const raf = requestAnimationFrame(() => setShown(true))
    const f = setTimeout(() => closeBtn.current?.focus(), 30)
    const prev = last.current
    return () => { cancelAnimationFrame(raf); clearTimeout(f); document.body.classList.remove('lock'); prev?.focus?.() }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') return close()
      if (e.key !== 'Tab') return
      const f = [...card.current.querySelectorAll('button,a[href],[tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && !x.hidden)
      if (!f.length) return
      const a = f[0], z = f[f.length - 1]
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const pk = promoKind(v), rel = releaseIso(v), price = priceParts(v)
  const frame = pk ? `promo promo-modal ${pk === 'general' ? 'promo-general' : ''}` : rel ? 'promo promo-modal promo-soon' : ''
  const blocks = parseDesc(v.desc)
  const imgs = [v.img, ...v.gallery].filter(Boolean)
  const scenes = imgs.length ? imgs : ['']

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="mTitle" className="fixed inset-0 z-200 grid place-items-center p-5 max-[760px]:place-items-end max-[760px]:p-0">
      <div onClick={close} className={`absolute inset-0 bg-[rgba(4,6,8,.78)] backdrop-blur-xs transition-opacity duration-250 ${shown ? 'opacity-100' : 'opacity-0'}`} />
      <div ref={card}
        className={`relative grid ${frame} h-[min(600px,calc(100svh-40px))] w-full max-w-[1000px] grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-panel-2 shadow-[0_30px_70px_-20px_rgba(0,0,0,.7)] transition-[opacity,transform] duration-300 ease-soft max-[1100px]:h-[min(720px,calc(100svh-40px))] max-[1100px]:max-w-[640px] max-[1100px]:grid-cols-1 max-[1100px]:grid-rows-[auto_minmax(0,1fr)] max-[760px]:h-[92svh] max-[760px]:max-w-none max-[760px]:rounded-b-none ${shown ? 'opacity-100 [transform:none]' : 'opacity-0 [transform:translateY(14px)]'}`}>
        <button ref={closeBtn} type="button" onClick={close} aria-label="Cerrar ventana"
          className="absolute top-3 right-3 z-3 inline-flex size-11 items-center justify-center rounded-lg border border-line bg-deep/70 text-steel-light backdrop-blur-sm transition-all duration-150 hover:border-amber-deep hover:text-amber">
          <CloseIcon className="size-4" />
        </button>

        {/* Imagen + miniaturas */}
        <div className="flex min-h-0 min-w-0 flex-col gap-2.5 bg-deep p-3.5">
          <div className="relative h-[clamp(190px,30svh,300px)] min-w-0 overflow-hidden rounded-lg bg-black min-[1101px]:h-auto min-[1101px]:flex-1">
            {scenes[idx] && <ModImage key={`bg${idx}`} src={scenes[idx]} alt="" className="absolute inset-0 size-full scale-110 opacity-45 blur-2xl" />}
            <ModImage key={idx} src={scenes[idx]} alt={v.title} fit="contain" className="relative size-full" />
            <span className="absolute bottom-2 left-2 z-2 rounded-[3px] bg-deep/70 px-[7px] py-[3px] font-mono text-[9.5px] uppercase tracking-[.5px] text-[#cfd6db]">{CAT_LABEL[v.type] || 'Accesorio'}</span>
          </div>
          {scenes.length > 1 && (
            <div className="flex flex-none gap-2 overflow-x-auto pb-0.5">
              {scenes.map((src, i) => (
                <button key={i} type="button" aria-label={`Imagen ${i + 1}`} aria-pressed={i === idx} onClick={() => setIdx(i)}
                  className="h-[54px] w-[78px] flex-none overflow-hidden rounded-md border border-line bg-black opacity-55 transition-all duration-150 hover:opacity-85 aria-pressed:border-amber aria-pressed:opacity-100">
                  <ModImage src={src} alt="" fit="contain" className="size-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ficha: cabecera fija · descripción con scroll · botón de compra siempre visible */}
        <div className="flex min-h-0 min-w-0 flex-col">
          <div className="flex-none px-6 pt-5 pb-3.5 max-[1100px]:pt-4 min-[1101px]:pr-[68px]">
            <h2 id="mTitle" className="font-display text-[clamp(1.4rem,2.2vw,1.7rem)] font-semibold leading-[1.1] tracking-[.3px]">{v.title}</h2>
            <p className="mt-1 font-mono text-[12px] text-steel">{v.brand}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip tone="border-amber/40 bg-amber/10 text-amber">
                {price.free ? 'Gratis' : (
                  <>
                    {price.original && <s className="text-steel">{price.original}</s>}
                    <b className="font-normal">{price.final}</b>
                    {price.percent && <span className="rounded-[3px] bg-amber px-1 py-px text-[10px] font-bold text-[#1a1206]">-{price.percent}%</span>}
                  </>
                )}
              </Chip>
              <Chip><span className="text-amber">★</span> {v.rating}/5</Chip>
            </div>
            {(pk || rel) && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="promo-banner">
                  <b>{pk ? `-${v.discountPercent}%` : relShort(rel)}</b>
                  <span>{pk ? (pk === 'general' ? 'Descuento general' : 'Oferta especial') : '¡Próximo lanzamiento!'}</span>
                </div>
                {pk
                  ? (v.discountEndsAt ? <PromoTimer kind={pk} endIso={v.discountEndsAt} large /> : <div className="promo-note">Sin fecha de fin anunciada.</div>)
                  : <><PromoTimer kind="soon" endIso={rel} large /><div className="promo-note">Lanzamiento: {relLong(rel)}</div></>}
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto border-t border-line px-6 py-4 text-[15px] leading-[1.5] text-steel-light">
            {blocks.map((b, i) => b.t === 'h'
              ? <h3 key={i} className="mt-4 mb-1.5 font-display text-[12.5px] font-medium uppercase tracking-[1.2px] text-amber first:mt-0">{b.text}</h3>
              : b.t === 'ul'
                ? <ul key={i} className="mb-1 grid gap-1">{b.items.map((it, j) => <li key={j} className="flex gap-2"><span aria-hidden="true" className="mt-[0.55em] size-1.5 flex-none rotate-45 bg-amber/80" /><span>{it}</span></li>)}</ul>
                : <p key={i} className="mb-2 last:mb-0">{b.text}</p>)}
          </div>

          <div className="flex flex-none flex-wrap gap-2.5 border-t border-line bg-panel-2 px-6 py-3.5"><ModAction mod={v} big /></div>
        </div>
      </div>
    </div>
  )
}
