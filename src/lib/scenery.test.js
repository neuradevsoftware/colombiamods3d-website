import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ridge } from './scenery.js'

const W = 1600, H = 900

test('ridge: es determinista para la misma semilla', () => {
  assert.deepEqual(ridge(31, 470, 150, '#000', W, H), ridge(31, 470, 150, '#000', W, H))
})

test('ridge: el tile es periódico (primer y último punto a la misma altura) para que el bucle no tenga costura', () => {
  for (const seed of [31, 34, 41, 52]) {
    const [fillPath] = ridge(seed, 500, 100, '#000', W, H)
    const ys = [...fillPath.d.matchAll(/(\d+) (-?\d+\.\d)/g)].map((m) => ({ x: +m[1], y: +m[2] }))
    const first = ys.find((p) => p.x === 0), last = ys.find((p) => p.x === W)
    assert.ok(Math.abs(first.y - last.y) < 0.2, `semilla ${seed}: ${first.y} vs ${last.y}`)
  }
})

test('ridge: añade la línea de cresta solo si se pide', () => {
  assert.equal(ridge(1, 500, 100, '#000', W, H).length, 1)
  const withRim = ridge(1, 500, 100, '#000', W, H, 1, 'rgba(255,255,255,.2)')
  assert.equal(withRim.length, 2)
  assert.equal(withRim[1].fill, 'none')
})
