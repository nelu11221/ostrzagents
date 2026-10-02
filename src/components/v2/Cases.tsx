import { useState } from 'react'
import { cases, type CaseStudy } from '../../content/ru'
import { TONE } from '../landing/theme'
import { Lightbox } from '../ui/Lightbox'
import { Container, Reveal, SectionHead, cx } from '../ui/primitives'

// Кейсы клиентов: вкладки по нишам, слева — описание и что ловит система, справа — реальные лиды.
// Лиды — реальные скрины уведомлений с размытыми именами; по клику открываются поверх страницы.
export function Cases() {
  const c = cases
  const [activeId, setActiveId] = useState(c.items[0].id)
  const active = c.items.find((item) => item.id === activeId) ?? c.items[0]

  return (
    <section id="cases" className="relative overflow-hidden border-t border-white/10 py-24 lg:py-28">
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" aria-hidden />
      <Container className="relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead label={c.label} title={c.title} sub={c.sub} dot="bg-linear-to-br from-signal to-iris" />
          {c.items.length > 1 && (
            <Reveal delay={0.1} className="shrink-0">
              <div className="flex flex-wrap gap-1 bg-white/5 p-1 ring-1 ring-inset ring-white/10" role="tablist" aria-label={c.label}>
                {c.items.map((item) => {
                  const selected = item.id === active.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveId(item.id)}
                      className={cx(
                        'h-11 px-4 text-sm font-medium whitespace-nowrap transition-colors',
                        selected ? 'bg-paper text-ink' : 'text-bone hover:text-paper',
                      )}
                    >
                      {item.niche}
                    </button>
                  )
                })}
              </div>
            </Reveal>
          )}
        </div>

        <CasePanel key={active.id} item={active} />
      </Container>
    </section>
  )
}

function CasePanel({ item }: { item: CaseStudy }) {
  const tone = TONE[item.product]
  const shots = item.shots
  const [openShot, setOpenShot] = useState<number | null>(null)
  return (
    <Reveal className="mt-12 grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
      <div>
        <p className="flex items-center gap-3">
          <span className={cx('px-2.5 py-1.5 font-mono text-[11px] text-white', tone.solid)}>{item.productName}</span>
          <span className="label text-smoke">{item.niche}</span>
        </p>
        <h3 className="mt-5 font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.03em] text-balance">{item.title}</h3>
        <p className="mt-4 leading-relaxed text-bone">{item.text}</p>
        <p className="label mt-8 text-smoke">{cases.catchesLabel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.catches.map((k) => (
            <span key={k} className={cx('px-3 py-2 font-mono text-xs ring-1 ring-inset', tone.soft, tone.hot, tone.ring)}>
              {k}
            </span>
          ))}
        </div>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {shots.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => setOpenShot(i)}
            aria-label={`${cases.shotLabel}: ${shot.alt}`}
            className="group notch relative block aspect-[9/14] w-[72%] shrink-0 cursor-zoom-in snap-start overflow-hidden bg-ink-3 ring-1 ring-inset ring-white/10 [--notch:18px] sm:w-auto"
          >
            <img src={shot.src} alt={shot.alt} loading="lazy" className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
            <span className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-ink to-transparent" aria-hidden />
          </button>
        ))}
      </div>
      <Lightbox images={shots} index={openShot} onChange={setOpenShot} />
    </Reveal>
  )
}
