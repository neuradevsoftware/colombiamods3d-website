import { Link } from 'react-router-dom'
import { CONFIG, MSG } from '../../config'
import { useToast } from '../../context/Toast'
import { SOCIAL_ICONS } from './Icons'
import { HeroButton } from './Buttons'
import { DiscordIcon, DownloadIcon } from './Icons'

/** Botón "Descargar launcher": enlaza a la descarga o, si no está configurada, a /launcher + aviso. */
export function LauncherButton({ variant = 'primary', size = 'md', className }) {
  const toast = useToast()
  const url = CONFIG.launcher.downloadUrl
  const common = { variant, size, className, icon: <DownloadIcon className="size-4" /> }
  return url
    ? <HeroButton as="a" href={url} target="_blank" rel="noopener noreferrer" {...common}>Descargar launcher</HeroButton>
    : <HeroButton as={Link} to="/launcher" onClick={() => toast(MSG.launcher)} {...common}>Descargar launcher</HeroButton>
}

/** Botón "Unirme al Discord": alternativa a la descarga en móvil, donde el launcher (solo Windows) no se puede instalar. */
export function DiscordButton({ variant = 'primary', size = 'md', className }) {
  const toast = useToast()
  const url = CONFIG.discordUrl
  const common = { variant, size, className, icon: <DiscordIcon className="size-4" /> }
  return url
    ? <HeroButton as="a" href={url} target="_blank" rel="noopener noreferrer" {...common}>Unirme al Discord</HeroButton>
    : <HeroButton onClick={() => toast(MSG.discord)} {...common}>Unirme al Discord</HeroButton>
}

export function SocialLinks({ className = '' }) {
  const toast = useToast()
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {CONFIG.social.map((s) => {
        const Icon = SOCIAL_ICONS[s.name]
        const cls = 'inline-flex size-11 items-center justify-center rounded-lg border border-line text-steel transition-[color,border-color,background] duration-200 hover:border-amber-deep hover:bg-amber/[.06] hover:text-amber'
        return s.url
          ? <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name} className={cls}>{Icon && <Icon className="size-5" />}</a>
          : <a key={s.name} href="/contacto" aria-label={s.name} title={s.name} className={cls}
              onClick={(e) => { e.preventDefault(); toast(`El enlace de ${s.name} aún no está configurado (CONFIG.social).`) }}>{Icon && <Icon className="size-5" />}</a>
      })}
    </div>
  )
}
