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
          {/* Постер — готовая обложка со своим текстом: ничего не пишем поверх, только кнопка и длительность по углам */}
          <span className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-ink/70 to-transparent" />
          <span
            className={cx(
              'absolute bottom-3 left-3 grid size-11 place-items-center rounded-full text-white shadow-[0_12px_30px_-8px_rgba(0,0,0,.7)] ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-110 sm:bottom-4 sm:left-4 sm:size-12',
              accent,
            )}
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15L20 12Z" />
            </svg>
          </span>
          <span className="absolute right-3 bottom-3 bg-ink/80 px-2 py-1 font-mono text-xs text-paper sm:right-4 sm:bottom-4">▷ {duration}</span>
        </button>
      )}
    </div>
  )
}
