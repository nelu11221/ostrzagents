import { v2 } from '../../content/ru'
import { Container, SectionHead } from '../ui/primitives'

// Снимаем главные возражения перед финальным CTA — особенно страх блокировки аккаунта.
type Item = { q: string; a: string }

export function Faq({ items, title, id = 'faq' }: { items?: Item[]; title?: string; id?: string }) {
  const f = v2.faq
  const list = items ?? f.items
  return (
    <section id={id} className="border-t border-white/10 py-24 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHead label={f.label} title={title ?? f.title} dot="bg-linear-to-br from-signal to-iris" className="lg:sticky lg:top-28 lg:self-start" />
        <div className="border-t border-white/10">
          {list.map((item) => (
            <details key={item.q} className="group border-b border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg font-medium tracking-tight transition-colors hover:text-signal-hot sm:text-xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="relative size-4 shrink-0" aria-hidden>
                  <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 bg-current transition-transform group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-lg leading-relaxed text-bone">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
