import { useState } from 'react'
import { CONFIG } from '../config'
import { Chip } from '../components/ui/Buttons'
import LauncherWindow, { ShotPlaceholder } from '../components/ui/LauncherWindow'
import { LauncherButton } from '../components/ui/Links'
import PageHero from '../components/layout/PageHero'
import Reveal from '../components/ui/Reveal'
import Screen from './Screen'

const L = CONFIG.launcher
const STEPS = [
  ['Instala el launcher', 'Descárgalo desde el botón principal e inicia sesión con una cuenta local o con Gmail.'],
  ['Descarga la Base', 'La Base del mod se instala automáticamente en la carpeta «mod» del simulador.'],
  ['Compra por Discord', 'Las compras se gestionan en nuestro Discord oficial, con el equipo.'],
  ['Descarga el Activador', 'Se habilita después de la compra y el registro.'],
]

function Shot() {
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(null)
  const s = L.screenshots[i]
  return (
    <div>
      <LauncherWindow tilt>
        {!s ? <ShotPlaceholder title="Capturas del launcher no disponibles" /> : (
          <>
            <img src={s.src} srcSet={s.srcSet} sizes="(max-width:1100px) 92vw, 640px" width={s.width} height={s.height} decoding="async" alt={s.alt || s.label || 'Captura del launcher'} className="absolute inset-0 size-full object-cover" />
            {(s.hotspots || []).map((h, n) => (
              <div key={n} className="group absolute z-3 -translate-1/2" style={{ left: `${+h.x}%`, top: `${+h.y}%` }}>
                <button type="button" aria-label={h.label} onClick={() => setOpen(open === n ? null : n)}
                  className="grid size-7 place-items-center rounded-full border-2 border-amber bg-deep/85 before:size-2 before:rounded-full before:bg-amber before:content-['']" />
                <span className={`invisible absolute top-[38px] left-1/2 w-[210px] rounded-md border border-amber bg-panel-2 px-3 py-2.5 text-[.95rem] leading-[1.3] opacity-0 transition-[opacity,transform] duration-300 ease-soft [transform:translateX(-50%)_translateY(6px)] group-hover:visible group-hover:opacity-100 group-hover:[transform:translateX(-50%)] group-focus-within:visible group-focus-within:opacity-100 group-focus-within:[transform:translateX(-50%)] ${open === n ? '!visible !opacity-100 ![transform:translateX(-50%)]' : ''}`}>
                  <b>{h.label}</b><br />{h.text || ''}
                </span>
              </div>
            ))}
          </>
        )}
      </LauncherWindow>
      {L.screenshots.length > 1 && (
        <div role="group" aria-label="Capturas del launcher" className="mt-4 flex flex-wrap gap-2">
          {L.screenshots.map((x, n) => <Chip key={n} pressed={n === i} onClick={() => { setI(n); setOpen(null) }}>{x.label || `Captura ${n + 1}`}</Chip>)}
        </div>
      )}
    </div>
  )
}

export default function Launcher() {
  const specs = [['Versión', L.version], ['Sistema operativo', L.os], ['Requisitos', L.requirements]]
  return (
    <Screen label="Launcher">
      <PageHero pos="88% 50%" crumb="Launcher" title="Todo tu contenido, desde un solo lugar." lead="Descarga el launcher oficial de Colombia Mods 3D y accede a nuestro contenido para simuladores." />
      <div className="pt-[clamp(32px,5vw,56px)] pb-[clamp(48px,7vw,92px)]">
        <div className="pad grid grid-cols-[5fr_7fr] items-center gap-x-[clamp(28px,5vw,72px)] gap-y-8 pt-2 pb-5 max-[1100px]:grid-cols-1">
          <div>
            <p className="mb-[26px] max-w-[42ch] text-[1.2rem] text-steel-light">Descarga el launcher oficial de Colombia Mods 3D y accede a nuestro contenido para simuladores.</p>
            <LauncherButton size="xl" />
            <ul aria-label="Qué incluye el launcher" className="mt-6 grid max-w-[520px] grid-cols-2 gap-x-[18px] gap-y-2 text-[1.02rem] max-[760px]:grid-cols-1">
              {L.features.map((f) => <li key={f} className="flex items-start gap-2.5 text-[#c4ccd2] before:mt-[.5em] before:size-2 before:flex-none before:rounded-[2px] before:bg-amber before:content-['']">{f}</li>)}
            </ul>
            <dl className="mt-[30px] grid max-w-[480px] border-t border-line">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] gap-3 border-b border-line py-[11px] text-base max-[760px]:grid-cols-[100px_1fr]">
                  <dt className="self-center font-mono text-xs text-steel">{k}</dt>
                  <dd className={v ? '' : 'italic text-steel-light'}>{v || 'Por confirmar'}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Shot />
        </div>
        <h2 className="pad mt-9 font-display text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold uppercase leading-[1.05] tracking-[.4px]">Cómo empezar</h2>
        <p className="pad pt-2 pb-3.5 font-mono text-[11px] text-steel">La Base se descarga desde la app y el Activador se habilita tras la compra y el registro.</p>
        <div className="pad grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
          {STEPS.map(([t, d], n) => (
            <Reveal key={t} delay={n * 0.08} className="flex flex-col gap-2 rounded-[10px] border border-line bg-panel-2 p-5 transition-[border-color,transform] duration-200 ease-soft hover:-translate-y-[3px] hover:border-amber-deep">
              <span className="font-display text-[2.2rem] font-bold leading-none text-amber">{n + 1}</span>
              <h3 className="font-display text-[1.05rem] font-semibold uppercase tracking-[.5px]">{t}</h3>
              <p className="text-base leading-[1.35] text-steel-light">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Screen>
  )
}
