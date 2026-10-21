import { CAT_LABEL, CONFIG, MSG } from '../../config'
import { useToast } from '../../context/Toast'
import { isSoon, priceParts, promoKind, releaseIso } from '../../lib/catalog'
import { relShort } from '../../lib/format'
import { ActButton } from '../ui/Buttons'
import { ClockIcon, DiscordIcon, StarIcon } from '../ui/Icons'
import ModImage from './ModImage'
import PromoTimer from './PromoTimer'

const BADGE = { hot: 'border-amber bg-amber text-[#1a1206]', new: 'border-ok bg-ok text-[#06170e]', update: 'border-info bg-info text-[#06121f]' }

function Stars({ n }) {
  return <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${n} de 5 estrellas`}>{[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} filled={i <= n} />)}</span>
}

export function ModAction({ mod, big }) {
  const toast = useToast()
  if (isSoon(mod)) return <ActButton state="soon" big={big} icon={<ClockIcon />}>Próximamente</ActButton>
  return (
    <ActButton big={big} icon={<DiscordIcon />}
      onClick={(e) => {
        e.stopPropagation()
        const url = CONFIG.discordUrl
        url ? window.open(url, '_blank', 'noopener,noreferrer') : toast(MSG.discord)
      }}>Comprar</ActButton>
  )
}

export default function ModCard({ mod: v, onOpen }) {
  const pk = promoKind(v), rel = releaseIso(v), price = priceParts(v)
  const ribbon = pk ? [`-${v.discountPercent}%`, pk === 'general' ? 'General' : 'Oferta'] : rel ? [relShort(rel), 'Lanzamiento'] : null
  const frame = pk ? `promo promo-card ${pk === 'general' ? 'promo-general' : ''}` : rel ? 'promo promo-card promo-soon' : 'border border-line'
  return (
    <article data-flip={v.id}
      className={`relative flex flex-col overflow-hidden rounded-[9px] bg-card transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-[#3a4550] ${frame}`}>
      <button type="button" aria-label={`Ver ${v.title}`} onClick={() => onOpen(v)} className="group flex w-full flex-1 flex-col text-left">
        <div className="relative h-[150px] w-full overflow-hidden bg-black">
          {v.badge && <span className={`absolute top-2 left-2 z-2 rounded-[3px] border px-[7px] py-[3px] font-mono text-[9.5px] uppercase tracking-[1px] ${BADGE[v.badge[0]]}`}>{v.badge[1]}</span>}
          {ribbon && <div className="promo-ribbon"><b>{ribbon[0]}</b><span>{ribbon[1]}</span></div>}
          <ModImage src={v.img} alt={v.title} className="size-full transition-transform duration-800 ease-soft group-hover:scale-[1.06]" />
          <span className="absolute right-2 bottom-2 z-2 rounded-[3px] bg-deep/65 px-[7px] py-[3px] font-mono text-[9.5px] uppercase tracking-[.5px] text-[#cfd6db]">{CAT_LABEL[v.type] || 'Accesorio'}</span>
        </div>
        <div className="flex flex-col gap-1.5 px-3.5 pt-3 pb-1.5">
          <div className="font-display text-base font-semibold leading-[1.2] tracking-[.3px]">{v.title}</div>
          <div className="font-mono text-[11.5px] text-steel">{v.brand}</div>
          <div className="flex min-h-[22px] items-center justify-between gap-2">
            <Stars n={v.rating} />
            <span className="inline-flex items-baseline gap-1.5 font-display text-base font-semibold tracking-[.3px]">
              {price.free ? 'Gratis' : price.original ? (<><s className="text-xs font-medium opacity-55">{price.original}</s><span>{price.final}</span><em className="text-[11px] font-bold not-italic text-ok">-{price.percent}%</em></>) : price.final}
            </span>
          </div>
          {pk && v.discountEndsAt ? <PromoTimer kind={pk} endIso={v.discountEndsAt} /> : rel ? <PromoTimer kind="soon" endIso={rel} /> : null}
        </div>
      </button>
      <div className="mt-auto flex gap-2 px-3.5 pt-2 pb-3.5"><ModAction mod={v} /></div>
    </article>
  )
}
