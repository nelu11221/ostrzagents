import { ru } from '../../content/ru'
import { Container, LogoMark, Reveal, SectionHead, cx } from '../ui/primitives'

// Косая бегущая строка-разделитель. reverse — наклон и движение в обратную сторону (для второй ленты на странице).
export function Ticker({ items: source = ru.ticker, reverse = false }: { items?: string[]; reverse?: boolean }) {
  const items = [...source, ...source]
  return (
    <div
      className={cx(
        // без внешних отступов на мобильном — иначе под наклонной лентой видна тёмная полоса фона
        'relative z-10 overflow-hidden border-y border-ink py-3 text-white max-sm:border-y-0',
        reverse ? 'rotate-1 bg-linear-to-r from-iris-btn to-signal-btn' : '-rotate-1 bg-linear-to-r from-signal-btn to-iris-btn',
      )}
      aria-hidden
    >
      <div className={cx('flex w-max animate-marquee gap-8 whitespace-nowrap', reverse && '[animation-direction:reverse]')}>
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-sm font-semibold tracking-tight uppercase sm:text-base">
            {t}
            <LogoMark mono className="size-4" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function HowItWorks() {
  const h = ru.how
  return (
    <section id="how" className="bg-paper py-24 text-ink lg:py-32">
      <Container>
        <SectionHead label={h.label} title={h.title} tone="light" />
        <ol className="mt-14 grid gap-10 md:grid-cols-3 lg:gap-6">
          {h.steps.map((s, i) => (
            <li key={s.n} className="relative border-t-2 border-ink pt-6">
              <span className="absolute -top-[5px] left-0 size-2 bg-signal" aria-hidden />
              <Reveal delay={i * 0.08}>
                <span className="font-display text-5xl font-bold tracking-[-0.05em] text-ink/15">{s.n}</span>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-ink/65">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
