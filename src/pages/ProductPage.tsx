import { useEffect } from 'react'
import { Footer, MobileCta } from '../components/landing/Closing'
import { LeadgenDemo, SalesDemo } from '../components/landing/Demos'
import { Header } from '../components/landing/Header'
import { TONE } from '../components/landing/theme'
import { PixelBg } from '../components/effects/PixelBg'
import { Arrow, Button, Check, Container, Reveal, SectionHead, cx } from '../components/ui/primitives'
import { SmartLink } from '../components/ui/SmartLink'
import { VideoCard } from '../components/ui/VideoCard'
import { Faq } from '../components/v2/Faq'
import { FinalCta } from '../components/v2/FinalCta'
import { Pricing } from '../components/v2/Pricing'
import { products, v2 } from '../content/ru'
import type { Plan } from '../lib/api'
import { tgLink } from '../lib/contact'
import { usePublicConfig } from '../lib/usePublicConfig'

type ProductId = 'leadgen' | 'sales'

// Цвет пиксельного фона под продукт: Лидоген — фирменный синий, AI-сейлз — фиолетовый
const PIXEL_COLOR: Record<ProductId, string> = { leadgen: '#3374ff', sales: '#a855f7' }

// Подробная страница модуля: видео Антона, все возможности, настройки, тарифы и вопросы.
export default function ProductPage({ id }: { id: ProductId }) {
  const product = products[id]
  const other = products[id === 'leadgen' ? 'sales' : 'leadgen']
  const otherId: ProductId = id === 'leadgen' ? 'sales' : 'leadgen'
  const page = products.page
  const t = TONE[id]
  const { contact, plans, status, retry } = usePublicConfig()

  useEffect(() => {
    const previous = document.title
    document.title = `${product.name} — OSTRO AI`
    return () => { document.title = previous }
  }, [product.name])

  const msg = v2.messages
  const trialHref = tgLink(contact, id === 'leadgen' ? msg.trialLeadgen : msg.trialSales)
  const consultHref = tgLink(contact, msg.consult)
  const planHref = (plan: Plan, period: string) => tgLink(contact, msg.plan(plan.name, period))
  const price = plans.find((p) => p.id === id)?.price

  return (
    <>
      <Header contactUrl={consultHref} ctaHref={trialHref} ctaLabel={v2.headerCta} nav={v2.nav} />
      <main id="main">
        {/* ---------- Hero: текст + видео ---------- */}
        <section id="top" className="grain relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pb-24">
          <div className={cx('absolute -top-64 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full blur-[160px]', t.glow)} aria-hidden />
          <PixelBg
            color={PIXEL_COLOR[id]}
            className="[mask-image:radial-gradient(ellipse_50%_45%_at_50%_45%,transparent_45%,black_100%)]"
            opacity={0.6}
          />
          <Container className="pointer-events-none relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
            <div>
              <nav aria-label="Навигация" style={{ animationDelay: '0s' }} className="animate-rise flex items-center gap-2 font-mono text-xs text-smoke">
                <SmartLink href="/" className="hover:text-paper">{page.breadcrumb}</SmartLink>
                <span aria-hidden>/</span>
                <span className={t.hot}>{product.name}</span>
              </nav>
              <h1
                style={{ animationDelay: '0.08s' }}
                className="animate-rise mt-6 font-display text-[clamp(2rem,6vw,3.2rem)] leading-[1.06] font-bold tracking-[-0.045em] text-balance lg:text-[clamp(2rem,3.3vw,3rem)]"
              >
                {product.title}
              </h1>
              <p style={{ animationDelay: '0.16s' }} className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-bone">
                {product.sub}
              </p>
              <div style={{ animationDelay: '0.24s' }} className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href={trialHref} target="_blank" rel="noreferrer" size="lg" variant={t.button}>
                  {product.cta}
                </Button>
                <Button href="#pricing" variant="ghost" size="lg">
                  Тарифы
                </Button>
              </div>
              {price !== undefined && (
                <p style={{ animationDelay: '0.3s' }} className="animate-rise label mt-5 text-smoke">
                  Тариф от ${price} в месяц · тест на 1 день — $15
                </p>
              )}
            </div>
            <div style={{ animationDelay: '0.36s' }} className="animate-rise relative min-w-0">
              <div className={cx('absolute inset-x-8 inset-y-6 blur-3xl', t.glow)} aria-hidden />
              <VideoCard {...product.video} accent={t.solid} ring={t.ring} className="relative" />
            </div>
          </Container>
        </section>

        {/* ---------- Возможности ---------- */}
        <section id="capabilities" className="border-t border-white/10 py-24 lg:py-28">
          <Container>
            <SectionHead label={page.capabilitiesLabel} title={page.capabilitiesTitle} dot={t.dot} />
            <Reveal className="mt-12 grid gap-px bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {product.capabilities.map((c, i) => (
                <article key={c.title} className="group bg-ink p-6 transition-colors hover:bg-ink-2 sm:p-8">
                  <span className={cx('font-mono text-xs', t.hot)}>/0{i + 1}</span>
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-3 leading-relaxed text-smoke">{c.text}</p>
                </article>
              ))}
            </Reveal>
          </Container>
        </section>

        {/* ---------- Настройки + демо ---------- */}
        <section className="relative overflow-hidden border-t border-white/10 bg-ink-2 py-24 lg:py-28">
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" aria-hidden />
          <Container className="relative grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHead label={page.howLabel} title={id === 'leadgen' ? products.leadgen.settingsTitle : products.sales.scenariosTitle} dot={t.dot} />
              <Reveal delay={0.1} className="mt-10">
                {id === 'leadgen' ? <LeadgenSettings /> : <SalesSettings />}
              </Reveal>
            </div>
            <Reveal delay={0.15} className="min-w-0 lg:mt-24">
              {id === 'leadgen' ? <LeadgenDemo /> : <SalesDemo />}
            </Reveal>
          </Container>
        </section>

        <Pricing
          plans={plans}
          status={status}
          onRetry={retry}
          planHref={planHref}
          ids={[id, 'bundle', 'scale']}
          title={page.pricingTitle}
        />

        <Faq items={product.faq} title={page.faqTitle} />

        {/* ---------- Второй модуль ---------- */}
        <section className="border-t border-white/10 py-16 lg:py-20">
          <Container>
            <SmartLink
              href={other.path}
              className="group notch relative grid gap-6 overflow-hidden bg-ink-2 p-6 ring-1 ring-inset ring-white/10 transition-colors [--notch:28px] hover:bg-ink-3 sm:p-10 md:grid-cols-[1fr_auto] md:items-center"
            >
              <span className={cx('absolute inset-y-0 left-0 w-1.5', TONE[otherId].solid)} aria-hidden />
              <div>
                <p className={cx('label', TONE[otherId].hot)}>{page.other} · {other.name}</p>
                <p className="mt-4 font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-tight font-semibold tracking-[-0.03em]">{other.title}</p>
                <p className="mt-3 max-w-2xl text-bone">{other.short}</p>
              </div>
              <span className="inline-flex items-center gap-3 font-display text-sm font-semibold">
                {page.more(other.name)}
                <Arrow className="transition-transform group-hover:translate-x-1" />
              </span>
            </SmartLink>
          </Container>
        </section>

        <FinalCta trialHref={trialHref} consultHref={consultHref} />
      </main>
      <Footer contact={contact} nav={v2.nav} />
      <MobileCta contactUrl={trialHref} label={product.cta} />
    </>
  )
}

