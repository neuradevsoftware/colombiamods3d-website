import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NOT_FOUND, PAGES } from './seo.js'

test('cada página tiene título y descripción de longitud razonable para buscadores', () => {
  for (const [path, p] of Object.entries(PAGES)) {
    assert.ok(p.title.length > 10 && p.title.length <= 70, `${path}: título de ${p.title.length} caracteres`)
    assert.ok(p.description.length >= 50 && p.description.length <= 170, `${path}: descripción de ${p.description.length} caracteres`)
  }
})

test('los títulos son únicos', () => {
  const titles = Object.values(PAGES).map((p) => p.title)
  assert.equal(new Set(titles).size, titles.length)
})

test('las rutas empiezan por / y no terminan en / (salvo la raíz)', () => {
  for (const path of Object.keys(PAGES)) assert.ok(path === '/' || (path.startsWith('/') && !path.endsWith('/')), path)
})

test('la página 404 tiene metadatos propios', () => {
  assert.ok(NOT_FOUND.title && NOT_FOUND.description)
})
