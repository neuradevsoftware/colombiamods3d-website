import logo from '../assets/logo.webp'
import PageHero from '../components/layout/PageHero'
import Reveal from '../components/ui/Reveal'
import Screen from './Screen'

const card = 'h-full rounded-xl border border-[#35404a] bg-[linear-gradient(145deg,#171d22,var(--color-panel))] p-[clamp(24px,3vw,34px)] shadow-[0_16px_36px_rgba(0,0,0,.22)]'
const h2 = 'mb-3 font-display text-[1.35rem] font-semibold uppercase tracking-[.6px] text-amber'

export default function About() {
  return (
    <Screen label="Quiénes somos">
      <PageHero pos="35% 50%" crumb="Quiénes somos" title="Pasión por el detalle. Creaciones para simuladores." />
      <div className="pt-[clamp(32px,5vw,56px)] pb-[clamp(48px,7vw,92px)]">
        <div className="pad grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-x-11 gap-y-8 pt-2 max-[1100px]:grid-cols-1">
          <Reveal as="p" className="max-w-[48ch] text-[1.15rem] text-steel-light">En Colombia Mods 3D creamos mods y modelos 3D para simuladores de conducción, combinando creatividad y atención al detalle para ofrecer nuevas experiencias de juego.</Reveal>
          <Reveal className="grid min-h-[300px] place-items-center rounded-[10px] border border-line bg-card bg-[linear-gradient(rgba(255,176,32,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,176,32,.045)_1px,transparent_1px)] bg-[length:40px_40px] p-[clamp(20px,4vw,48px)]">
            <img src={logo} alt="Colombia Mods 3D" width="520" height="234" className="block h-auto w-[min(100%,560px)] object-contain" />
          </Reveal>
        </div>
        <div className="pad grid grid-cols-3 gap-[clamp(24px,3vw,36px)] pt-8 max-[900px]:grid-cols-1">
          <Reveal><article className={card}><h2 className={h2}>Nuestra misión</h2><p className="leading-[1.55] text-steel-light">Crear y compartir mods y modelos 3D de calidad que amplíen la experiencia de conducción en simuladores.</p></article></Reveal>
          <Reveal delay={0.08}><article className={card}><h2 className={h2}>Nuestra visión</h2><p className="leading-[1.55] text-steel-light">Construir un catálogo reconocido por su calidad, variedad e innovación, que crezca junto a nuestra comunidad.</p></article></Reveal>
          <Reveal delay={0.16}><article className={card}>
            <h2 className={h2}>Lo que nos guía</h2>
            <ul className="grid list-disc gap-2 pl-[18px] leading-[1.55] text-steel-light">
              <li>Calidad y atención al detalle.</li><li>Creatividad en cada mod.</li><li>Atención al detalle en cada mod.</li><li>Cercanía con nuestra comunidad.</li>
            </ul>
          </article></Reveal>
        </div>
      </div>
    </Screen>
  )
}
