import { test } from 'node:test'
import assert from 'node:assert/strict'
import { clamp, formatCountdown, money, norm, relShort } from './format.js'

test('norm: quita tildes y pasa a minúsculas', () => {
  assert.equal(norm('Camión ÁRBOL'), 'camion arbol')
})

test('clamp: limita al rango', () => {
  assert.equal(clamp(5, 0, 1), 1)
  assert.equal(clamp(-3, 0, 1), 0)
  assert.equal(clamp(0.4, 0, 1), 0.4)
})

test('money: formato es-CO con signo $', () => {
  assert.match(money(15000), /^\$15[.,\s\u00a0]?000$/)
  assert.equal(money(0), '$0')
})

test('formatCountdown: días, horas, minutos y segundos', () => {
  assert.equal(formatCountdown(0), '00:00:00')
  assert.equal(formatCountdown(-500), '00:00:00')
  assert.equal(formatCountdown(61 * 1000), '00:01:01')
  assert.equal(formatCountdown((2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000), '2d 03:04:05')
})

test('relShort: fecha corta en hora de Colombia', () => {
  assert.equal(relShort('2026-10-14T20:00:00Z'), '14 OCT')
  assert.equal(relShort('no-es-una-fecha'), '')
})
