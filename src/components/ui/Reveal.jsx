import { useEffect, useRef, useState } from 'react'

/** Aparición al entrar en pantalla (.rv + data-io del original). */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return setSeen(true)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} style={{ transitionDelay: `${delay}s` }} {...rest}
      className={`transition-[opacity,transform] duration-700 ease-soft motion-reduce:!opacity-100 motion-reduce:![transform:none] ${seen ? 'opacity-100 [transform:none]' : 'opacity-0 [transform:translateY(18px)]'} ${className}`}>
      {children}
    </Tag>
  )
}