// Лидоген: как выглядят поля в кабинете — список чатов и ключевых слов
function LeadgenSettings() {
  return (
    <div className="grid gap-4">
      {products.leadgen.settings.map((field) => (
        <div key={field.label} className="bg-ink ring-1 ring-inset ring-white/10">
          <p className="border-b border-white/10 px-4 py-3 font-mono text-xs text-bone">{field.label}</p>
          <pre className="px-4 py-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-signal-hot">{field.example}</pre>
        </div>
      ))}
      <p className="flex items-center gap-2 text-sm text-smoke">
        <Check className="size-4 text-signal" /> По одному чату или фразе на строку — как в мини-приложении
      </p>
    </div>
  )
}

// AI-сейлз: сценарии-переключатели и режим «если AI не уверен»
function SalesSettings() {
  const s = products.sales
  return (
    <div className="grid gap-8">
      <ul className="grid gap-px bg-white/10 ring-1 ring-white/10 sm:grid-cols-2">
        {s.scenarios.map((sc) => (
          <li key={sc.label} className="flex items-center gap-3 bg-ink px-4 py-3.5 text-sm">
            <span
              className={cx(
                'grid size-5 shrink-0 place-items-center ring-1 ring-inset',
                sc.on ? 'bg-iris-btn ring-iris-btn' : 'ring-white/25',
              )}
              aria-hidden
            >
              {sc.on && <Check className="size-3.5 text-white" />}
            </span>
            <span className={sc.on ? 'text-paper' : 'text-smoke'}>{sc.label}</span>
          </li>
        ))}
      </ul>
      <div>
        <p className="label text-smoke">{s.uncertainTitle}</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {s.uncertain.map((u, i) => (
            <li key={u.title} className="bg-ink p-4 ring-1 ring-inset ring-white/10">
              <span className="font-mono text-xs text-iris-hot">0{i + 1}</span>
              <p className="mt-2 font-display text-sm font-semibold tracking-tight">{u.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-smoke">{u.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
