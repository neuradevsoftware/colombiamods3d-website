import { useRef, useState } from 'react'
import { CONFIG } from '../config'
import { HeroButton } from '../components/ui/Buttons'
import { SocialLinks } from '../components/ui/Links'
import PageHero from '../components/layout/PageHero'
import Screen from './Screen'

const C = CONFIG.contact
const DISCORD = CONFIG.social.find((s) => s.name === 'Discord')?.url || CONFIG.discordUrl // el mismo enlace del icono de Discord del pie
const RULES = {
  name: (v) => (v.trim() ? '' : 'Escribe tu nombre.'),
  mail: (v) => (!v.trim() ? 'Escribe tu correo electrónico.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Revisa el correo: falta el @ o el dominio.'),
  subj: (v) => (v.trim() ? '' : 'Escribe un asunto para tu mensaje.'),
  type: (v) => (v ? '' : 'Elige un tipo de consulta.'),
  msg: (v) => (v.trim().length >= 10 ? '' : 'Cuéntanos un poco más (mínimo 10 caracteres).'),
}
const BUSINESS = 'Propuesta de negocios'
const TYPES = ['Consulta sobre el catálogo', 'Consulta sobre un mod', 'Soporte', BUSINESS, 'Otro']
const STATUS_CLS = { warn: 'border-amber', good: 'border-ok', badx: 'border-danger' }
const INIT = { name: '', mail: '', subj: '', type: '', msg: '' }

/** Aviso de soporte: correo o ticket en la comunidad de Discord. */
function SupportNote({ className = '' }) {
  const link = 'font-semibold text-amber underline decoration-amber/50 underline-offset-4 hover:text-[#ffc247]'
  return (
    <aside aria-label="Soporte" className={`rounded-[9px] border border-amber/40 bg-amber/[.06] px-4 py-3.5 text-[.98rem] leading-[1.45] text-steel-light ${className}`}>
      <strong className="block font-display text-[1.05rem] uppercase tracking-[.5px] text-white">¿Necesitas soporte?</strong>
      Escribe a <a className={link} href={`mailto:${C.email}`}>{C.email}</a> o abre un ticket de soporte en nuestra{' '}
      {DISCORD ? <a className={link} href={DISCORD} target="_blank" rel="noopener noreferrer">comunidad de Discord</a> : 'comunidad de Discord'}.
    </aside>
  )
}

/** Aviso de propuestas de negocios: correo exclusivo, sin soporte. */
function BusinessNote({ className = '' }) {
  return (
    <aside aria-label="Propuestas de negocios" className={`rounded-[9px] border border-line bg-card px-4 py-3.5 text-[.98rem] leading-[1.45] text-steel-light ${className}`}>
      <strong className="block font-display text-[1.05rem] uppercase tracking-[.5px] text-white">¿Una propuesta de negocios?</strong>
      Se envía a <a className="font-semibold text-amber underline decoration-amber/50 underline-offset-4 hover:text-[#ffc247]" href={`mailto:${CONFIG.businessEmail}`}>{CONFIG.businessEmail}</a>, un correo exclusivo para propuestas de negocios. Para soporte, usa el correo de soporte o un ticket en Discord.
    </aside>
  )
}

function Field({ id, label, value, error, ok, onChange, onBlur, full, as = 'input', children, ...rest }) {
  const Tag = as
  const floated = !!value
  const base = 'peer w-full min-h-[60px] appearance-none rounded-md border bg-deep px-3.5 pt-6 pb-2 transition-[border-color,box-shadow] duration-200 focus:border-amber focus:shadow-[0_0_0_3px_rgba(255,176,32,.18)] focus:outline-none'
  const border = error ? 'border-danger' : ok ? 'border-[#2f8a5a]' : 'border-line'
  const select = as === 'select' ? "bg-[linear-gradient(45deg,transparent_50%,var(--color-steel)_50%),linear-gradient(135deg,var(--color-steel)_50%,transparent_50%)] bg-[position:calc(100%-22px)_28px,calc(100%-16px)_28px] bg-[size:6px_6px] bg-no-repeat" : ''
  return (
    <div className={`relative ${full ? 'col-span-full' : ''}`}>
      <Tag id={id} name={id} value={value} onChange={onChange} onBlur={onBlur} aria-invalid={!!error} aria-describedby={`e-${id}`} required
        className={`${base} ${border} ${select} ${as === 'textarea' ? 'min-h-[150px] resize-y' : ''}`} {...rest}>{children}</Tag>
      <label htmlFor={id}
        className={`pointer-events-none absolute top-[19px] left-[15px] origin-top-left transition-[transform,color] duration-200 ease-soft peer-focus:text-steel-light peer-focus:[transform:translateY(-12px)_scale(.78)] ${floated ? 'text-steel-light [transform:translateY(-12px)_scale(.78)]' : 'text-steel'} ${error ? '!text-[#ff8b7d]' : ''}`}>{label}</label>
      {error && <p id={`e-${id}`} className="mt-1.5 text-[.92rem] text-[#ff8b7d]">{error}</p>}
    </div>
  )
}

