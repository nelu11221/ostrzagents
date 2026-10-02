import { useState } from 'react'
import { v2 } from '../../content/ru'
import type { Plan } from '../../lib/api'
import { LIMIT_LABELS, MONTH_OPTIONS, PERIODS, TRIAL_PLANS, TRIAL_PRICE, formatNumber, planLimits, priceFor, type Months } from '../../lib/pricing'
import { PixelBg } from '../effects/PixelBg'
import { TONE, type ProductTone } from '../landing/theme'
import { Button, Check, Container, Reveal, SectionHead, cx } from '../ui/primitives'

type Status = 'loading' | 'ready' | 'error'

type Props = {
  plans: Plan[]
  status: Status
  onRetry: () => void
  planHref: (plan: Plan, period: string) => string
  // Для страниц продуктов: показать только эти тарифы и свой заголовок
  ids?: string[]
  title?: string
  sectionId?: string
}

// Цвет карточки по составу тарифа: отдельные модули — свой цвет, связки — градиент.
const PLAN_TONE: Record<string, ProductTone> = { leadgen: 'leadgen', sales: 'sales' }
const toneOf = (plan: Plan): ProductTone => PLAN_TONE[plan.id] ?? 'duo'

// Все тарифы в одном месте: срок, тест и сравнение «отдельно vs вместе» — без прыжков по странице.
export function Pricing({ plans: allPlans, status, onRetry, planHref, ids, title, sectionId = 'pricing' }: Props) {
  const p = v2.pricing
  const plans = ids ? allPlans.filter((plan) => ids.includes(plan.id)) : allPlans
  const [months, setMonths] = useState<Months>(1)
  const [trial, setTrial] = useState(false)
  const separateSum = ['leadgen', 'sales'].reduce((sum, id) => sum + (allPlans.find((x) => x.id === id)?.price ?? 0), 0)

  const segment = (active: boolean) =>
    cx(
      'inline-flex h-11 shrink-0 items-center justify-center gap-2 px-4 text-sm font-medium whitespace-nowrap transition-colors',
      active ? 'bg-paper text-ink' : 'text-bone hover:text-paper',
    )

  return (
    <section id={sectionId} className="grain relative overflow-hidden border-t border-white/10 py-24 lg:py-32">
      <div className="absolute -bottom-40 -left-40 size-[560px] rounded-full bg-signal/20 blur-[140px]" aria-hidden />
      <div className="absolute -right-40 -bottom-40 size-[560px] rounded-full bg-iris/20 blur-[140px]" aria-hidden />
      <PixelBg className="[mask-image:linear-gradient(to_top,black,transparent_55%)]" opacity={0.4} density={0.9} />

      <Container className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="flex flex-col gap-10">
          <SectionHead label={p.label} title={title ?? p.title} dot="bg-linear-to-br from-signal to-iris" />
          <Reveal delay={0.1} className="min-w-0">
            <p className="label mb-3 text-smoke" id="billingLabel">{p.billingLabel}</p>
            <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 ring-1 ring-inset ring-white/10 sm:inline-flex" role="group" aria-labelledby="billingLabel">
              <button type="button" aria-pressed={trial} className={cx(segment(trial), 'col-span-2')} onClick={() => setTrial(true)}>
                {p.trial}
              </button>
              {MONTH_OPTIONS.map((m) => {
                const active = !trial && months === m
                const discount = PERIODS[m].discount
                return (
                  <button key={m} type="button" aria-pressed={active} className={segment(active)} onClick={() => { setTrial(false); setMonths(m) }}>
                    {PERIODS[m].short}
                    {discount > 0 && <small className={cx('font-mono text-[11px]', active ? 'text-signal-deep' : 'text-signal-hot')}>−{Math.round(discount * 100)}%</small>}
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>

        <div className={cx('mt-14 grid gap-4 sm:grid-cols-2', plans.length === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-4')} aria-live="polite" aria-busy={status === 'loading'}>
          {status === 'loading' &&
            Array.from({ length: ids?.length ?? 4 }, (_, i) => <div key={i} className="notch h-[560px] animate-pulse bg-ink-2 ring-1 ring-inset ring-white/10 [--notch:28px]" aria-hidden />)}
          {status === 'error' && (
            <div className="col-span-full flex flex-wrap items-center justify-between gap-4 bg-danger/10 p-6 text-bone ring-1 ring-inset ring-danger/40">
              <p>Не удалось загрузить тарифы.</p>
              <button type="button" onClick={onRetry} className="notch h-11 bg-paper px-5 font-display text-sm font-semibold text-ink [--notch:10px] hover:bg-white">
                Повторить
              </button>
            </div>
          )}
          {status === 'ready' &&
            plans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.06} className="h-full">
                <PlanCard plan={plan} months={months} trial={trial} separateSum={separateSum} planHref={planHref} />
              </Reveal>
            ))}
        </div>
      </Container>
    </section>
  )
}

function PlanCard({
  plan,
  months,
  trial,
  separateSum,
  planHref,
}: {
  plan: Plan
  months: Months
  trial: boolean
  separateSum: number
  planHref: (plan: Plan, period: string) => string
}) {
  const p = v2.pricing
  const tone = TONE[toneOf(plan)]
  const light = !!plan.featured
  const trialAvailable = TRIAL_PLANS.includes(plan.id)
  const price = trial ? (trialAvailable ? TRIAL_PRICE : null) : priceFor(plan.price, months)
  const fullPrice = plan.price * months
  const multiMonth = !trial && months > 1 && price !== null
  const period = trial ? 'за 1 день' : PERIODS[months].label
  const showSeparately = !trial && plan.id === 'bundle' && separateSum > plan.price

  return (
    <article
      className={cx(
        'notch relative flex h-full flex-col overflow-hidden p-6 [--notch:28px] sm:p-7',
        light ? 'bg-paper text-ink shadow-[0_40px_90px_-40px_rgba(168,85,247,.7)]' : 'bg-ink-2 ring-1 ring-inset ring-white/10',
        price === null && 'opacity-50',
      )}
    >
      <span className={cx('absolute inset-x-0 top-0 h-1.5', tone.solid)} aria-hidden />
      <div className="flex flex-wrap-reverse items-center justify-between gap-2">
        <p className={cx('label', light ? 'text-ink/60' : 'text-smoke')}>{plan.tag}</p>
        {light && <span className="bg-linear-to-r from-signal-btn to-iris-btn px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-white uppercase">{p.recommended}</span>}
      </div>
      <h3 className="mt-5 font-display text-xl leading-tight font-semibold tracking-tight">{plan.name}</h3>
      <p className={cx('mt-2 text-sm leading-relaxed', light ? 'text-ink/60' : 'text-smoke')}>{plan.description}</p>

      <div className={cx('mt-6 border-t pt-5', light ? 'border-ink/10' : 'border-white/10')}>
        <div className="flex min-h-6 items-center gap-2">
          {multiMonth && (
            <>
              <span className={cx('font-mono text-xs line-through', light ? 'text-ink/40' : 'text-smoke')}>${fullPrice}</span>
              <span className={cx('px-2 py-1 font-mono text-[11px] leading-none text-white', tone.solid)}>−${fullPrice - price}</span>
            </>
          )}
          {showSeparately && !multiMonth && (
            <span className={cx('font-mono text-xs line-through', light ? 'text-ink/40' : 'text-smoke')}>{p.separately(separateSum)}</span>
          )}
        </div>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-[2.6rem] leading-none font-bold tracking-[-0.055em] tabular-nums">{price === null ? '—' : `$${price}`}</span>
          <span className={cx('text-sm', light ? 'text-ink/50' : 'text-bone')}>{period}</span>
        </p>
        <p className={cx('mt-2 min-h-5 font-mono text-xs', light ? 'text-ink/50' : 'text-smoke')}>
          {multiMonth ? `$${(price / months).toFixed(2)} в месяц` : ''}
        </p>
      </div>

      <ul className="mt-6 grid gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 text-sm leading-snug">
            <Check className={cx('size-4', light ? 'text-iris-deep' : tone.text)} />
            {f}
          </li>
        ))}
      </ul>

      <ul className={cx('mt-6 grid gap-2.5 border-t border-dashed pt-5', light ? 'border-ink/20' : 'border-white/15')}>
        {planLimits(plan).map(([key, value]) => (
          <li key={key} className={cx('flex items-baseline justify-between gap-3 text-[13px]', light ? 'text-ink/60' : 'text-bone')}>
            <span>{LIMIT_LABELS[key]}</span>
            <b className={cx('font-mono font-normal whitespace-nowrap tabular-nums', light ? 'text-ink' : 'text-paper')}>{formatNumber(value)}</b>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        {price === null ? (
          <p className="text-sm leading-snug text-smoke">{p.trialUnavailable}</p>
        ) : (
          <Button
            href={planHref(plan, period)}
            target="_blank"
            rel="noreferrer"
            variant={light ? 'duo' : 'ghost'}
            className="w-full"
            aria-label={`${trial ? p.trialCta : p.cta}: ${plan.name}`}
          >
            {trial ? p.trialCta : p.cta}
          </Button>
        )}
      </div>
    </article>
  )
}
