import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cx } from '../ui/primitives'

// Пример потока: {слово} — совпадение по ключевым словам. Лиды получают ответ AI-сейлза.
type FeedState = 'skip' | 'rejected' | 'lead'
type FeedItem = { name: string; chat: string; text: string; state: FeedState; score?: number; reply?: string }

const FEED: FeedItem[] = [
  { name: 'Денис', chat: 'Фриланс и заказы', text: 'Всем привет! Кто идёт на митап в четверг?', state: 'skip' },
  { name: 'Максим', chat: 'SMM и маркетинг', text: 'Продам курс по {таргету}, недорого', state: 'rejected' },
  { name: 'Ирина', chat: 'SMM и маркетинг', text: '{Нужен подрядчик} на таргет для салона, кто свободен?', state: 'lead', score: 88, reply: 'Добрый день! Можем взять таргет для салона. Подскажите город и что уже пробовали?' },
  { name: 'Ольга', chat: 'Предприниматели', text: '{Ищу специалиста} по рекламе, бюджет есть', state: 'lead', score: 92, reply: 'Здравствуйте! Можем помочь с рекламой. Подскажите, что продвигаете и какой бюджет на тест?' },
  { name: 'Кирилл', chat: 'Разработка и IT', text: 'Скиньте ссылку на чат по дизайну, пожалуйста', state: 'skip' },
  { name: 'Анна', chat: 'Предприниматели', text: '{Кто может помочь} с рекламой в Telegram? Пишите в лс', state: 'lead', score: 95, reply: 'Здравствуйте! Помогаем с рекламой в Telegram. Что продаёте и когда хотите запуститься?' },
  { name: 'Павел', chat: 'Фриланс и заказы', text: 'Агентство {ищет исполнителя} в штат, присылайте резюме', state: 'rejected' },
  { name: 'Светлана', chat: 'Предприниматели', text: 'Коллеги, где заказать печать визиток быстро?', state: 'skip' },
]
const FEED_START = 4
const MAX_VISIBLE = 7
const TICK_MS = 3200

const STATUS: Record<FeedState, (item: FeedItem) => string> = {
  lead: (item) => `лид · ${item.score}%`,
  rejected: () => 'AI: не запрос',
  skip: () => 'пропуск',
}
const TAG_CLASS: Record<FeedState, string> = {
  lead: 'bg-signal-btn text-white',
  rejected: 'text-bone ring-1 ring-inset ring-white/20 [border-style:dashed]',
  skip: 'text-smoke ring-1 ring-inset ring-white/10',
}
const AVATARS = ['bg-signal-deep', 'bg-ink-3', 'bg-[#1d2a5c]', 'bg-[#22305f]']

type Entry = { key: number; item: FeedItem; time: string; isNew: boolean }

function clock(minutesAgo = 0) {
  return new Date(Date.now() - minutesAgo * 60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function highlight(text: string) {
  return text.split(/\{(.+?)\}/g).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

function Message({ entry }: { entry: Entry }) {
  const { item, key, time, isNew } = entry
  const [entering, setEntering] = useState(isNew)

  useEffect(() => {
    if (!isNew) return
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => setEntering(false)) })
    return () => cancelAnimationFrame(frame)
  }, [isNew])

  return (
    <li
      data-state={item.state}
      data-new={isNew || undefined}
      className={cx(
        'feed-msg grid shrink-0 grid-cols-[30px_minmax(0,1fr)] items-start gap-x-3 gap-y-1.5 overflow-hidden px-4 sm:grid-cols-[34px_minmax(0,1fr)_auto] sm:px-5',
        entering ? 'max-h-0 translate-y-2.5 py-0 opacity-0' : 'max-h-40 py-2.5',
        !entering && item.state === 'skip' && 'opacity-50',
      )}
    >
      <span className={cx('grid size-[30px] place-items-center font-display text-xs font-semibold text-paper sm:size-[34px]', AVATARS[key % 4])}>
        {item.name[0]}
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 overflow-hidden text-xs whitespace-nowrap text-smoke">
          <b className="text-[13px] font-semibold text-paper">{item.name}</b>
          <span className="truncate">{item.chat}</span>
          <time className="font-mono text-[11px]">{time}</time>
        </div>
        <p className={cx('mt-0.5 text-sm leading-snug', item.state === 'lead' ? 'text-paper' : 'text-bone')}>{highlight(item.text)}</p>
      </div>
      <span className={cx('feed-tag col-start-2 justify-self-start px-2 py-1.5 font-mono text-[11px] leading-none whitespace-nowrap sm:col-start-auto sm:mt-0.5', TAG_CLASS[item.state])}>
        {STATUS[item.state](item)}
      </span>
    </li>
  )
}

