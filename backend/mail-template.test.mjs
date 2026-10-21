import assert from 'node:assert/strict'
import test from 'node:test'
import { buildContactEmail } from './mail-template.mjs'

const data = {
  name: 'Ana <Prueba>',
  email: 'ana@example.com',
  subject: 'Consulta & soporte',
  type: 'Soporte',
  message: 'Primera línea\n<script>alert("x")</script>',
}

test('renders all contact details in HTML and plain text', () => {
  const { html, text } = buildContactEmail(data, {
    siteUrl: 'https://colombiamods3d.com',
    logoUrl: 'https://colombiamods3d.com/icon-512.png',
    receivedAt: new Date('2026-10-17T18:00:00.000Z'),
  })

  for (const value of ['Ana &lt;Prueba&gt;', 'ana@example.com', 'Consulta &amp; soporte', 'Soporte', 'Primera línea<br>&lt;script&gt;']) {
    assert.ok(html.includes(value), `HTML is missing ${value}`)
  }
  assert.match(html, /<img src="https:\/\/colombiamods3d\.com\/icon-512\.png"/)
  assert.match(html, /mailto:ana@example\.com\?subject=Re%3A%20Consulta%20%26%20soporte/)
  assert.doesNotMatch(html, /<script>alert/)
  for (const value of ['Ana <Prueba>', 'ana@example.com', 'Consulta & soporte', 'Soporte', 'Primera línea\n<script>alert("x")</script>']) {
    assert.ok(text.includes(value), `Plain text is missing ${value}`)
  }
})

test('escapes quotes and ampersands from user-submitted fields', () => {
  const { html } = buildContactEmail({
    ...data,
    name: '"><img src=x onerror=alert(1)>',
    subject: '" onclick="alert(1)&',
    message: 'Texto con & y "comillas"',
  }, { siteUrl: 'https://colombiamods3d.com', logoUrl: 'https://colombiamods3d.com/icon-512.png' })

  assert.doesNotMatch(html, /<img src=x onerror/)
  assert.doesNotMatch(html, /onclick="alert/)
  assert.match(html, /Texto con &amp; y &quot;comillas&quot;/)
})
