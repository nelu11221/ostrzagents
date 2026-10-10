import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { lead as l } from '../../content/ru'
import { readUtm, submitLead } from '../../lib/lead'
import { Arrow, TelegramIcon, cx } from '../ui/primitives'

type Errors = Partial<Record<'contact' | 'consent' | 'server', string>>

// Любая кнопка, ведущая в Telegram (https://t.me/…), сначала открывает форму заявки во всплывающем окне: у части
// людей Telegram не открывается, а контакт мы получим в любом случае. Ссылка с data-direct уходит в Telegram напрямую.
export function LeadGate() {
  const [href, setHref] = useState<string | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a[href^="https://t.me/"]')
      if (!link || link.hasAttribute('data-direct')) return
      e.preventDefault()
      setHref(link.getAttribute('href'))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return href ? <LeadModal tgHref={href} onClose={() => setHref(null)} /> : null
}

function LeadModal({ tgHref, onClose }: { tgHref: string; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    dialog.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={l.title}
      tabIndex={-1}
      className="animate-rise fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-ink/85 backdrop-blur-sm outline-none [animation-duration:.25s]"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label={l.close}
            onClick={onClose}
            className="absolute -top-12 right-0 grid size-10 place-items-center bg-white/10 text-paper ring-1 ring-white/20 transition-colors ring-inset hover:bg-white/20"
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
          <LeadForm tgHref={tgHref} />
        </div>
      </div>
    </div>,
    document.body,
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
    const contact = String(data.get('contact') ?? '').trim()
    const niche = String(data.get('niche') ?? '').trim()
    const company = String(data.get('company') ?? '')
    const next: Errors = {}
    if (contact.length < 3) next.contact = f.errors.contact
    if (!data.get('consent')) next.consent = f.errors.consent
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      await submitLead({ name: '', method, contact, niche, intent: intentOf(tgHref), page: window.location.href, utm: readUtm(), company })
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
