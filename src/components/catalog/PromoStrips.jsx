import { useCatalog } from '../../context/Catalog'
import { generalPromo, upcomingReleases } from '../../lib/catalog'
import { relShort } from '../../lib/format'
import PromoTimer from './PromoTimer'

/** Franjas animadas de la parte alta de Inicio y Catálogo: descuento general de la tienda + próximo lanzamiento. */
export default function PromoStrips() {
  const { settings, mods, openMod } = useCatalog()
  const general = generalPromo(settings)
  const upcoming = upcomingReleases(mods), next = upcoming[0]
  if (!general && !next) return null
  return (
    <div className="promo-strips">
      {general && (
        <div className="promo-strip">
          <span className="ps-pct">-{general.percent}%</span>
          <span className="ps-text">Descuento general en toda la tienda</span>
          {general.endsAt && <PromoTimer kind="general" endIso={general.endsAt} />}
        </div>
      )}
      {next && (
        <button type="button" className="promo-strip soon" title="Ver detalles del lanzamiento" onClick={() => openMod(next)}>
          <span className="ps-pct">{relShort(next.releaseAt)}</span>
          <span className="ps-text">Próximo lanzamiento: <b>{next.title}</b>{upcoming.length > 1 && <> <i>+{upcoming.length - 1} más</i></>}</span>
          <PromoTimer kind="soon" endIso={next.releaseAt} />
        </button>
      )}
    </div>
  )
}
