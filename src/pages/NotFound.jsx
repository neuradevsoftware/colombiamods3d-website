import { Link } from 'react-router-dom'
import { HeroButton } from '../components/ui/Buttons'
import PageHero from '../components/layout/PageHero'
import Screen from './Screen'

export default function NotFound() {
  return (
    <Screen label="Página no encontrada">
      <PageHero crumb="Error 404" title="Página no encontrada." lead="La dirección que buscas no existe o cambió de lugar." />
      <div className="pad flex flex-wrap gap-2.5 py-[clamp(36px,6vw,72px)]">
        <HeroButton as={Link} to="/" variant="primary">Ir al inicio</HeroButton>
        <HeroButton as={Link} to="/catalogo" variant="ghost">Ver catálogo</HeroButton>
      </div>
    </Screen>
  )
}
