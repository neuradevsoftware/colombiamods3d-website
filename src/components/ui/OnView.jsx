import { useEffect, useRef, useState } from 'react'

/** Monta a sus hijos solo cuando el contenedor está cerca del viewport (evita cargar three.js y el modelo hasta que hacen falta). */
export default function OnView({ children, className = '', rootMargin = '300px' }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (seen) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [seen, rootMargin])
  return <div ref={ref} className={className}>{seen ? children : null}</div>
}
