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
          {/* Постер — готовая обложка со своим текстом: поверх только крупная кнопка Play по центру и длительность */}
          <span className="absolute inset-0 bg-ink/10 transition-colors duration-300 group-hover:bg-ink/0" />
          <span
            className={cx(
              'absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,.8)] ring-4 ring-white/25 transition-transform duration-300 group-hover:scale-110 sm:size-20',
              accent,
            )}
          >
            <svg viewBox="0 0 24 24" className="ml-1 size-7 sm:size-8" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15L20 12Z" />
            </svg>
          </span>
          <span className="absolute right-3 bottom-3 bg-ink/80 px-2 py-1 font-mono text-xs text-paper sm:right-4 sm:bottom-4">▷ {duration}</span>
        </button>
      )}
    </div>
  )
}
