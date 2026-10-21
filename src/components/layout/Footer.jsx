import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/logo-sm.webp'
import { CATS, CONFIG } from '../../config'
import { ArrowUpIcon } from '../ui/Icons'
import { LauncherButton, SocialLinks } from '../ui/Links'

const H = ({ children }) => <h2 className="mb-3 font-display text-[.95rem] font-medium uppercase tracking-[1.2px] text-steel-light">{children}</h2>
const DISCORD = CONFIG.social.find((s) => s.name === 'Discord')?.url || CONFIG.discordUrl
const lk = 'inline-flex min-h-9 items-center text-steel-light transition-[color,transform] duration-200 ease-soft hover:translate-x-1 hover:text-amber'

export default function Footer() {
  const { pathname } = useLocation()
  return (
    <footer className="border-t border-line bg-panel pt-14">
      <div className="pad grid grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-9 pb-11 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
        <div>
          <Link to="/" aria-label="Colombia Mods 3D, volver al inicio"><img src={logo} alt="Colombia Mods 3D" width="312" height="140" className="h-[68px] w-auto" /></Link>
          <p className="mt-3.5 mb-5 max-w-[34ch] text-steel">Mods y modelos 3D para simuladores de conducción.</p>
          <LauncherButton size="sm" />
        </div>
        <div><H>Navegación</H>
          <ul className="grid gap-0.5">{[['/', 'Inicio'], ['/nosotros', 'Quiénes somos'], ['/catalogo', 'Catálogo de mods'], ['/contacto', 'Contacto'], ['/launcher', 'Launcher']].map(([to, l]) => <li key={to}><Link to={to} className={lk}>{l}</Link></li>)}</ul>
        </div>
        <div><H>Catálogo</H>
          <ul className="grid gap-0.5">{CATS.map(([k, l]) => <li key={k}><Link to="/catalogo" state={{ cat: k }} className={lk}>{l}</Link></li>)}</ul>
        </div>
        <div><H>Contacto</H>
          <ul className="grid gap-0.5">
            <li><span>Soporte: </span><a className={lk} href={`mailto:${CONFIG.contact.email}`}>{CONFIG.contact.email}</a></li>
            {DISCORD && <li><a className={lk} href={DISCORD} target="_blank" rel="noopener noreferrer">Abrir ticket en Discord</a></li>}
            <li><span>Propuestas de negocios: </span><a className={lk} href={`mailto:${CONFIG.businessEmail}`}>{CONFIG.businessEmail}</a></li>
          </ul>
          <SocialLinks className="mt-3.5" />
        </div>
      </div>
      <div className="pad flex flex-wrap items-center justify-between gap-3 border-t border-line py-4 font-mono text-[11px] text-steel">
        <span>© {new Date().getFullYear()} Colombia Mods 3D. Todos los derechos reservados. Desarrollado por{' '}
          <a href="https://neuradevsoftware.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-steel-light transition-colors hover:text-amber">Neuradev Software</a>.</span>
        <div className="flex flex-wrap items-center gap-3.5">
          <Link to="/terminos" className="inline-flex min-h-9 items-center text-steel-light transition-colors hover:text-amber">Términos y condiciones</Link>
          <Link to="/privacidad" className="inline-flex min-h-9 items-center text-steel-light transition-colors hover:text-amber">Política de privacidad</Link>
        </div>
        <Link to="/" onClick={(e) => { if (pathname === '/') { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }) } }}
          className="group inline-flex min-h-11 items-center gap-2 text-steel-light transition-colors hover:text-amber">
          <ArrowUpIcon className="size-[13px] transition-transform duration-300 ease-soft group-hover:-translate-y-[3px]" />Volver al inicio
        </Link>
      </div>
    </footer>
  )
}