type Reply = { to: string; text: string; typing: boolean }

export function LiveFeed() {
  const reduce = useReducedMotion()
  // Стартовые сообщения со временем «пару минут назад», чтобы лента выглядела живой.
  const [entries, setEntries] = useState<Entry[]>(() =>
    FEED.slice(0, FEED_START).map((item, i) => ({ key: i, item, time: clock((FEED_START - i) * 2 - 1), isNew: false })),
  )
  const [reply, setReply] = useState<Reply>({ to: FEED[3].name, text: FEED[3].reply!, typing: false })
  const [count, setCount] = useState(12)
  const feedRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (reduce || !feedRef.current) return
    let cursor = FEED_START
    let inView = true
    const timers: number[] = []
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting })
    observer.observe(feedRef.current)

    const interval = window.setInterval(() => {
      if (document.hidden || !inView) return
      const item = FEED[cursor % FEED.length]
      const entry: Entry = { key: cursor, item, time: clock(), isNew: true }
      cursor += 1
      setEntries((prev) => [...prev, entry].slice(-MAX_VISIBLE))
      setCount((n) => n + 1)
      if (item.state === 'lead' && item.reply) {
        const text = item.reply
        timers.push(window.setTimeout(() => {
          setReply({ to: item.name, text, typing: true })
          timers.push(window.setTimeout(() => setReply({ to: item.name, text, typing: false }), 1500))
        }, 900))
      }
    }, TICK_MS)

    return () => {
      observer.disconnect()
      clearInterval(interval)
      timers.forEach(clearTimeout)
    }
  }, [reduce])

  // Высота панели фиксирована: длина ответа AI меняется, но hero не «прыгает» — сжимается только лента.
  return (
    <div
      className="notch relative flex h-[600px] flex-col bg-ink-2 ring-1 ring-inset ring-white/10 [--notch:28px] sm:h-[560px]"
      role="img"
      aria-label="Пример работы: OSTRO AI находит запрос «Ищу специалиста по рекламе» с совпадением 92% и готовит ответ в личку"
    >
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4 font-mono text-xs text-bone sm:px-5" aria-hidden>
        <span className="size-1.5 animate-rec rounded-full bg-signal-hot" />
        <span>OSTRO AI / live</span>
        <span className="ml-auto pr-4 text-smoke">сейчас</span>
      </div>

      <ol ref={feedRef} className="feed-fade flex min-h-0 flex-1 flex-col justify-end overflow-hidden pb-1.5" aria-hidden>
        {entries.map((entry) => <Message key={entry.key} entry={entry} />)}
      </ol>

      <div className="mx-2 mb-3 bg-iris/10 p-4 ring-1 ring-inset ring-iris/40 sm:mx-3" aria-hidden>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-xs">
          <span className="text-iris-hot">✦ AI-сейлз подготовил ответ</span>
          <span className="text-bone">→ {reply.to}</span>
          <span className={cx('ml-auto text-[11px]', reply.typing ? 'text-bone' : 'bg-iris-btn px-2 py-1 text-white')}>
            {reply.typing ? 'пишет…' : 'готово'}
          </span>
        </div>
        <p className="mt-2.5 min-h-[3em] text-sm leading-normal text-paper">
          {reply.typing ? (
            <span className="inline-flex gap-1 pt-2">
              {[0, 0.15, 0.3].map((delay) => (
                <i key={delay} className="typing-dot size-1.5 rounded-full bg-iris-hot" style={{ animationDelay: `${delay}s` }} />
              ))}
            </span>
          ) : (
            `«${reply.text}»`
          )}
        </p>
        <span className="mt-2 block font-mono text-[11px] text-smoke">Промпт: продажа услуги</span>
      </div>

      <div className="flex justify-between gap-4 border-t border-white/10 px-4 pt-3.5 pb-4 font-mono text-xs text-smoke sm:px-5" aria-hidden>
        <span className="flex items-center gap-2"><i className="size-1.5 bg-signal" />3 чата мониторятся</span>
        <span><b className="font-normal text-paper tabular-nums">{count}</b> сообщений сегодня</span>
      </div>
    </div>
  )
}
