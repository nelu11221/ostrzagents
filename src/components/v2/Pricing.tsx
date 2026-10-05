import { useEffect, useRef, useState } from 'react'
import { pricing, type PeriodId } from '../../content/ru'
import { PixelBg } from '../effects/PixelBg'
import { TONE } from '../landing/theme'
import { Arrow, Button, Check, Container, Label, cx } from '../ui/primitives'

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
  setupHref: string
  title?: string
  id?: string
}

// Три тарифа в один ряд и на один экран: Лидоген · Связка (выделена) · AI-сейлз.
// Срок — тест на 3 дня, месяц или 3 месяца со скидкой 20%.
export function Pricing({ planHref, setupHref, title, id = 'pricing' }: Props) {
  const [period, setPeriod] = useState<PeriodId>('test')
  const current = pricing.periods.find((p) => p.id === period)!
  const cardsRef = useRef<HTMLDivElement>(null)
  const featuredIndex = pricing.plans.findIndex((p) => 'featured' in p && p.featured)
  const [activeCard, setActiveCard] = useState(featuredIndex)

  // На мобильном — по одной карточке на экран, листаются свайпом; стартуем со связки
  const scrollToCard = (index: number, smooth = true) => {
    const row = cardsRef.current
    const card = row?.children[index] as HTMLElement | undefined
    if (!row || !card) return
    row.scrollTo({ left: card.offsetLeft - row.offsetLeft, behavior: smooth ? 'smooth' : 'instant' })
  }

  useEffect(() => {
    const row = cardsRef.current
    if (!row || row.scrollWidth <= row.clientWidth) return
    scrollToCard(featuredIndex, false)
    const onScroll = () => setActiveCard(Math.round(row.scrollLeft / row.clientWidth))
    row.addEventListener('scroll', onScroll, { passive: true })

    // Подсказка, что можно листать: при первом показе карточки один раз «дёргаются» влево-вправо
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        row.dataset.nudge = ''
        io.disconnect()
      },
      { threshold: 0.6 },
    )
    io.observe(row)
    const stopNudge = () => delete row.dataset.nudge
    row.addEventListener('touchstart', stopNudge, { passive: true })
    return () => {
      row.removeEventListener('scroll', onScroll)
      row.removeEventListener('touchstart', stopNudge)
      io.disconnect()
    }
  }, [featuredIndex])

  return (
    <section
      id={id}
      className="grain relative flex scroll-mt-16 flex-col justify-center overflow-hidden border-t border-white/10 py-6 sm:py-16 lg:min-h-[calc(100svh-72px)] lg:py-7"
    >
      <div className="absolute -bottom-40 -left-40 size-[560px] rounded-full bg-signal/20 blur-[140px]" aria-hidden />
      <div className="absolute -right-40 -bottom-40 size-[560px] rounded-full bg-iris/20 blur-[140px]" aria-hidden />
      <PixelBg className="[mask-image:linear-gradient(to_top,black,transparent_55%)]" opacity={0.35} density={0.9} />

      <Container className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="flex flex-col justify-between gap-3 sm:gap-6 md:flex-row md:items-end">
          <div>
            <Label dot="bg-linear-to-br from-signal to-iris" className="max-sm:hidden">{pricing.label}</Label>
            <h2 className="font-display text-[1.35rem] sm:mt-4 sm:text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
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
                    'inline-flex h-10 items-center justify-center gap-2 px-2 text-[13px] font-medium whitespace-nowrap transition-colors sm:h-11 sm:px-5 sm:text-sm',
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

        <div ref={cardsRef} className="pointer-events-auto mt-3 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] sm:mt-8 lg:mt-5 md:grid md:grid-cols-3 md:items-stretch md:gap-4 md:overflow-visible">
          {pricing.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} period={period} suffix={current.suffix} planHref={planHref} />
          ))}
        </div>
        {/* Мобильный переключатель: видно, что тарифов три и их можно листать */}
        <div className="mt-2 grid grid-cols-3 gap-1 bg-white/5 p-1 ring-1 ring-inset ring-white/10 md:hidden" role="tablist" aria-label="Тарифы">
          {pricing.plans.map((plan, i) => {
            const selected = i === activeCard
            return (
              <button
                key={plan.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => scrollToCard(i)}
                className={cx(
                  'flex h-8 items-center justify-center gap-1.5 px-1 text-xs font-medium whitespace-nowrap transition-colors',
                  selected ? cx(TONE[plan.tone].solid, 'text-white') : 'text-bone',
                )}
              >
                {i < activeCard && <span aria-hidden>‹</span>}
                {plan.id === 'bundle' ? 'Связка' : plan.name}
                {i > activeCard && <span aria-hidden>›</span>}
              </button>
            )
          })}
        </div>

        <p className="mt-3 flex items-center gap-2 font-mono text-xs text-paper max-sm:hidden">
          <span className="size-1.5 shrink-0 bg-iris" aria-hidden />
          {pricing.dialogNote}
        </p>

        {/* Настройка под ключ с гарантией — отдельное предложение под тарифами */}
        <a
          href={setupHref}
          target="_blank"
          rel="noreferrer"
          className="group notch relative mt-2 block bg-linear-to-r from-signal-btn to-iris-btn p-px [--notch:14px] sm:mt-3 sm:[--notch:22px]"
        >
          <span className="notch flex items-center gap-3 bg-ink-2 py-2 pr-2 pl-3 transition-colors [--notch:13px] group-hover:bg-ink-3 sm:gap-6 sm:p-6 sm:[--notch:21px] lg:px-8 lg:py-4">
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] leading-snug text-paper sm:hidden">
                {pricing.setup.short} <b className="font-semibold whitespace-nowrap">{pricing.setup.price}</b>
              </span>
              <span className="block font-display text-xl font-semibold tracking-tight max-sm:hidden">{pricing.setup.title}</span>
              <span className="mt-1 block text-sm leading-snug text-bone max-sm:hidden lg:text-[15px]">{pricing.setup.text}</span>
            </span>
            <span className="font-display text-2xl font-bold tracking-tight whitespace-nowrap max-sm:hidden lg:text-3xl">{pricing.setup.price}</span>
            <span className="inline-flex h-8 shrink-0 items-center gap-1.5 bg-paper px-3 font-display text-xs font-semibold text-ink transition-colors group-hover:bg-white sm:h-12 sm:gap-2 sm:px-6 sm:text-base">
              {pricing.setup.cta}
              <Arrow className="size-3.5 transition-transform group-hover:translate-x-0.5 sm:size-4" />
            </span>
          </span>
        </a>
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

  return (
    <article
      data-featured={light || undefined}
      className={cx(
        'notch relative flex w-full shrink-0 snap-center snap-always flex-col overflow-hidden p-4 [--notch:28px] sm:p-6 md:w-auto lg:p-7',
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
      <h3 className="mt-3 font-display text-xl leading-tight font-semibold tracking-tight sm:mt-4">{plan.name}</h3>
      <p className={cx('mt-1.5 text-sm max-sm:hidden', light ? 'text-ink/60' : 'text-smoke')}>{plan.description}</p>

      <div className={cx('mt-4 border-t pt-3 sm:mt-5 sm:pt-4', light ? 'border-ink/10' : 'border-white/10')}>
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-[2.6rem] leading-none font-bold tracking-[-0.055em] tabular-nums">
            {/* Знак доллара меньше и приподнят — не сливается с цифрами */}
            <span className="mr-0.5 align-[0.55em] text-[0.5em] tracking-normal">$</span>
            {price}
          </span>
          <span className={cx('text-sm', light ? 'text-ink/55' : 'text-bone')}>{suffix}</span>
        </p>
        <p className={cx('mt-1 min-h-5 font-mono text-xs sm:mt-2', light ? 'text-ink/50' : 'text-smoke')}>
          {separate !== null && <span className="mr-2 line-through">{pricing.separately(separate)}</span>}
          {period === 'quarter' && (
            <>
              {separate === null && <span className="mr-2 line-through">${plan.month * 3}</span>}
              {pricing.perMonth(Math.round(price / 3))}
            </>
          )}
        </p>
      </div>

      <ul className="mt-3 grid gap-1.5 sm:mt-5 sm:gap-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-[13px] leading-snug sm:text-sm">
            <Check className={cx('size-4', light ? 'text-iris-deep' : tone.text)} />
            {f}
          </li>
        ))}
      </ul>

      <ul className={cx('mt-3 grid gap-1.5 border-t border-dashed pt-2.5 sm:mt-5 sm:gap-2 sm:pt-4', light ? 'border-ink/20' : 'border-white/15')}>
        {plan.limits.map((l) => (
          <li key={l.label} className={cx('flex items-baseline justify-between gap-3 text-[13px]', light ? 'text-ink/60' : 'text-bone')}>
            <span>{l.label}</span>
            <b className={cx('font-mono font-normal whitespace-nowrap', light ? 'text-ink' : 'text-paper')}>{l.value}</b>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4 sm:pt-6">
        <Button
          href={planHref(plan.name, suffix)}
          target="_blank"
          rel="noreferrer"
          variant={light ? 'duo' : plan.tone === 'sales' ? 'iris' : 'signal'}
          className="w-full"
          aria-label={`${plan.cta}: ${plan.name}`}
        >
          {plan.cta}
        </Button>
      </div>
    </article>
  )
}
