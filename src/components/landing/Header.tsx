import { useEffect, useState } from 'react'
import { ru } from '../../content/ru'
import { Button, Container, Logo, TelegramIcon, cx } from '../ui/primitives'
import { SmartLink } from '../ui/SmartLink'

type NavItem = { href: string; label: string }

export function Header({
  contactUrl,
  ctaHref = contactUrl,
  ctaLabel = ru.headerCta,
  nav = ru.nav,
}: {
  contactUrl: string
  ctaHref?: string
  ctaLabel?: string
  nav?: NavItem[]
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300',
        scrolled || open ? 'border-b border-white/10 bg-ink/85 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <SmartLink href="/#top" onClick={() => setOpen(false)} aria-label="OSTRO AI — наверх">
          <Logo />
        </SmartLink>

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href} className="text-sm text-bone transition-colors hover:text-paper">
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={contactUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Написать в Telegram"
            className="hidden size-10 place-items-center text-bone transition-colors hover:text-paper sm:grid"
          >
            <TelegramIcon />
          </a>
          <div className="hidden sm:block">
            <Button href={ctaHref} target="_blank" rel="noreferrer">
              {ctaLabel}
            </Button>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6">
              <span className={cx('absolute left-0 h-0.5 w-6 bg-paper transition-transform', open ? 'top-1.5 rotate-45' : 'top-0')} />
              <span className={cx('absolute left-0 h-0.5 w-6 bg-paper transition-transform', open ? 'top-1.5 -rotate-45' : 'top-3')} />
            </span>
          </button>
        </div>
      </Container>

      <div id="mobile-menu" hidden={!open} className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-ink lg:hidden">
        <Container className="flex h-full flex-col py-8">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <SmartLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-semibold"
                >
                  {item.label}
                  <span className="font-mono text-xs text-smoke">→</span>
                </SmartLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <Button href={ctaHref} target="_blank" rel="noreferrer" size="lg" className="w-full" onClick={() => setOpen(false)}>
              {ctaLabel}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  )
}
