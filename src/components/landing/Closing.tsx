import { useEffect, useState } from 'react'
import { ru } from '../../content/ru'
import { Button, Container, Logo, Reveal, TelegramIcon, cx } from '../ui/primitives'
import { SmartLink } from '../ui/SmartLink'

const year = new Date().getFullYear()

export function Closing({ contactUrl }: { contactUrl: string }) {
  const c = ru.closing
  return (
    <section id="lead" className="border-t border-white/10 bg-ink-2 py-24 lg:py-32">
      <Container>
        <Reveal className="notch relative grid gap-10 overflow-hidden bg-linear-to-br from-signal-btn to-iris-btn p-6 text-white [--notch:36px] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">
          <div
            className="pointer-events-none absolute -top-40 -right-40 size-[520px] opacity-40 [background:repeating-radial-gradient(circle,transparent_0_54px,rgb(255_255_255/.18)_54px_55px)] [mask-image:radial-gradient(closest-side,black_20%,transparent)]"
            aria-hidden
          />
          <div className="relative">
            <p className="label flex items-center gap-2 text-white/70">
              <span className="inline-block size-1.5 bg-white" aria-hidden />
              {c.label}
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.7rem,3.8vw,3rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
              {c.title}
            </h2>
          </div>
          <Button href={contactUrl} target="_blank" rel="noreferrer" variant="paper" size="lg" className="relative">
            <TelegramIcon className="size-5" /> {c.cta}
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}

export function Footer({ contact, nav = ru.nav }: { contact: string; nav?: { href: string; label: string }[] }) {
  const f = ru.footer
  return (
    <footer className="border-t border-white/10 pt-16 pb-28 sm:pb-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-2xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-smoke">{f.tagline}</p>
          </div>

          <FooterCol title={f.navTitle}>
            {nav.map((n) => (
              <SmartLink key={n.href} href={n.href} className="hover:text-paper">
                {n.label}
              </SmartLink>
            ))}
          </FooterCol>

          <FooterCol title={f.contactsTitle}>
            <a href={`https://t.me/${contact}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-paper">
              <TelegramIcon className="size-4" /> @{contact}
            </a>
          </FooterCol>

          <FooterCol title={f.moreTitle}>
            <a href={f.agencyHref} target="_blank" rel="noreferrer" className="hover:text-paper">
              {f.agency} →
            </a>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 font-mono text-xs text-smoke sm:flex-row">
          <span>© {year} OSTRO AI</span>
          <span>{f.bottom}</span>
        </div>
      </Container>

      <svg viewBox="0 0 1000 190" className="pointer-events-none mt-10 w-full select-none" aria-hidden>
        <text x="500" y="170" textAnchor="middle" className="fill-white/[0.04] font-display text-[240px] font-bold tracking-[-0.07em]">
          OSTRO
        </text>
      </svg>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label text-smoke">{title}</p>
      <div className="mt-5 flex flex-col gap-3 text-sm text-bone">{children}</div>
    </div>
  )
}

// Липкая кнопка на мобильных: появляется после первого экрана и прячется у финального CTA.
export function MobileCta({ contactUrl, label = ru.mobileCta }: { contactUrl: string; label?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const lead = document.getElementById('lead')
    let pastHero = false
    let atLead = false
    const update = () => setVisible(pastHero && !atLead)
    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8
      update()
    }
    const io = new IntersectionObserver(([entry]) => {
      atLead = entry.isIntersecting
      update()
    })
    if (lead) io.observe(lead)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      className={cx(
        'fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/10 bg-ink/90 p-3 backdrop-blur-md transition-transform duration-300 sm:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      aria-hidden={!visible}
    >
      <Button href={contactUrl} target="_blank" rel="noreferrer" className="flex-1" tabIndex={visible ? 0 : -1}>
        {label}
      </Button>
    </div>
  )
}
