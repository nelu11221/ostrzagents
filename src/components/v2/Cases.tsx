import { v2 } from '../../content/ru'
import { Container, Reveal, SectionHead } from '../ui/primitives'

// Светлая секция «Кому подходит»: посетитель узнаёт свою нишу и видит, какие сообщения система поймает.
export function Cases() {
  const c = v2.cases
  return (
    <section id="cases" className="bg-paper py-24 text-ink lg:py-32">
      <Container>
        <SectionHead label={c.label} title={c.title} tone="light" />
        <Reveal className="mt-14 grid gap-px bg-ink/15 ring-1 ring-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((item, i) => (
            <div key={item.title} className="flex flex-col bg-paper p-6 transition-colors hover:bg-white lg:min-h-[280px]">
              <span className="font-display text-4xl font-bold tracking-[-0.05em] text-ink/15">0{i + 1}</span>
              <h3 className="mt-6 font-display text-lg font-semibold tracking-tight lg:mt-auto">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.text}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {item.keywords.map((k) => (
                  <span key={k} className="bg-signal-deep/10 px-2 py-1 font-mono text-[11px] text-signal-deep">
                    «{k}»
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
