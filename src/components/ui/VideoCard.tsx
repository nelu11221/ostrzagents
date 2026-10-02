import { useState } from 'react'
import { cx } from './primitives'

type Props = {
  src: string
  poster: string
  title: string
  duration: string
  // Цвет кнопки и рамки: класс фона (bg-signal-btn / bg-iris-btn) и кольца
  accent: string
  ring: string
  className?: string
}

// Видео грузится только по клику: до этого — лёгкий постер. preload="none", чтобы не тянуть десятки мегабайт заранее.
export function VideoCard({ src, poster, title, duration, accent, ring, className }: Props) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={cx('notch relative aspect-video overflow-hidden bg-ink-3 ring-1 ring-inset [--notch:24px]', ring, className)}>
      {playing ? (
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="none"
          className="absolute inset-0 size-full bg-black object-contain"
          aria-label={title}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full text-left"
          aria-label={`${title} — смотреть видео, ${duration}`}
        >
          <img src={poster} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          <span className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/20 to-ink/30" />
          <span
            className={cx(
              'absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,.6)] transition-transform duration-300 group-hover:scale-110 sm:size-20',
              accent,
            )}
          >
            <svg viewBox="0 0 24 24" className="ml-1 size-6 sm:size-7" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15L20 12Z" />
            </svg>
          </span>
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
            <span className="font-display text-sm font-semibold tracking-tight text-white sm:text-base">{title}</span>
            <span className="shrink-0 bg-ink/80 px-2 py-1 font-mono text-xs text-paper">▷ {duration}</span>
          </span>
        </button>
      )}
    </div>
  )
}
