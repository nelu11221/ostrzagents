import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { pricing, products, ru, v2 } from '../../content/ru'
import { TONE } from '../landing/theme'
import { Arrow, Button, Check, Container, Label, cx } from '../ui/primitives'
import { SmartLink } from '../ui/SmartLink'
import { VideoCard } from '../ui/VideoCard'

export type ModuleTab = 'leadgen' | 'sales'

type Props = {
  tab: ModuleTab
  onTab: (tab: ModuleTab) => void
  trialHref: (tab: ModuleTab) => string
}

const CONTENT = { leadgen: ru.leadgen, sales: ru.sales }

// Оба модуля в одной секции на один экран: заголовок и вкладки в одну строку,
// слева — пара фраз о модуле и ссылка на его страницу, справа — видео, где Антон рассказывает о продукте.
// Высота панели фиксирована, чтобы страница не прыгала при переключении.
export function Modules({ tab, onTab, trialHref }: Props) {
  const m = v2.modules
  const reduce = useReducedMotion()
  const t = TONE[tab]
  const content = CONTENT[tab]
  const product = products[tab]
  const price = pricing.plans.find((p) => p.id === tab)?.month

  return (
    <section id="modules" className="relative flex scroll-mt-16 flex-col justify-center overflow-hidden border-t border-white/10 py-8 sm:py-16 lg:min-h-[calc(100svh-72px)] lg:py-14">
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" aria-hidden />
      <div className={cx('absolute -top-40 -right-40 size-[600px] rounded-full blur-[150px] transition-colors duration-700', t.glow)} aria-hidden />

      <Container className="relative">
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:gap-6 sm:pb-8 md:flex-row md:items-end">
          <div>
            <Label dot="bg-linear-to-br from-signal to-iris">{m.label}</Label>
            <h2 className="mt-3 font-display text-[clamp(1.5rem,3.2vw,2.6rem)] max-sm:hidden sm:mt-4 leading-[1.05] font-semibold tracking-[-0.03em]">{m.title}</h2>
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
                    'flex h-11 items-center justify-center gap-2.5 px-4 font-display text-sm font-semibold transition-colors sm:px-6',
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
            className="mt-4 grid items-center gap-4 sm:mt-8 sm:gap-10 lg:min-h-[480px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
          >
            <div className="order-2 min-w-0 lg:order-none">
              <p className={cx('label max-sm:hidden', t.hot)}>{content.label}</p>
              <h3 className="font-display text-[1.15rem] sm:mt-3 sm:text-[clamp(1.25rem,2.2vw,1.9rem)] leading-tight font-semibold tracking-[-0.03em] text-balance">
                {content.title}
              </h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-bone sm:mt-3 sm:text-base">{product.short}</p>

              <ul className="mt-6 grid gap-3 border-t border-white/10 pt-6 max-sm:hidden">
                {product.shortPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-snug">
                    <Check className={cx('size-4', t.text)} />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-1 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
                <Button href={trialHref(tab)} target="_blank" rel="noreferrer" variant={t.button} className="whitespace-nowrap">
                  {m.trialCta}
                </Button>
                <SmartLink
                  href={product.path}
                  className="group inline-flex h-12 items-center gap-2 px-2 font-display text-sm font-semibold whitespace-nowrap text-paper transition-colors hover:text-white"
                >
                  {products.page.more(product.name)}
                  <Arrow className="transition-transform group-hover:translate-x-1" />
                </SmartLink>
              </div>
              {price !== undefined && <p className="mt-4 font-mono text-xs text-smoke max-sm:hidden">{m.priceFrom(price)}</p>}
            </div>
            <div className="order-1 min-w-0 lg:order-none">
              <VideoCard {...product.video} accent={t.solid} ring={t.ring} />
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  )
}
