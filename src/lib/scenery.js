/* Ilustración SVG del hero (cordilleras). Devuelve la lista de <path> como datos (sin innerHTML, compatible con Trusted Types). */
const rng = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647)

/**
 * Cordillera periódica: y(0) == y(W), así que el tile se repite sin costura y puede desplazarse en bucle.
 * `rim` dibuja una línea de luz en la cresta (reflejo del atardecer).
 */
export function ridge(seed, base, amp, fill, W, H, op = 1, rim) {
  const r = rng(seed * 97 + 13)
  const p = [r() * 6.28, r() * 6.28, r() * 6.28]
  const f = [1 + Math.floor(r() * 2), 3 + Math.floor(r() * 2), 7 + Math.floor(r() * 3)].map((n) => (2 * Math.PI * n) / W)
  const y = (x) => base - amp * (0.55 * Math.sin(x * f[0] + p[0]) + 0.3 * Math.sin(x * f[1] + p[1]) + 0.15 * Math.sin(x * f[2] + p[2]))
  const pts = []
  for (let x = 0; x <= W; x += 20) pts.push(`${x} ${y(x).toFixed(1)}`)
  const out = [{ d: `M0 ${H}L${pts.join('L')}L${W} ${H}Z`, fill, opacity: op }]
  if (rim) out.push({ d: `M${pts.join('L')}`, fill: 'none', stroke: rim, strokeWidth: 1.5, vectorEffect: 'non-scaling-stroke' })
  return out
}
