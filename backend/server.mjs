import 'dotenv/config'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import nodemailer from 'nodemailer'
import { buildContactEmail } from './mail-template.mjs'

const required = ['CORS_ORIGINS', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'SUPPORT_EMAIL', 'BUSINESS_EMAIL']
const missing = required.filter((key) => !process.env[key]?.trim())
if (missing.length) {
  console.error(`Faltan variables SMTP requeridas: ${missing.join(', ')}`)
  process.exit(1)
}

const port = Number(process.env.PORT || 3001)
const siteUrl = (process.env.SITE_URL || 'https://colombiamods3d.com').replace(/\/+$/, '')
const logoUrl = process.env.EMAIL_LOGO_URL || `${siteUrl}/icon-512.png`
const allowedOrigins = new Set((process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean))
const businessType = 'Propuesta de negocios'
const allowedTypes = new Set(['Consulta sobre el catálogo', 'Consulta sobre un mod', 'Soporte', businessType, 'Otro'])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', process.env.TRUST_PROXY === '1' ? 1 : false)

app.use((req, res, next) => {
  const origin = req.get('origin')
  if (origin && !allowedOrigins.has(origin)) return res.status(403).json({ error: 'Origen no permitido.' })
  if (origin) {
    res.set('Access-Control-Allow-Origin', origin)
    res.vary('Origin')
  }
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Accept, Content-Type')
    return res.sendStatus(204)
  }
  next()
})

app.use(express.json({ limit: '12kb', strict: true }))

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.post('/api/contact', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Se alcanzó el límite de envíos. Inténtalo más tarde.' },
}), async (req, res) => {
  const { name, email, subject, type, message } = req.body ?? {}
  const data = {
    name: typeof name === 'string' ? name.trim() : '',
    email: typeof email === 'string' ? email.trim() : '',
    subject: typeof subject === 'string' ? subject.trim().replace(/[\r\n]+/g, ' ') : '',
    type: typeof type === 'string' ? type.trim() : '',
    message: typeof message === 'string' ? message.trim() : '',
  }

  if (data.name.length < 1 || data.name.length > 100
    || data.email.length > 254 || !emailPattern.test(data.email)
    || data.subject.length < 1 || data.subject.length > 150
    || !allowedTypes.has(data.type)
    || data.message.length < 10 || data.message.length > 5000) {
    return res.status(400).json({ error: 'Revisa los datos del formulario e inténtalo de nuevo.' })
  }

  const recipient = data.type === businessType ? process.env.BUSINESS_EMAIL : process.env.SUPPORT_EMAIL
  try {
    const mailContent = buildContactEmail(data, { siteUrl, logoUrl })
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: recipient,
      replyTo: data.email,
      subject: `[Formulario web] ${data.subject}`,
      text: mailContent.text,
      html: mailContent.html,
    })
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Error SMTP al enviar contacto:', error?.code || error?.name || 'desconocido')
    return res.status(502).json({ error: 'No se pudo entregar el mensaje. Inténtalo más tarde.' })
  }
})

app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error)
  if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'El mensaje es demasiado largo.' })
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'El formato de la solicitud no es válido.' })
  console.error('Error procesando solicitud de contacto:', error?.name || 'desconocido')
  return res.status(500).json({ error: 'Ocurrió un error interno.' })
})

try {
  await transporter.verify()
  app.listen(port, () => console.log(`API de contacto escuchando en el puerto ${port}`))
} catch (error) {
  console.error('No se pudo iniciar la conexión SMTP:', error?.code || error?.name || 'desconocido')
  process.exitCode = 1
}
