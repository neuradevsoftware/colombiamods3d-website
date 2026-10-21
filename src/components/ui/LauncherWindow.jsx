import { useRef } from 'react'
import { prefersReducedMotion } from '../../lib/format'

/** Ventana "Launcher" con inclinación 3D al mover el puntero. */
export default function LauncherWindow({ children, tilt = false }) {
  const win = useRef(null)
  const on = tilt && typeof matchMedia === 'function' && matchMedia('(pointer: fine)').matches && !prefersReducedMotion()
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    win.current.dataset.live = '1'
    win.current.style.setProperty('--ry', (x * 14).toFixed(2) + 'deg')
    win.current.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg')
  }
  const leave = () => { delete win.current.dataset.live; win.current.style.removeProperty('--ry'); win.current.style.removeProperty('--rx') }
  return (
    <div className="[perspective:1600px]" {...(on ? { onPointerMove: move, onPointerLeave: leave } : {})}>
      <div ref={win}
        className={`overflow-hidden rounded-[10px] border border-[#3a444c] bg-panel shadow-[0_50px_90px_-30px_rgba(0,0,0,.85)] will-change-transform ${tilt ? '[transform:rotateY(var(--ry,-7deg))_rotateX(var(--rx,3deg))] transition-transform duration-500 ease-soft data-[live]:duration-[120ms] data-[live]:ease-linear' : ''}`}>
        <div aria-hidden="true" className="flex h-[38px] items-center gap-2 border-b border-line bg-panel-2 px-3.5">
          <i className="size-[11px] rounded-full bg-[#3a444c]" /><i className="size-[11px] rounded-full bg-[#3a444c]" /><i className="size-[11px] rounded-full bg-[#3a444c]" />
          <span className="ml-2.5 font-mono text-[11px] text-steel">Launcher</span>
        </div>
        <div className="relative aspect-[1919/1012] bg-deep">{children}</div>
      </div>
    </div>
  )
}

export const ShotPlaceholder = ({ title, text }) => (
  <div className="absolute inset-3.5 grid place-items-center rounded-md border border-dashed border-[#4a5661] bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.025)_0_12px,transparent_12px_24px)] p-6 text-center text-steel-light">
    <div><b className="mb-1.5 block font-display text-2xl font-semibold uppercase text-fg">{title}</b>{text && <span className="block max-w-[34ch] text-base">{text}</span>}</div>
  </div>
)
