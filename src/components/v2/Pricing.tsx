import { useState } from 'react'
import { pricing, type PeriodId } from '../../content/ru'
import { PixelBg } from '../effects/PixelBg'
import { TONE } from '../landing/theme'
import { Button, Check, Container, Label, cx } from '../ui/primitives'

type Plan = (typeof pricing.plans)[number]

function priceOf(plan: { test: number; month: number }, period: PeriodId) {
  if (period === 'test') return plan.test
  if (period === 'month') return plan.month
  return Math.round(plan.month * 3 * (1 - pricing.quarterDiscount))
}

// Сумма отдельных модулей — для сравнения со связкой
function separateOf(period: PeriodId) {
  return pricing.plans.filter((p) => p.id !== 'bundle').reduce((sum, p) => sum + priceOf(p, period), 0)
}

type Props = {
  planHref: (planName: string, period: string) => string
  title?: string
  id?: string
}

// Три тарифа в один ряд и на один экран: Лидоген · Связка (выделена) · AI-сейлз.
// Срок — тест на 3 дня, месяц или 3 месяца со скидкой 20%.
export function Pricing({ planHref, title, id = 'pricing' }: Props) {
  const [period, setPeriod] = useState<PeriodId>('month')
  const current = pricing.periods.find((p) => p.id === period)!

  return (
    <section
      id={id}
      className="grain relative flex scroll-mt-16 flex-col justify-center overflow-hidden border-t border-white/10 py-16 lg:min-h-[calc(100svh-72px)] lg:py-12"
    >
      <div className="absolute -bottom-40 -left-40 size-[560px] rounded-full bg-signal/20 blur-[140px]" aria-hidden />
      <div className="absolute -right-40 -bottom-40 size-[560px] rounded-full bg-iris/20 blur-[140px]" aria-hidden />
      <PixelBg className="[mask-image:linear-gradient(to_top,black,transparent_55%)]" opacity={0.35} density={0.9} />

      <Container className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Label dot="bg-linear-to-br from-signal to-iris">{pricing.label}</Label>
            <h2 className="mt-4 font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
              {title ?? pricing.title}
            </h2>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-1 bg-white/5 p-1 ring-1 ring-inset ring-white/10" role="group" aria-label="Срок доступа">
            {pricing.periods.map((p) => {
              const active = p.id === period
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPeriod(p.id)}
                  className={cx(
                    'inline-flex h-11 items-center justify-center gap-2 px-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-5',
                    active ? 'bg-paper text-ink' : 'text-bone hover:text-paper',
                  )}
                >
                  {p.label}
                  {p.badge && <small className={cx('font-mono text-[11px]', active ? 'text-iris-deep' : 'text-iris-hot')}>{p.badge}</small>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:items-stretch">
          {pricing.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} period={period} suffix={current.suffix} planHref={planHref} />
          ))}
        </div>

        <p className="mt-5 flex items-center gap-2 font-mono text-xs text-smoke">
          <span className="size-1.5 shrink-0 bg-iris" aria-hidden />
          {pricing.dialogNote}
        </p>
      </Container>
    </section>
  )
}

function PlanCard({
  plan,
  period,
  suffix,
  planHref,
}: {
  plan: Plan
  period: PeriodId
  suffix: string
  planHref: (planName: string, period: string) => string
}) {
  const tone = TONE[plan.tone]
  const light = 'featured' in plan && !!plan.featured
  const price = priceOf(plan, period)
  const separate = plan.id === 'bundle' ? separateOf(period) : null
  const saving = separate ? Math.round((1 - price / separate) * 100) : null
  const isTest = period === 'test'

  return (
    <article
      className={cx(
        'notch relative flex flex-col overflow-hidden p-6 [--notch:28px] lg:p-7',
        light ? 'bg-paper text-ink shadow-[0_40px_90px_-40px_rgba(168,85,247,.8)] md:-my-3 md:py-9' : 'bg-ink-2 ring-1 ring-inset ring-white/10',
      )}
    >
      <span className={cx('absolute inset-x-0 top-0', light ? 'h-2' : 'h-1.5', tone.solid)} aria-hidden />

      <div className="flex items-center justify-between gap-2">
        <p className={cx('label', light ? 'text-ink/60' : 'text-smoke')}>{plan.tag}</p>
        {saving !== null && saving > 0 && (
          <span className="bg-linear-to-r from-signal-btn to-iris-btn px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-white uppercase">
            {pricing.recommended} на {saving}%
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-xl leading-tight font-semibold tracking-tight">{plan.name}</h3>
      <p className={cx('mt-1.5 text-sm', light ? 'text-ink/60' : 'text-smoke')}>{plan.description}</p>

      <div className={cx('mt-5 border-t pt-4', light ? 'border-ink/10' : 'border-white/10')}>
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-[2.6rem] leading-none font-bold tracking-[-0.055em] tabular-nums">${price}</span>
          <span className={cx('text-sm', light ? 'text-ink/55' : 'text-bone')}>{suffix}</span>
        </p>
        <p className={cx('mt-2 min-h-5 font-mono text-xs', light ? 'text-ink/50' : 'text-smoke')}>
          {separate !== null && <span className="mr-2 line-through">{pricing.separately(separate)}</span>}
          {period === 'quarter' && (
            <>
              {separate === null && <span className="mr-2 line-through">${plan.month * 3}</span>}
              {pricing.perMonth(Math.round(price / 3))}
            </>
          )}
        </p>
      </div>

      <ul className="mt-5 grid gap-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm leading-snug">
            <Check className={cx('size-4', light ? 'text-iris-deep' : tone.text)} />
            {f}
          </li>
        ))}
      </ul>

      <ul className={cx('mt-5 grid gap-2 border-t border-dashed pt-4', light ? 'border-ink/20' : 'border-white/15')}>
        {plan.limits.map((l) => (
          <li key={l.label} className={cx('flex items-baseline justify-between gap-3 text-[13px]', light ? 'text-ink/60' : 'text-bone')}>
            <span>{l.label}</span>
            <b className={cx('font-mono font-normal whitespace-nowrap', light ? 'text-ink' : 'text-paper')}>{l.value}</b>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Button
          href={planHref(plan.name, suffix)}
          target="_blank"
          rel="noreferrer"
          variant={light ? 'duo' : plan.tone === 'sales' ? 'iris' : 'signal'}
          className="w-full"
          aria-label={`${isTest ? pricing.trialCta : pricing.cta}: ${plan.name}`}
        >
          {isTest ? pricing.trialCta : pricing.cta}
        </Button>
        <p className={cx('mt-3 text-center font-mono text-[11px]', light ? 'text-ink/50' : 'text-smoke')}>{pricing.setup}</p>
      </div>
    </article>
  )
}
