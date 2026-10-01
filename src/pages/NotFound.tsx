import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PixelBg } from '../components/effects/PixelBg'
import { Button, Container, Label, Logo, TelegramIcon } from '../components/ui/primitives'
import { DEFAULT_CONTACT } from '../content/ru'

const TITLE = 'Страница не найдена — OSTRO AI'
const year = new Date().getFullYear()

export default function NotFound() {
  const { pathname } = useLocation()

  useEffect(() => {
    const previous = document.title
    document.title = TITLE
    return () => { document.title = previous }
  }, [])

  return (
    <div className="grain relative flex min-h-svh flex-col overflow-hidden">
      <div className="absolute -top-64 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-signal/25 blur-[160px]" aria-hidden />
      <PixelBg className="[mask-image:radial-gradient(ellipse_40%_45%_at_50%_45%,transparent_45%,black_100%)]" opacity={0.6} />

      <header className="relative z-10">
        <Container className="flex h-16 items-center justify-between lg:h-[72px]">
          <a href="/" aria-label="OSTRO AI — на главную">
            <Logo />
          </a>
          <a
            href={`https://t.me/${DEFAULT_CONTACT}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Написать в Telegram"
            className="grid size-10 place-items-center text-bone transition-colors hover:text-paper"
          >
            <TelegramIcon />
          </a>
        </Container>
      </header>

      {/* pointer-events пропускаются к пиксельному фону (ripple по клику), кроме кнопок и ссылок */}
      <main className="pointer-events-none relative z-10 flex flex-1 items-center py-10 [&_a]:pointer-events-auto">
        <Container className="text-center">
          <Label className="animate-rise justify-center">Ошибка 404</Label>

          <h1 className="mt-6 font-display leading-none font-bold tracking-[-0.06em]">
            <span style={{ animationDelay: '0.08s' }} className="animate-rise inline-flex items-center gap-[0.08em] text-[clamp(6rem,24vw,15rem)]">
              4
              <span className="notch inline-block -rotate-3 bg-signal-btn px-[0.08em] text-white shadow-[0_30px_80px_-10px_rgba(51,116,255,.7)] [--notch:0.18em]">
                0
              </span>
              4
            </span>
          </h1>

          <p style={{ animationDelay: '0.16s' }} className="animate-rise mt-6 font-display text-[clamp(1.5rem,3.4vw,2.4rem)] leading-tight font-semibold tracking-[-0.03em] text-balance">
            Такой страницы нет
          </p>
          <p style={{ animationDelay: '0.22s' }} className="animate-rise mx-auto mt-4 max-w-md text-lg leading-relaxed text-bone">
            Возможно, ссылка устарела или в адресе опечатка. Вернитесь на главную — там всё на месте.
          </p>

          {/* Запрос «пользователя» в стиле живой ленты: AI честно отфильтровал его как не-лид */}
          <div
            style={{ animationDelay: '0.3s' }}
            className="animate-rise notch mx-auto mt-10 flex max-w-md items-center gap-3 bg-ink-2 px-4 py-3 text-left ring-1 ring-inset ring-white/10 [--notch:14px]"
            aria-hidden
          >
            <span className="grid size-8 shrink-0 place-items-center bg-signal-deep font-display text-xs font-semibold">Вы</span>
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-bone">{pathname}</span>
            <span className="shrink-0 px-2 py-1.5 font-mono text-[11px] leading-none whitespace-nowrap text-bone ring-1 ring-inset ring-white/20">
              AI: не найдено
            </span>
          </div>

          <div style={{ animationDelay: '0.38s' }} className="animate-rise mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg">
              На главную
            </Button>
            <Button href="/#plans" variant="ghost" size="lg">
              Посмотреть тарифы
            </Button>
          </div>
        </Container>
      </main>

      <footer className="relative z-10 border-t border-white/10">
        <Container className="flex flex-col justify-between gap-2 py-6 font-mono text-xs text-smoke sm:flex-row">
          <span>© {year} OSTRO AI</span>
          <span>Лидоген + AI-сейлз</span>
        </Container>
      </footer>
    </div>
  )
}