export default function Contact() {
  const [vals, setVals] = useState(INIT)
  const [errs, setErrs] = useState({})   // k -> mensaje | '' (válido) | undefined (sin tocar)
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const [shake, setShake] = useState(false)
  const touched = useRef({})
  const refs = useRef({})

  const check = (k, v = vals[k]) => { const m = RULES[k](v); setErrs((e) => ({ ...e, [k]: m })); return !m }
  const props = (k) => ({
    value: vals[k], error: errs[k], ok: errs[k] === '',
    ref: (el) => (refs.current[k] = el),
    onChange: (e) => {
      const v = e.target.value
      setVals((s) => ({ ...s, [k]: v })); touched.current[k] = true
      if (errs[k] || e.target.tagName === 'SELECT') check(k, v)
    },
    onBlur: () => { if (vals[k] || errs[k] || touched.current[k]) check(k) },
  })

  async function submit(e) {
    e.preventDefault()
    const bad = Object.keys(RULES).filter((k) => !check(k))
    if (bad.length) {
      refs.current[bad[0]]?.focus(); setShake(true)
      return setStatus({ msg: `Revisa ${bad.length === 1 ? '1 campo' : bad.length + ' campos'} marcados en rojo.`, cls: 'badx' })
    }
    const data = { name: vals.name.trim(), email: vals.mail.trim(), subject: vals.subj.trim(), type: vals.type, message: vals.msg.trim() }
    setSending(true)
    try {
      const r = await fetch(C.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      if (!r.ok) throw new Error(r.status)
      setStatus({ msg: 'Mensaje enviado. Te responderemos al correo que indicaste.', cls: 'good' }); setVals(INIT); setErrs({}); touched.current = {}
    } catch {
      setStatus({ msg: 'No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo; tus datos siguen en el formulario.', cls: 'badx' })
    } finally {
      setSending(false)
    }
  }

  const dt = 'font-mono text-[11px] text-steel'
  const mail = 'underline decoration-amber underline-offset-4 hover:text-amber'
  return (
    <Screen label="Contacto">
      <PageHero pos="50% 50%" crumb="Contacto" title="Contacto y soporte." />
      <div className="pt-[clamp(32px,5vw,56px)] pb-[clamp(48px,7vw,92px)]">
        <div className="pad grid grid-cols-[4fr_7fr] gap-x-[clamp(28px,5vw,72px)] gap-y-8 pt-2 pb-14 max-[1100px]:grid-cols-1">
          <div>
            <p className="mb-6 max-w-[40ch] text-steel-light">¿Tienes una consulta sobre nuestro catálogo o necesitas soporte? Escríbenos.</p>
            <SupportNote className="mb-6 max-w-[44ch]" />
            <dl className="grid gap-3.5">
              <div><dt className={dt}>Soporte</dt><dd className="text-[1.1rem]"><a className={mail} href={`mailto:${C.email}`}>{C.email}</a></dd></div>
              <div><dt className={dt}>Propuestas de negocios (exclusivo)</dt><dd className="text-[1.1rem]"><a className={mail} href={`mailto:${CONFIG.businessEmail}`}>{CONFIG.businessEmail}</a></dd></div>
              <div><dt className={dt}>Redes oficiales</dt><dd><SocialLinks className="flex-wrap" /></dd></div>
            </dl>
          </div>
          <form noValidate onSubmit={submit} aria-label="Formulario de contacto"
            className="grid grid-cols-2 gap-5 rounded-[10px] border border-line bg-panel-2 p-[clamp(18px,3vw,32px)] max-[760px]:grid-cols-1">
            <Field id="f-name" label="Nombre" autoComplete="name" {...props('name')} />
            <Field id="f-mail" label="Correo electrónico" type="email" autoComplete="email" {...props('mail')} />
            <Field id="f-subj" label="Asunto" {...props('subj')} />
            <Field id="f-type" label="Tipo de consulta" as="select" {...props('type')}>
              <option value="" disabled className="bg-panel" />
              {TYPES.map((t) => <option key={t} className="bg-panel">{t}</option>)}
            </Field>
            {vals.type === 'Soporte' && <SupportNote className="col-span-full" />}
            {vals.type === BUSINESS && <BusinessNote className="col-span-full" />}
            <Field id="f-msg" label="Mensaje" as="textarea" full {...props('msg')} />
            <div className="col-span-full flex flex-wrap items-center gap-4">
              <HeroButton type="submit" variant="primary" loading={sending} className={shake ? 'animate-shake' : ''} onAnimationEnd={() => setShake(false)}>
                {sending ? 'Enviando…' : 'Enviar mensaje'}
              </HeroButton>
              {status && <p role="status" className={`max-w-[60ch] rounded-md border bg-card px-3.5 py-2.5 text-base ${STATUS_CLS[status.cls]}`}>{status.msg}</p>}
            </div>
          </form>
        </div>
      </div>
    </Screen>
  )
}
