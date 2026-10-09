import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { lead as l } from '../../content/ru'
import { readUtm, submitLead } from '../../lib/lead'
import { PixelBg } from '../effects/PixelBg'
import { Arrow, Container, Label, Reveal, TelegramIcon, cx } from '../ui/primitives'

type Errors = Partial<Record<'name' | 'contact' | 'consent' | 'server', string>>

// С какой кнопки человек пришёл к форме: ссылка t.me/… этой кнопки (её готовое сообщение уходит в заявку
// и подставляется в «Написать в Telegram» после отправки).
let intentHref: string | null = null
const listeners = new Set<() => void>()
function setIntent(href: string | null) {
  intentHref = href
  listeners.forEach((fn) => fn())
}
function useIntent() {
  return useSyncExternalStore(
    (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    () => intentHref,
  )
}

// Любая кнопка, ведущая в Telegram (https://t.me/…), ведёт к форме заявки внизу страницы: у части людей Telegram
// не открывается, а контакт мы получим в любом случае. Ссылка с data-direct уходит в Telegram напрямую.
export function LeadGate() {
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a[href^="https://t.me/"]')
      if (!link || link.hasAttribute('data-direct') || link.closest('#lead')) return
      e.preventDefault()
      setIntent(link.getAttribute('href'))
      const section = document.getElementById('lead')
      if (!section) {
        navigate('/#lead')
        return
      }
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // фокус без прокрутки — иначе браузер дёрнет страницу раньше плавного скролла
      window.setTimeout(() => document.getElementById('lead-name')?.focus({ preventScroll: true }), 600)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  return null
}

// Последний блок страницы: заявка (как на сайте агентства). fallbackHref — Telegram, если человек дошёл до формы сам.
export function LeadSection({ fallbackHref }: { fallbackHref: string }) {
  const tgHref = useIntent() ?? fallbackHref
  return (
    <section id="lead" className="grain relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-ink-2 py-14 sm:py-24 lg:py-32">
      <PixelBg className="[mask-image:radial-gradient(ellipse_32%_45%_at_24%_52%,transparent_40%,black_100%)]" opacity={0.4} density={0.9} />
      <Container className="relative z-10 grid gap-8 sm:gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <Reveal>
          <Label>{l.label}</Label>
          <h2 className="mt-4 font-display text-[clamp(1.7rem,4.6vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:mt-5">
            {l.title}
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-bone sm:mt-5 sm:text-lg">{l.sub}</p>
          <ul className="mt-6 space-y-3 sm:mt-10 sm:space-y-4">
            {l.gets.map((g, i) => (
              <li key={g} className="flex items-center gap-3 sm:gap-4">
                <span className="grid size-8 shrink-0 place-items-center bg-signal-btn font-mono text-xs text-white sm:size-9">0{i + 1}</span>
                <span className="sm:text-lg">{g}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <LeadForm tgHref={tgHref} />
        </Reveal>
      </Container>
    </section>
  )
}

// Текст готового сообщения из ссылки t.me/…?text= — по нему видно, с какой кнопки пришла заявка
function intentOf(href: string) {
  try {
    return new URL(href).searchParams.get('text') ?? ''
  } catch {
    return ''
  }
}

function LeadForm({ tgHref }: { tgHref: string }) {
  const f = l.form
  const [method, setMethod] = useState(f.methods[0].id)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const current = f.methods.find((m) => m.id === method) ?? f.methods[0]
  const isPhone = f.phoneMethods.includes(method)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const contact = String(data.get('contact') ?? '').trim()
    const niche = String(data.get('niche') ?? '').trim()
    const company = String(data.get('company') ?? '')
    const next: Errors = {}
    if (!name) next.name = f.errors.name
    if (contact.length < 3) next.contact = f.errors.contact
    if (!data.get('consent')) next.consent = f.errors.consent
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      await submitLead({ name, method, contact, niche, intent: intentOf(tgHref), page: window.location.href, utm: readUtm(), company })
      setStatus('done')
    } catch {
      setErrors({ server: f.errors.server })
      setStatus('idle')
    }
  }

  return (
    <div className="notch bg-paper p-5 text-ink [--notch:28px] sm:p-10 sm:[--notch:32px]">
      {status === 'done' ? (
        <div className="py-8 text-center sm:py-10" role="status">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-signal-btn text-white">
            <svg viewBox="0 0 20 20" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="m4 10.5 4 4 8-9" />
            </svg>
          </div>
          <h3 className="mt-6 font-display text-2xl font-semibold">{l.success.title}</h3>
          <p className="mx-auto mt-3 max-w-sm text-ink/65">{l.success.text}</p>
          <a
            href={tgHref}
            data-direct
            target="_blank"
            rel="noreferrer"
            className="notch mt-8 inline-flex h-12 items-center gap-2 bg-ink px-6 font-display text-sm font-semibold text-paper [--notch:12px]"
          >
            <TelegramIcon className="size-4" /> {l.success.cta}
          </a>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <Field id="lead-name" label={f.name} error={errors.name}>
            <input
              id="lead-name"
              name="name"
              autoComplete="given-name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'lead-name-err' : undefined}
              className={inputCls(!!errors.name)}
            />
          </Field>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">{f.method}</legend>
            <div className="grid grid-cols-3 gap-1 bg-ink/5 p-1">
              {f.methods.map((m) => (
                <label
                  key={m.id}
                  className={cx(
                    'flex h-11 cursor-pointer items-center justify-center text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal',
                    method === m.id ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink',
                  )}
                >
                  <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                  {m.label}
                </label>
              ))}
            </div>
          </fieldset>

          <Field id="lead-contact" label={current.label} error={errors.contact}>
            <input
              id="lead-contact"
              name="contact"
              type={isPhone ? 'tel' : 'text'}
              inputMode={isPhone ? 'tel' : 'text'}
              autoComplete={isPhone ? 'tel' : 'off'}
              placeholder={current.placeholder}
              aria-invalid={!!errors.contact}
              aria-describedby={errors.contact ? 'lead-contact-err' : undefined}
              className={inputCls(!!errors.contact)}
            />
          </Field>

          <Field id="lead-niche" label={f.niche} optional={f.optional}>
            <input id="lead-niche" name="niche" placeholder={f.nichePlaceholder} className={inputCls(false)} />
          </Field>

          {/* ловушка для ботов: поле скрыто от людей, заполненные заявки сервер отбрасывает */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="lead-company">Company</label>
            <input id="lead-company" name="company" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label className="flex cursor-pointer gap-3 text-sm leading-snug text-ink/70">
              <input type="checkbox" name="consent" aria-invalid={!!errors.consent} className="mt-0.5 size-5 shrink-0 accent-signal-deep" />
              <span>
                {f.consentA}
                <a href={f.privacyHref} target="_blank" rel="noreferrer" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
                  {f.consentLink}
                </a>
              </span>
            </label>
            {errors.consent && <p className="mt-2 text-sm text-danger">{errors.consent}</p>}
          </div>

          {errors.server && (
            <p role="alert" className="bg-danger/10 p-3 text-sm text-danger">
              {errors.server}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="notch group flex h-14 w-full items-center justify-center gap-3 bg-signal-btn font-display text-base font-semibold text-white transition-colors [--notch:16px] hover:bg-signal disabled:opacity-60 sm:h-16"
          >
            {status === 'sending' ? f.sending : f.submit}
            <Arrow className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      )}
    </div>
  )
}

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex justify-between text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-ink/40">{optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls = (invalid: boolean) =>
  cx(
    'h-12 w-full border-b-2 bg-ink/[0.04] px-4 text-base text-ink transition-colors outline-none placeholder:text-ink/35 focus:bg-white sm:h-14',
    invalid ? 'border-danger' : 'border-ink/20 focus:border-ink',
  )
