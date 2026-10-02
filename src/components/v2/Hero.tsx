import type { ReactNode } from 'react'
import { v2 } from '../../content/ru'
import { PixelBg } from '../effects/PixelBg'
import { Button, Container, cx } from '../ui/primitives'
import { WatchButton } from '../ui/VideoModal'

// Hero v2: центрированный заголовок на всю ширину + горизонтальный «конвейер» продукта под ним:
// чаты (синий, Лидоген) → AI-фильтр → личка (фиолетовый, AI-сейлз).
export function Hero({ trialHref }: { trialHref: string }) {
  const h = v2.hero
  return (
    <section id="top" className="grain relative overflow-hidden pt-28 pb-20 sm:pt-36 lg:pb-28">
      <div className="absolute -top-72 left-1/2 h-[680px] w-[1200px] -translate-x-1/2 rounded-full bg-linear-to-r from-signal/35 to-iris/30 blur-[160px]" aria-hidden />
      <PixelBg className="[mask-image:radial-gradient(ellipse_48%_36%_at_50%_30%,transparent_40%,black_100%)]" opacity={0.75} />

      {/* pointer-events пропускаются к пиксельному фону (ripple по клику), кроме кнопок и ссылок */}
      <Container className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="mx-auto max-w-5xl text-center">
          <p
            style={{ animationDelay: '0s' }}
            className="animate-rise mx-auto inline-flex items-center gap-3 border border-white/15 bg-ink/85 px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-paper uppercase backdrop-blur-sm"
          >
            <span className="flex gap-1" aria-hidden>
              <span className="size-1.5 animate-rec bg-signal-hot" />
              <span className="size-1.5 animate-rec bg-iris-hot [animation-delay:.7s]" />
            </span>
            {h.eyebrow}
          </p>

          <h1 className="mt-8 font-display text-[clamp(2.1rem,5.6vw,5rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance">
            <span style={{ animationDelay: '0.08s' }} className="animate-rise block">{h.titleA}</span>
            <span style={{ animationDelay: '0.16s' }} className="animate-rise block">
              {h.titleB}{' '}
              <span className="notch relative mt-2 inline-block -rotate-2 bg-linear-to-r from-signal-btn to-iris-btn px-[0.22em] pb-[0.06em] text-white shadow-[0_20px_60px_-10px_rgba(124,92,255,.7)] [--notch:0.28em]">
                {h.titleHot}
              </span>
            </span>
          </h1>

          <p style={{ animationDelay: '0.26s' }} className="animate-rise mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-bone">
            {h.sub}
          </p>

          <div style={{ animationDelay: '0.34s' }} className="animate-rise mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={trialHref} target="_blank" rel="noreferrer" size="lg" variant="duo">
              {h.cta}
            </Button>
            <Button href="#modules" variant="ghost" size="lg">
              {h.secondary}
            </Button>
          </div>
          <p style={{ animationDelay: '0.4s' }} className="animate-rise label mt-5 text-smoke">
            {h.note}
          </p>
        </div>

        <div style={{ animationDelay: '0.5s' }} className="animate-rise mt-16 sm:mt-20">
          <Pipeline />
          {/* Как это выглядит — ролики Антона открываются поверх страницы */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WatchButton product="leadgen" className="bg-ink/70 backdrop-blur-sm" />
            <WatchButton product="sales" className="bg-ink/70 backdrop-blur-sm" />
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------- Конвейер ----------

const STREAM = [
  { name: 'Денис', text: 'Кто идёт на митап в четверг?', hit: false },
  { name: 'Ольга', text: '{Ищу специалиста} по рекламе, бюджет есть', hit: true },
  { name: 'Максим', text: 'Продам курс по таргету, недорого', hit: false },
  { name: 'Ирина', text: '{Нужен подрядчик} на таргет для салона', hit: true },
  { name: 'Кирилл', text: 'Скиньте ссылку на чат по дизайну', hit: false },
  { name: 'Анна', text: '{Кто может помочь} с рекламой в Telegram?', hit: true },
  { name: 'Светлана', text: 'Где заказать печать визиток?', hit: false },
]

function highlight(text: string) {
  return text.split(/\{(.+?)\}/g).map((part, i) =>
    i % 2 ? <mark key={i} className="bg-signal/35 px-0.5 text-paper">{part}</mark> : part,
  )
}

function Stage({
  n,
  label,
  meta,
  dot,
  ring,
  children,
}: {
  n: string
  label: string
  meta: string
  dot: string
  ring: string
  children: ReactNode
}) {
  return (
    <div className={cx('notch flex h-[300px] min-w-0 flex-col bg-ink-2/90 ring-1 ring-inset backdrop-blur-sm [--notch:22px]', ring)}>
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-3.5 font-mono text-xs">
        <span className={cx('size-1.5 animate-rec', dot)} aria-hidden />
        <span className="text-paper">{label}</span>
        <span className="truncate text-smoke">· {meta}</span>
        <span className="ml-auto pr-3 text-smoke">/{n}</span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

function Connector({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative hidden w-14 self-center lg:block" aria-hidden>
      <span className={cx('block h-px w-full bg-linear-to-r', from, to)} />
      <span className="flow-dot absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_12px_2px_rgba(162,141,255,.8)]" />
    </div>
  )
}

function Pipeline() {
  const p = v2.hero.pipeline
  const stream = [...STREAM, ...STREAM]
  return (
    <div
      className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-0"
      role="img"
      aria-label="Как работает OSTRO AI: сообщения из Telegram-чатов проходят AI-фильтр, а найденным клиентам AI-сейлз отвечает в личке"
    >
      {/* 1. Поток сообщений из чатов: совпадения подсвечены синим (Лидоген) */}
      <Stage n="01" label={p.chats.label} meta={p.chats.meta} dot="bg-signal-hot" ring="ring-signal/30">
        <ul className="scroll-y" aria-hidden>
          {stream.map((m, i) => (
            <li key={i} className={cx('flex gap-3 border-b border-white/5 px-5 py-3 text-sm', !m.hit && 'opacity-45')}>
              <span className={cx('grid size-7 shrink-0 place-items-center font-display text-[11px] font-semibold', m.hit ? 'bg-signal-btn' : 'bg-ink-3')}>
                {m.name[0]}
              </span>
              <span className="min-w-0">
                <b className="block text-xs font-semibold text-paper">{m.name}</b>
                <span className={m.hit ? 'text-paper' : 'text-bone'}>{highlight(m.text)}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink-2 via-transparent to-ink-2" />
      </Stage>

      <Connector from="from-signal" to="to-signal/40" />

      {/* 2. AI-фильтр: воронка отбора */}
      <Stage n="02" label={p.filter.label} meta={p.filter.meta} dot="bg-linear-to-r from-signal-hot to-iris-hot" ring="ring-white/15">
        <div className="flex h-full flex-col justify-center gap-5 px-5 py-5">
          {p.funnel.map((row, i) => {
            const last = i === p.funnel.length - 1
            return (
              <div key={row.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className={cx('font-display font-bold tracking-tight tabular-nums', last ? 'text-3xl' : 'text-xl text-bone')}>{row.value}</span>
                  <span className="font-mono text-[11px] text-smoke">{row.label}</span>
                </div>
                <span className="mt-2 block h-1.5 bg-white/10">
                  <span className={cx('block h-full', last ? 'bg-linear-to-r from-signal to-iris' : 'bg-signal/60')} style={{ width: row.width }} />
                </span>
              </div>
            )
          })}
          <p className="flex items-center gap-2 font-mono text-[11px] text-iris-hot">
            <span className="flex gap-1" aria-hidden>
              {[0, 0.15, 0.3].map((d) => (
                <i key={d} className="typing-dot size-1 rounded-full bg-iris-hot" style={{ animationDelay: `${d}s` }} />
              ))}
            </span>
            {p.checking}
          </p>
        </div>
      </Stage>

      <Connector from="from-signal/40" to="to-iris" />

      {/* 3. Диалог в личке: отвечает AI-сейлз (фиолетовый) */}
      <Stage n="03" label={p.dm.label} meta={p.dm.meta} dot="bg-iris-hot" ring="ring-iris/35">
        <div className="flex h-full flex-col justify-end gap-3 px-5 py-5">
          {p.dialog.map((m, i) => {
            const ai = m.from === 'ai'
            return (
              <div key={i} className={cx('flex', ai ? 'justify-end' : 'justify-start')}>
                <p
                  className={cx(
                    'max-w-[88%] px-3.5 py-2.5 text-sm leading-snug',
                    ai ? 'notch bg-iris-btn text-white [--notch:9px]' : 'notch-bl bg-white/[0.07] text-paper [--notch:9px]',
                  )}
                >
                  {ai && <span className="mb-1 block font-mono text-[10px] tracking-[0.12em] text-white/70 uppercase">✦ AI-сейлз</span>}
                  {m.text}
                </p>
              </div>
            )
          })}
          <div className="flex justify-start">
            <span className="notch-bl inline-flex gap-1 bg-white/[0.07] px-3.5 py-3 [--notch:9px]" aria-hidden>
              {[0, 0.15, 0.3].map((d) => (
                <i key={d} className="typing-dot size-1.5 rounded-full bg-bone" style={{ animationDelay: `${d}s` }} />
              ))}
            </span>
          </div>
        </div>
      </Stage>
    </div>
  )
}
