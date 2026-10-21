import { Link } from 'react-router-dom'
import { useCatalog } from '../../context/Catalog'
import { dealMods, generalPromo } from '../../lib/catalog'
import { ArrowRightIcon } from '../ui/Icons'
import ModCard from './ModCard'
import PromoStrips from './PromoStrips'
import Reveal from '../ui/Reveal'

const H2 = 'font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold uppercase leading-[1.05] tracking-[.4px]'
const LINK = 'group inline-flex min-h-11 items-center gap-2 font-display text-[13px] uppercase leading-none tracking-[1px] text-amber transition-[gap,color] duration-200 ease-soft hover:gap-[13px] hover:text-[#ffc247]'

/** Bloque de Inicio: solo Descuentos (franjas animadas + mods con oferta vigente + próximos lanzamientos). Si no hay ningún descuento vigente, la sección no se dibuja. */
export default function NewsOffers() {
  const { mods, settings, openMod } = useCatalog()
  const deals = dealMods(mods)
  const hasOffers = deals.length > 0 || !!generalPromo(settings) // solo descuentos: un próximo lanzamiento por sí solo no abre la sección
  if (!hasOffers) return null

  return (
    <section aria-label="Descuentos" className="border-y border-line bg-panel py-[clamp(48px,7vw,92px)]">
      <div className="pad">
        <div>
          <Reveal className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2 className={H2}>Descuentos</h2>
                <p className="mt-2 font-mono text-[11.5px] text-steel">Precios especiales y próximos lanzamientos.</p>
              </div>
              <Link to="/catalogo" className={LINK}><span className="block pt-px">Ver catálogo</span><ArrowRightIcon className="size-[15px]" /></Link>
            </div>
            <PromoStrips />
            {deals.length > 0 && <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">{deals.map((m) => <ModCard key={m.id} mod={m} onOpen={openMod} />)}</div>}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
