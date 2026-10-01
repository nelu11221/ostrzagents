import { Fragment, useState } from 'react'
import { ru } from '../../content/ru'
import type { Plan } from '../../lib/api'
import { MONTH_OPTIONS, PERIODS, formatNumber, planLimits, priceFor, LIMIT_LABELS, type Months } from '../../lib/pricing'
import { PixelBg } from '../effects/PixelBg'
import { Arrow, Button, Check, Container, Reveal, SectionHead, cx } from '../ui/primitives'
import type { PlansStatus } from './ProductSection'
import { TONE } from './theme'

type Props = {
  plans: Plan[]
  status: PlansStatus
  onRetry: () => void
  contactUrl: string
}

const COMBO_PLANS = ['bundle', 'scale']

export function Together({ plans, status, onRetry, contactUrl }: Props) {
  const t = ru.together
  const [months, setMonths] = useState<Months>(1)
  const byId = (id: string) => plans.find((p) => p.id === id)
  const leadgen = byId('leadgen')
  const sales = byId('sales')
  const bundle = byId('bundle')
  const combos = COMBO_PLANS.map(byId).filter((p): p is Plan => !!p)

  return (
    <section id="together" className="grain relative overflow-hidden border-t border-white/10 py-24 lg:py-32">
      <div className="absolute -top-40 -left-40 size-[560px] rounded-full bg-signal/25 blur-[150px]" aria-hidden />
      <div className="absolute -right-40 bottom-0 size-[560px] rounded-full bg-iris/25 blur-[150px]" aria-hidden />
      <PixelBg className="[mask-image:linear-gradient(to_bottom,black,transparent_45%)]" opacity={0.3} density={0.85} />

      <Container className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <SectionHead label={t.label} title={t.title} sub={t.sub} dot={TONE.duo.dot} />

        {/* Контур: Лидоген → AI-сейлз → менеджер */}
        <div className="mt-14 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
          {t.flow.map((step, i) => {
            const tone = TONE[step.tone as keyof typeof TONE]
            return (
              <Fragment key={step.title}>
                {i > 0 && (
                  <div className="grid place-items-center text-bone" aria-hidden>
                    <Arrow className="size-5 max-md:rotate-90" />
                  </div>
                )}
                <Reveal delay={i * 0.1} className="notch relative overflow-hidden bg-ink-2 p-6 ring-1 ring-inset ring-white/10 [--notch:18px]">
                  <span className={cx('absolute inset-x-0 top-0 h-1', tone.solid)} aria-hidden />
                  <span className={cx('font-mono text-xs', tone.hot)}>/0{i + 1}</span>
                  <p className="mt-4 font-display text-xl font-semibold tracking-tight">{step.title}</p>
                  <p className="mt-1 text-smoke">{step.text}</p>
                </Reveal>
              </Fragment>
            )
          })}
        </div>

        {/* Отдельно vs вместе — считается из тарифов API */}
        {leadgen && sales && bundle && (
          <Reveal className="mt-6">
            <div className="flex flex-col gap-4 bg-white/[0.04] p-6 ring-1 ring-inset ring-white/10 sm:flex-row sm:items-center sm:justify-between">
              <p className="label text-smoke">{t.mathLabel}</p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-lg font-semibold tracking-tight">
                <span className="text-signal-hot">${leadgen.price}</span>
                <span className="text-smoke">+</span>
                <span className="text-iris-hot">${sales.price}</span>
                <span className="text-smoke">=</span>
                <span className="text-smoke line-through decoration-2">${leadgen.price + sales.price}</span>
                <Arrow className="size-4 text-bone" />
                <span className="bg-linear-to-r from-signal-hot to-iris-hot bg-clip-text text-3xl text-transparent">${bundle.price}</span>
                <span className="bg-linear-to-r from-signal-btn to-iris-btn px-2 py-1 font-mono text-xs font-normal text-white">
                  {t.mathSave(Math.round((1 - bundle.price / (leadgen.price + sales.price)) * 100))}
                </span>
              </p>
            </div>
          </Reveal>
        )}

        <div className="mt-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <p className="label text-smoke" id="billingLabel">{t.billingLabel}</p>
          <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 ring-1 ring-inset ring-white/10 sm:flex" role="group" aria-labelledby="billingLabel">
            {MONTH_OPTIONS.map((m) => {
              const active = months === m
              const discount = PERIODS[m].discount
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMonths(m)}
                  className={cx(
                    'inline-flex h-11 shrink-0 items-center justify-center gap-2 px-4 text-sm font-medium whitespace-nowrap transition-colors',
                    active ? 'bg-paper text-ink' : 'text-bone hover:text-paper',
                  )}
                >
                  {PERIODS[m].short}
                  {discount > 0 && (
                    <small className={cx('font-mono text-[11px]', active ? 'text-iris-deep' : 'text-iris-hot')}>
                      −{Math.round(discount * 100)}%
                    </small>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2" aria-live="polite" aria-busy={status === 'loading'}>
          {status === 'loading' &&
            [0, 1].map((i) => <div key={i} className="notch h-[520px] animate-pulse bg-ink-2 ring-1 ring-inset ring-white/10 [--notch:32px]" aria-hidden />)}
          {status === 'error' && (
            <div className="col-span-full flex flex-wrap items-center justify-between gap-4 bg-danger/10 p-6 text-bone ring-1 ring-inset ring-danger/40">
              <p>{ru.product.error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="notch h-11 bg-paper px-5 font-display text-sm font-semibold text-ink [--notch:10px] hover:bg-white"
              >
                {ru.product.retry}
              </button>
            </div>
          )}
          {status === 'ready' &&
            combos.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.08} className="h-full">
                <ComboCard plan={plan} months={months} contactUrl={contactUrl} />
              </Reveal>
            ))}
        </div>
      </Container>
    </section>
  )
}

// Связка: светлая карточка с градиентной полосой (featured) или тёмная в градиентной рамке.
function ComboCard({ plan, months, contactUrl }: { plan: Plan; months: Months; contactUrl: string }) {
  const light = !!plan.featured
  const price = priceFor(plan.price, months)
  const fullPrice = plan.price * months
  const multiMonth = months > 1

  return (
    <div className={cx('notch h-full p-px [--notch:32px]', light ? 'bg-paper' : 'bg-linear-to-br from-signal to-iris')}>
      <article
        className={cx(
          'notch relative flex h-full flex-col overflow-hidden p-6 [--notch:32px] sm:p-10',
          light ? 'bg-paper text-ink' : 'bg-ink-2',
        )}
      >
        <span className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-signal-btn to-iris-btn" aria-hidden />
        <p
          className={cx(
            'label inline-flex w-fit items-center gap-2 px-2.5 py-1.5',
            light ? 'bg-linear-to-r from-signal-btn to-iris-btn text-white' : 'text-bone ring-1 ring-inset ring-white/15',
          )}
        >
          {plan.tag}
        </p>
        <h3 className="mt-6 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight font-semibold tracking-[-0.03em]">{plan.name}</h3>
        <p className={cx('mt-3 max-w-md leading-relaxed', light ? 'text-ink/60' : 'text-smoke')}>{plan.description}</p>

        <div className={cx('mt-8 border-t pt-6', light ? 'border-ink/10' : 'border-white/10')}>
          <div className="flex min-h-6 items-center gap-2">
            {multiMonth && (
              <>
                <span className={cx('font-mono text-xs line-through', light ? 'text-ink/40' : 'text-smoke')}>${fullPrice}</span>
                <span className="bg-linear-to-r from-signal-btn to-iris-btn px-2 py-1 font-mono text-[11px] leading-none text-white">
                  −${fullPrice - price}
                </span>
              </>
            )}
          </div>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-[clamp(2.8rem,5vw,4rem)] leading-none font-bold tracking-[-0.055em] tabular-nums">${price}</span>
            <span className={light ? 'text-ink/50' : 'text-bone'}>{PERIODS[months].label}</span>
          </p>
          <p className={cx('mt-2 min-h-5 font-mono text-xs', light ? 'text-ink/50' : 'text-smoke')}>
            {multiMonth ? `$${(price / months).toFixed(2)} в месяц` : ''}
          </p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <ul className="grid content-start gap-3">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm leading-snug">
                <Check className={cx('size-4', light ? 'text-iris-deep' : 'text-iris-hot')} />
                {f}
              </li>
            ))}
          </ul>
          <ul className={cx('grid content-start gap-2.5 border-t border-dashed pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6', light ? 'border-ink/20' : 'border-white/15')}>
            {planLimits(plan).map(([key, value]) => (
              <li key={key} className={cx('flex items-baseline justify-between gap-3 text-[13px]', light ? 'text-ink/60' : 'text-bone')}>
                <span>{LIMIT_LABELS[key]}</span>
                <b className={cx('font-mono font-normal tabular-nums', light ? 'text-ink' : 'text-paper')}>{formatNumber(value)}</b>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-10">
          <Button
            href={contactUrl}
            target="_blank"
            rel="noreferrer"
            variant={light ? 'duo' : 'ghost'}
            size="lg"
            className="w-full"
            aria-label={`${ru.together.cta} ${plan.name}`}
          >
            {ru.together.cta}
          </Button>
        </div>
      </article>
    </div>
  )
}
