import { ru } from '../../content/ru'
import { Container, LogoMark, Reveal, SectionHead } from '../ui/primitives'

export function Ticker() {
  const items = [...ru.ticker, ...ru.ticker]
  return (
    <div className="-rotate-1 overflow-hidden border-y border-ink bg-linear-to-r from-signal-btn to-iris-btn py-3 text-white" aria-hidden>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
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
