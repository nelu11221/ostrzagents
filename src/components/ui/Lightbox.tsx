import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Arrow, cx } from './primitives'

// video — вместо картинки показываем ролик (src тогда служит постером)
type Image = { src: string; alt: string; video?: string }

type Props = {
  images: Image[]
  index: number | null
  onChange: (index: number | null) => void
}

// Просмотр скринов поверх страницы: Esc / клик по фону — закрыть, ← → — листать.
export function Lightbox({ images, index, onChange }: Props) {
  const open = index !== null
  const count = images.length

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange(((index ?? 0) + 1) % count)
      if (e.key === 'ArrowLeft') onChange(((index ?? 0) - 1 + count) % count)
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, index, count, onChange])

  if (!open) return null
  const image = images[index]

  const navButton = 'grid size-12 shrink-0 place-items-center bg-white/10 text-paper ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20'

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center gap-3 bg-ink/90 p-4 backdrop-blur-sm sm:gap-6"
      onClick={() => onChange(null)}
    >
      {count > 1 && (
        <button
          type="button"
          aria-label="Предыдущий скрин"
          className={cx(navButton, 'max-sm:absolute max-sm:bottom-4 max-sm:left-4')}
          onClick={(e) => { e.stopPropagation(); onChange((index - 1 + count) % count) }}
        >
          <Arrow className="size-5 rotate-180" />
        </button>
      )}

      <figure className="flex max-h-full min-w-0 flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {image.video ? (
          <video
            key={image.video}
            src={image.video}
            poster={image.src}
            controls
            autoPlay
            playsInline
            className="max-h-[calc(100svh-7rem)] w-auto max-w-full bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)]"
          />
        ) : (
          <img src={image.src} alt={image.alt} className="max-h-[calc(100svh-7rem)] w-auto max-w-full object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)]" />
        )}
        <figcaption className="mt-3 text-center font-mono text-xs text-bone">
          {image.alt} · {index + 1} / {count}
        </figcaption>
      </figure>

      {count > 1 && (
        <button
          type="button"
          aria-label="Следующий скрин"
          className={cx(navButton, 'max-sm:absolute max-sm:right-4 max-sm:bottom-4')}
          onClick={(e) => { e.stopPropagation(); onChange((index + 1) % count) }}
        >
          <Arrow className="size-5" />
        </button>
      )}

      <button
        type="button"
        aria-label="Закрыть"
        className="absolute top-4 right-4 grid size-11 place-items-center bg-white/10 text-paper ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20"
        onClick={() => onChange(null)}
      >
        <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M5 5l10 10M15 5 5 15" strokeLinecap="square" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}
