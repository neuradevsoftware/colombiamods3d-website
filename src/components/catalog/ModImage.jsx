import { useState } from 'react'

const FIT = { cover: 'object-cover', contain: 'object-contain' }

/** fit="cover" rellena y recorta (tarjetas); fit="contain" muestra la imagen completa sin recortar (ventana de detalle). */
export default function ModImage({ src, alt, className = '', fit = 'cover' }) {
  const [bad, setBad] = useState(false)
  if (!src || bad) return <div aria-hidden="true" className={`bg-linear-to-br from-[#1a2128] to-[#0d1114] ${className}`} />
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setBad(true)} className={`${FIT[fit] || FIT.cover} ${className}`} />
}
