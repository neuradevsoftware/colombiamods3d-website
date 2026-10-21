import { Link } from 'react-router-dom'
import banner from '../../assets/banner.webp'

export default function PageHero({ pos = '50% 50%', crumb, title, lead, mono }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-panel pt-[calc(var(--hh)+clamp(34px,5vw,64px))] pb-[clamp(30px,4vw,48px)]">
      <img src={banner} alt="" aria-hidden="true" style={{ objectPosition: pos }} className="absolute inset-0 -z-20 size-full object-cover brightness-[.6] contrast-[1.05] saturate-[1.05]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,var(--color-deep)_2%,rgba(10,13,16,.4)_48%,rgba(10,13,16,.18)_100%),linear-gradient(90deg,rgba(10,13,16,.92)_0%,rgba(10,13,16,.25)_65%)]" />
      <div className="pad">
        <nav aria-label="Migas de pan" className="font-mono text-[11px] tracking-[.04em] text-steel">
          <Link to="/" className="transition-colors duration-150 hover:text-amber">Inicio</Link> / <span aria-current="page" className="text-steel-light">{crumb}</span>
        </nav>
        <h1 className="mt-3 max-w-[20ch] font-display text-[clamp(2rem,4.4vw,3.8rem)] font-semibold uppercase leading-[1.05] tracking-[.5px] [text-shadow:0_4px_20px_rgba(0,0,0,.6)]">{title}</h1>
        {lead && <p className="mt-3 max-w-[56ch] text-[1.15rem] text-steel-light">{lead}</p>}
        {mono && <p className="mt-3 max-w-[80ch] font-mono text-xs text-steel">{mono}</p>}
      </div>
    </section>
  )
}
