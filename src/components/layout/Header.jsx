import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/logo-sm.webp'
import { LauncherButton } from '../ui/Links'

const NAV = [['/', 'Inicio'], ['/nosotros', 'Quiénes somos'], ['/catalogo', 'Catálogo de mods'], ['/contacto', 'Contacto']]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(scrollY > 24)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    const key = (e) => e.key === 'Escape' && setOpen(false)
    const out = (e) => !e.target.closest('header') && setOpen(false)
    document.addEventListener('keydown', key); document.addEventListener('click', out)
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('click', out) }
  }, [])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  const bar = 'absolute left-3 right-3 h-0.5 bg-white transition-[transform,top] duration-300 ease-soft'
  return (
    <header className={`fixed inset-x-0 top-0 z-100 isolate pt-[env(safe-area-inset-top,0px)] transition-[background,border-color] duration-300 ${open ? 'bg-panel' : scrolled ? 'bg-panel/90 backdrop-blur-[14px]' : 'bg-linear-to-b from-deep/80 to-deep/0'}`}>
      <div className="relative z-10 mx-auto flex h-[68px] max-w-[1304px] items-center gap-[26px] px-(--gx) max-[760px]:h-[60px]">
        <Link to="/" aria-label="Colombia Mods 3D, ir al inicio" className="mr-auto block leading-[0]">
          <img src={logo} alt="Colombia Mods 3D" width="312" height="140" className="h-[46px] w-auto drop-shadow-[0_0_6px_rgba(0,0,0,.5)] max-[760px]:h-10" />
        </Link>
        <nav aria-label="Principal" className="flex gap-1 max-[900px]:hidden">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `group relative px-3.5 py-2.5 font-display text-[.9rem] uppercase tracking-[.08em] transition-colors duration-200 after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:origin-left after:bg-amber after:transition-transform after:duration-[350ms] after:ease-soft hover:text-white hover:after:scale-x-100 ${isActive ? 'text-white after:scale-x-100' : 'text-steel-light after:scale-x-0'}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <LauncherButton size="sm" className="max-[900px]:hidden" />
        <button type="button" aria-expanded={open} aria-controls="mnav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen((o) => !o)}
          className="relative hidden size-12 rounded-md max-[900px]:block">
          <span className={`${bar} ${open ? 'top-[23px] rotate-45' : 'top-[19px]'}`} />
          <span className={`${bar} ${open ? 'top-[23px] -rotate-45' : 'top-[27px]'}`} />
        </button>
      </div>
      <div id="mnav" inert={!open} aria-hidden={!open}
        className={`fixed inset-0 z-0 overflow-y-auto bg-deep px-(--gx) pt-[calc(var(--hh)+clamp(34px,8vh,76px))] pb-[max(28px,env(safe-area-inset-bottom,0px))] transition-[opacity,transform,visibility] duration-500 ease-soft before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_85%_15%,rgba(255,176,32,.13),transparent_45%),linear-gradient(180deg,#12161a_0%,#0a0d10_70%)] before:content-[''] ${open ? 'visible opacity-100 [transform:none]' : 'invisible pointer-events-none opacity-0 [transform:translateY(-18px)_scale(.985)]'}`}>
        <div className="relative mx-auto flex min-h-full w-full max-w-[680px] flex-col">
          <span className="mb-5 font-mono text-[11px] uppercase tracking-[.2em] text-amber">Navegación</span>
          <nav aria-label="Principal móvil" className="flex flex-col">
            {NAV.map(([to, label], index) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
                style={{ '--menu-delay': `${index * 75}ms` }}
                className={({ isActive }) => `mobile-menu-link group flex min-h-[70px] items-center justify-between border-b border-line font-display text-[clamp(1.8rem,8vw,3rem)] uppercase leading-none tracking-[.035em] transition-colors hover:text-amber ${open ? 'mobile-menu-link-enter' : ''} ${isActive ? 'text-amber' : 'text-fg'}`}>
                <span>{label}</span>
                <span aria-hidden="true" className="font-body text-lg text-amber opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100">↗</span>
              </NavLink>
            ))}
          </nav>
          <div className={`mt-auto pt-8 ${open ? 'mobile-menu-link-enter' : ''}`} style={{ '--menu-delay': `${NAV.length * 75}ms` }}>
            <LauncherButton className="w-full justify-center" />
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[.15em] text-steel">Mods para simuladores, a otro nivel.</p>
          </div>
        </div>
      </div>
    </header>
  )
}
