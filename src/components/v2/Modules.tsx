import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ru, v2 } from '../../content/ru'
import type { Plan } from '../../lib/api'
import { LeadgenDemo, SalesDemo } from '../landing/Demos'
import { TONE } from '../landing/theme'
import { Button, Container, Label, cx } from '../ui/primitives'

export type ModuleTab = 'leadgen' | 'sales'

type Props = {
  tab: ModuleTab
  onTab: (tab: ModuleTab) => void
  plans: Plan[]
  trialHref: (tab: ModuleTab) => string
}

const CONTENT = { leadgen: ru.leadgen, sales: ru.sales }
const DEMO = { leadgen: <LeadgenDemo compact />, sales: <SalesDemo compact /> }

// Оба модуля в одной секции на один экран: заголовок и вкладки в одну строку,
// шаги — горизонтально, демо — компактное. Высота панели фиксирована, чтобы страница не прыгала при переключении.
export function Modules({ tab, onTab, plans, trialHref }: Props) {
  const m = v2.modules
  const reduce = useReducedMotion()
  const t = TONE[tab]
  const content = CONTENT[tab]
  const price = plans.find((p) => p.id === tab)?.price

  return (
    <section id="modules" className="relative flex scroll-mt-16 flex-col justify-center overflow-hidden border-t border-white/10 py-16 lg:min-h-[calc(100svh-72px)] lg:py-14">
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" aria-hidden />
      <div className={cx('absolute -top-40 -right-40 size-[600px] rounded-full blur-[150px] transition-colors duration-700', t.glow)} aria-hidden />

      <Container className="relative">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <Label dot="bg-linear-to-br from-signal to-iris">{m.label}</Label>
            <h2 className="mt-4 font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.03em]">{m.title}</h2>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-1 bg-white/5 p-1 ring-1 ring-inset ring-white/10" role="tablist" aria-label={m.label}>
            {(['leadgen', 'sales'] as const).map((id) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={active}
                  aria-controls="module-panel"
                  onClick={() => onTab(id)}
                  className={cx(
                    'flex h-11 items-center justify-center gap-2.5 px-6 font-display text-sm font-semibold transition-colors',
                    active ? cx(TONE[id].solid, 'text-white') : 'text-bone hover:text-paper',
                  )}
                >
                  <span className={cx('size-1.5', active ? 'bg-white' : TONE[id].dot)} aria-hidden />
                  {m.tabs[id]}
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            id="module-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-8 grid items-center gap-10 lg:min-h-[480px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
          >
            <div className="min-w-0">
              <p className={cx('label', t.hot)}>{content.label}</p>
              <h3 className="mt-3 font-display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight font-semibold tracking-[-0.03em] text-balance">
                {content.title}
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-bone">{content.sub}</p>

              <ol className="mt-7 grid gap-px bg-white/10 ring-1 ring-white/10 sm:grid-cols-3">
                {content.steps.map((step, i) => (
                  <li key={step.title} className="bg-ink p-4">
                    <span className={cx('grid size-7 place-items-center font-mono text-[11px] text-white', t.solid)}>0{i + 1}</span>
                    <p className="mt-3 font-display text-sm font-semibold tracking-tight">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-smoke">{step.text}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button href={trialHref(tab)} target="_blank" rel="noreferrer" variant={t.button}>
                  {m.trialCta}
                </Button>
                {price !== undefined && <span className="font-mono text-xs text-smoke">{m.priceFrom(price)}</span>}
              </div>
            </div>
            <div className="min-w-0">{DEMO[tab]}</div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  )
}
