import { ru } from '../../content/ru'
import { PixelBg } from '../effects/PixelBg'
import { Button, Container } from '../ui/primitives'
import { LiveFeed } from './LiveFeed'

export function Hero({ contactUrl }: { contactUrl: string }) {
  const h = ru.hero

  // Текст первого экрана анимируется через CSS (animate-rise), а не JS — не ждёт бандла, важно для LCP
  return (
    <section id="top" className="grain relative overflow-hidden pt-28 pb-20 sm:pt-36 lg:pb-28">
      <div className="absolute -top-64 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-signal/30 blur-[160px]" aria-hidden />
      <PixelBg className="[mask-image:radial-gradient(ellipse_45%_50%_at_30%_45%,transparent_40%,black_100%)]" opacity={0.7} />

      {/* pointer-events пропускаются к пиксельному фону (ripple по клику), кроме кнопок и ссылок */}
      <Container className="pointer-events-none relative z-10 grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 [&_a]:pointer-events-auto">
        <div>
          <p
            style={{ animationDelay: '0s' }}
            className="animate-rise inline-flex flex-wrap items-center gap-x-3 gap-y-1 border border-white/15 bg-ink/85 px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase backdrop-blur-sm"
          >
            <a href="#leadgen" className="flex items-center gap-2 text-paper hover:text-signal-hot">
              <span className="size-1.5 animate-rec bg-signal-hot" aria-hidden />
              Лидоген
            </a>
            <span className="text-smoke" aria-hidden>+</span>
            <a href="#sales" className="flex items-center gap-2 text-paper hover:text-iris-hot">
              <span className="size-1.5 animate-rec bg-iris-hot [animation-delay:.7s]" aria-hidden />
              AI-сейлз
            </a>
            <span className="text-smoke" aria-hidden>/</span>
            <span className="text-bone">Telegram 24/7</span>
          </p>

          <h1 className="mt-7 font-display text-[clamp(2.2rem,6.4vw,4.2rem)] lg:text-[clamp(2.2rem,3.6vw,3.3rem)] leading-[1.04] font-bold tracking-[-0.045em]">
            <span style={{ animationDelay: '0.08s' }} className="animate-rise block">
              {h.titleA}
            </span>
            <span style={{ animationDelay: '0.16s' }} className="animate-rise block">
              {h.titleB}{' '}
              <span className="notch relative mt-2 inline-block -rotate-2 bg-signal-btn px-[0.22em] pb-[0.06em] text-white shadow-[0_20px_60px_-10px_rgba(51,116,255,.7)] [--notch:0.28em]">
                {h.titleHot}
              </span>
            </span>
          </h1>

          <p style={{ animationDelay: '0.26s' }} className="animate-rise mt-7 max-w-xl text-lg leading-relaxed text-bone">
            <span className="text-paper">{h.lead}</span> {h.sub}
          </p>

          <div style={{ animationDelay: '0.36s' }} className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={contactUrl} target="_blank" rel="noreferrer" size="lg">
              {h.cta}
            </Button>
            <Button href="#together" variant="ghost" size="lg">
              {h.secondary}
            </Button>
          </div>
          <p style={{ animationDelay: '0.42s' }} className="animate-rise label mt-5 text-smoke">
            {h.ctaNote}
          </p>
        </div>

        <div style={{ animationDelay: '0.5s' }} className="animate-rise relative min-w-0">
          <div className="absolute inset-x-6 inset-y-10 bg-linear-to-b from-signal/25 to-iris/30 blur-3xl" aria-hidden />
          <LiveFeed />
        </div>
      </Container>
    </section>
  )
}
