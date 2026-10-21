import { useLayoutEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/format'

/** Anima reordenamientos (FLIP) y entradas de elementos [data-flip] al cambiar `dep`. */
export default function useFlip(ref, dep) {
  const prev = useRef(null)
  useLayoutEffect(() => {
    const els = [...(ref.current?.querySelectorAll('[data-flip]') ?? [])]
    const rects = new Map(els.map((el) => [el.dataset.flip, el.getBoundingClientRect()]))
    if (prev.current && !prefersReducedMotion() && els[0]?.animate) {
      els.forEach((el, i) => {
        const a = prev.current.get(el.dataset.flip), b = rects.get(el.dataset.flip)
        if (a) {
          const dx = a.left - b.left, dy = a.top - b.top
          if (dx || dy) el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' })
        } else {
          el.animate([{ opacity: 0, transform: 'translateY(16px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: Math.min(i * 40, 240), easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' })
        }
      })
    }
    prev.current = rects
  }, [dep]) // eslint-disable-line react-hooks/exhaustive-deps
}
