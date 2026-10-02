import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { cases, type CaseStudy } from '../../content/ru'
import { TONE } from '../landing/theme'
import { Lightbox } from '../ui/Lightbox'
import { Button, Container, SectionHead, cx } from '../ui/primitives'
import { WatchButton } from '../ui/VideoModal'

type ProductId = 'leadgen' | 'sales'

type Props = {
  ctaHref: (caseName: string) => string
  trialHref: (product: ProductId) => string
}

// Кейсы: сначала выбираешь модуль (Лидоген / AI-сейлз), затем проект внутри него.
// Карточка как на сайте агентства: главная цифра, задача, результат и скрины лидов.
export function Cases({ ctaHref, trialHref }: Props) {
  const c = cases
  const reduce = useReducedMotion()
  const [product, setProduct] = useState<ProductId>('leadgen')
  const [activeByProduct, setActiveByProduct] = useState<Record<ProductId, number>>({ leadgen: 0, sales: 0 })

  const list = c.items.filter((item) => item.product === product)
  const active = list[activeByProduct[product]] ?? list[0]

  return (
    <section id="cases" className="relative overflow-hidden border-t border-white/10 bg-ink-2 py-24 lg:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead label={c.label} title={c.title} sub={c.sub} dot="bg-linear-to-br from-signal to-iris" />
          {/* Уровень 1: модуль */}
          <div className="grid shrink-0 grid-cols-2 gap-1 bg-white/5 p-1 ring-1 ring-inset ring-white/10" role="tablist" aria-label="Модуль">
            {(['leadgen', 'sales'] as const).map((id) => {
              const selected = id === product
              const count = c.items.filter((item) => item.product === id).length
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setProduct(id)}
                  className={cx(
                    'flex h-12 items-center justify-center gap-2.5 px-6 font-display text-sm font-semibold transition-colors',
                    selected ? cx(TONE[id].solid, 'text-white') : 'text-bone hover:text-paper',
                  )}
                >
                  <span className={cx('size-1.5', selected ? 'bg-white' : TONE[id].dot)} aria-hidden />
                  {c.productTabs[id]}
                  <span className={cx('font-mono text-[11px] font-normal', selected ? 'text-white/70' : 'text-smoke')}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Уровень 2: проекты внутри модуля */}
        {list.length > 1 && (
          <div role="tablist" aria-label="Проекты" className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {list.map((item, i) => {
              const selected = item.id === active?.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveByProduct((prev) => ({ ...prev, [product]: i }))}
                  className={cx(
                    'flex shrink-0 items-baseline gap-2 px-3.5 py-3 text-left transition-colors',
                    selected ? cx(TONE[product].solid, 'text-white') : 'bg-white/5 text-bone hover:bg-white/10 hover:text-paper',
                  )}
                >
                  <span className="font-mono text-[11px]">0{i + 1}</span>
                  <span className="font-display text-sm font-semibold whitespace-nowrap">{item.name}</span>
                </button>
              )
            })}
          </div>
        )}

        <div className={list.length > 1 ? 'mt-6' : 'mt-10'}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active ? active.id : `empty-${product}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {active ? (
                <CaseCard item={active} ctaHref={ctaHref(active.name)} />
              ) : (
                <EmptyCases product={product} trialHref={trialHref(product)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}

function CaseCard({ item, ctaHref }: { item: CaseStudy; ctaHref: string }) {
  const c = cases
  const tone = TONE[item.product]
  const [openShot, setOpenShot] = useState<number | null>(null)
  // Черновые цифры показываем только при разработке — на сайт попадают лишь подтверждённые
  const showStats = !item.draftStats || import.meta.env.DEV
  const headline = showStats ? item.headline : undefined
  const metrics = showStats ? item.metrics : undefined

  return (
    <article className="notch grid overflow-hidden bg-ink [--notch:32px] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col p-6 sm:p-10 lg:p-12">
        <p className="label text-smoke">{item.tag}</p>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{item.name}</h3>

        {item.draftStats && showStats && (
          <p className="mt-4 inline-flex w-fit items-center gap-2 bg-danger/15 px-2.5 py-1 font-mono text-[11px] text-danger ring-1 ring-danger/40 ring-inset">
            черновик · цифры не подтверждены, на сайте не показываются
          </p>
        )}

        {headline && (
          <div className={cx('mt-8 border-l-2 pl-5', item.product === 'sales' ? 'border-iris' : 'border-signal')}>
            <p className={cx('font-display text-[clamp(3rem,7vw,5rem)] leading-none font-bold tracking-[-0.05em]', tone.text)}>
              {headline.value}
            </p>
            <p className="mt-2 text-bone">{headline.label}</p>
          </div>
        )}

        {metrics && (
          <dl className="mt-8 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="bg-ink p-4">
                <dd className="font-display text-xl font-bold whitespace-nowrap tracking-tight">{m.value}</dd>
                <dt className="mt-1 text-xs leading-snug text-smoke">{m.label}</dt>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="label text-smoke">{c.goalLabel}</p>
            <p className="mt-3 leading-relaxed text-bone">{item.goal}</p>
          </div>
          <div>
            <p className="label text-smoke">{c.resultLabel}</p>
            <ul className="mt-3 space-y-2">
              {item.results.map((r) => (
                <li key={r} className="flex gap-3 leading-snug">
                  <span className={cx('mt-2 size-1.5 shrink-0', tone.dot)} aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row sm:items-center">
          <Button href={ctaHref} target="_blank" rel="noreferrer" variant={tone.button}>
            {c.cta}
          </Button>
          <WatchButton product={item.product} />
        </div>
      </div>

      {/* Скрины лидов веером; клик — просмотр поверх страницы */}
      <div className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden px-6 py-12 sm:min-h-[560px]">
        <div
          className={cx(
            'absolute inset-0',
            item.product === 'sales'
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,.28),transparent_65%)]'
              : 'bg-[radial-gradient(ellipse_at_center,rgba(51,116,255,.28),transparent_65%)]',
          )}
          aria-hidden
        />
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
        <p className="label relative mb-6 text-smoke">{c.shotsLabel}</p>
        <div className="relative flex items-center justify-center">
          {item.shots.map((shot, i) => {
            const offset = i - (item.shots.length - 1) / 2
            return (
              <button
                key={shot.src}
                type="button"
                onClick={() => setOpenShot(i)}
                aria-label={`${c.shotLabel}: ${shot.alt}`}
                style={{ transform: `rotate(${offset * 6}deg) translateY(${Math.abs(offset) * 18}px)`, zIndex: offset === 0 ? 2 : 1 }}
                className="relative -mx-6 w-[36vw] max-w-[190px] shrink-0 cursor-zoom-in overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/15 transition-[translate] duration-300 hover:z-10 hover:-translate-y-3 sm:-mx-8 sm:w-[190px]"
              >
                <img src={shot.src} alt={shot.alt} loading="lazy" className="aspect-[9/15] w-full object-cover object-top" />
              </button>
            )
          })}
        </div>
      </div>
      <Lightbox images={item.shots} index={openShot} onChange={setOpenShot} />
    </article>
  )
}

function EmptyCases({ product, trialHref }: { product: ProductId; trialHref: string }) {
  const e = cases.empty
  const tone = TONE[product]
  return (
    <div className="notch relative grid gap-8 overflow-hidden bg-ink p-6 [--notch:32px] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(168,85,247,.22),transparent_60%)]" aria-hidden />
      <div className="relative">
        <p className={cx('label', tone.hot)}>{cases.productTabs[product]}</p>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{e.title}</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-bone">{e.text}</p>
      </div>
      <div className="relative flex flex-col gap-3 sm:flex-row lg:flex-col">
        <WatchButton product={product} />
        <Button href={trialHref} target="_blank" rel="noreferrer" variant={tone.button}>
          {e.trialCta}
        </Button>
      </div>
    </div>
  )
}
