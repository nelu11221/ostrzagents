import type { ReactNode } from 'react'
import { ru } from '../../content/ru'
import type { Plan } from '../../lib/api'
import { LIMIT_LABELS, TRIAL_PLANS, TRIAL_PRICE, formatNumber, planLimits } from '../../lib/pricing'
import { Button, Check, Container, Reveal, SectionHead, cx } from '../ui/primitives'
import { TONE } from './theme'

export type PlansStatus = 'loading' | 'ready' | 'error'

type Content = {
  index: string
  label: string
  title: string
  sub: string
  steps: { title: string; text: string }[]
  cta: string
}

type Props = {
  id: string
  tone: 'leadgen' | 'sales'
  content: Content
  demo: ReactNode
  plan?: Plan
  status: PlansStatus
  onRetry: () => void
  contactUrl: string
  reverse?: boolean
  className?: string
}

// Секция одного продукта: заголовок, как работает, демо и тариф. Цвет акцента задаёт tone.
export function ProductSection({ id, tone, content, demo, plan, status, onRetry, contactUrl, reverse, className }: Props) {
  const t = TONE[tone]
  return (
    <section id={id} className={cx('relative overflow-hidden border-t border-white/10 py-24 lg:py-32', className)}>
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" aria-hidden />
      <div
        className={cx('absolute -top-40 size-[560px] rounded-full blur-[150px]', t.glow, reverse ? '-left-40' : '-right-40')}
        aria-hidden
      />

      <Container className="relative">
        <div className="flex items-end justify-between gap-10">
          <SectionHead label={content.label} title={content.title} sub={content.sub} dot={t.dot} />
          <span
            className={cx('hidden font-display text-[10rem] leading-[0.8] font-bold tracking-[-0.06em] opacity-20 lg:block', t.text)}
            aria-hidden
          >
            {content.index}
          </span>
        </div>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <ol className={cx('border-t border-white/15', reverse && 'lg:order-2')}>
            {content.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <li className="grid grid-cols-[2.25rem_1fr] gap-5 border-b border-white/10 py-6">
                  <span className={cx('grid size-9 place-items-center font-mono text-xs text-white', t.solid)}>0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-smoke">{step.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.1} className={cx('min-w-0', reverse && 'lg:order-1')}>
            {demo}
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <ProductPlan tone={tone} plan={plan} status={status} onRetry={onRetry} cta={content.cta} contactUrl={contactUrl} />
        </Reveal>
      </Container>
    </section>
  )
}

function ProductPlan({
  tone,
  plan,
  status,
  onRetry,
  cta,
  contactUrl,
}: {
  tone: 'leadgen' | 'sales'
  plan?: Plan
  status: PlansStatus
  onRetry: () => void
  cta: string
  contactUrl: string
}) {
  const t = TONE[tone]
  const p = ru.product
  const shell = cx('notch bg-ink-2 ring-1 ring-inset [--notch:28px]', t.ring)

  if (status === 'loading' || (status === 'ready' && !plan)) {
    return <div className={cx(shell, 'h-[220px] animate-pulse')} aria-hidden />
  }
  if (status === 'error' || !plan) {
    return (
      <div className={cx(shell, 'flex flex-wrap items-center justify-between gap-4 p-6 text-bone')}>
        <p>{p.error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="notch h-11 bg-paper px-5 font-display text-sm font-semibold text-ink [--notch:10px] hover:bg-white"
        >
          {p.retry}
        </button>
      </div>
    )
  }

  return (
    <div className={cx(shell, 'grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.5fr_1fr] lg:items-center lg:gap-10 lg:p-10')}>
      <div>
        <p className="label flex items-center gap-2 text-smoke">
          <span className={cx('size-1.5', t.dot)} aria-hidden /> {p.priceLabel} · {plan.name}
        </p>
        <p className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-5xl leading-none font-bold tracking-[-0.055em] tabular-nums">${plan.price}</span>
          <span className="text-bone">{p.perMonth}</span>
        </p>
        {TRIAL_PLANS.includes(plan.id) && (
          <p className={cx('mt-3 inline-block px-2 py-1.5 font-mono text-xs', t.soft, t.hot)}>{p.trial(TRIAL_PRICE)}</p>
        )}
      </div>

      <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:border-x lg:border-white/10 lg:px-10">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 text-sm leading-snug">
            <Check className={cx('size-4', t.text)} />
            {f}
          </li>
        ))}
      </ul>

      <div className="grid gap-5">
        <ul className="grid gap-2">
          {planLimits(plan).map(([key, value]) => (
            <li key={key} className="flex items-baseline justify-between gap-3 text-[13px] text-bone">
              <span>{LIMIT_LABELS[key]}</span>
              <b className="font-mono font-normal text-paper tabular-nums">{formatNumber(value)}</b>
            </li>
          ))}
        </ul>
        <Button href={contactUrl} target="_blank" rel="noreferrer" variant={t.button} className="w-full">
          {cta}
        </Button>
      </div>
    </div>
  )
}
