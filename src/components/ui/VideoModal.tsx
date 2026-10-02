import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { products } from '../../content/ru'
import { TONE } from '../landing/theme'
import { cx } from './primitives'

type ProductId = 'leadgen' | 'sales'

// Ролик Антона поверх страницы: Esc / клик по фону — закрыть.
export function VideoModal({ product, onClose }: { product: ProductId | null; onClose: () => void }) {
  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [product, onClose])

  if (!product) return null
  const video = products[product].video

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-[100] grid place-items-center bg-ink/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <video src={video.src} poster={video.poster} controls autoPlay playsInline className="aspect-video w-full bg-black" />
        <p className="mt-3 text-center font-mono text-xs text-bone">{video.title}</p>
      </div>
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute top-4 right-4 grid size-11 place-items-center bg-white/10 text-paper ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M5 5l10 10M15 5 5 15" strokeLinecap="square" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}

// Кнопка «Как это выглядит» — открывает ролик нужного модуля, не уводя со страницы.
export function WatchButton({ product, label, className }: { product: ProductId; label?: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const p = products[product]
  const tone = TONE[product]
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cx(
          'group inline-flex items-center gap-3 py-1.5 pr-4 pl-1.5 text-left ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/5',
          className,
        )}
      >
        <span className={cx('grid size-9 shrink-0 place-items-center rounded-full text-white transition-transform group-hover:scale-110', tone.solid)}>
          <svg viewBox="0 0 24 24" className="ml-0.5 size-4" fill="currentColor" aria-hidden>
            <path d="M7 4.5v15L20 12Z" />
          </svg>
        </span>
        <span className="font-display text-sm font-semibold tracking-tight">
          {label ?? `Как выглядит ${p.name}`}
          <span className="ml-2 font-mono text-xs font-normal text-smoke">{p.video.duration}</span>
        </span>
      </button>
      <VideoModal product={open ? product : null} onClose={() => setOpen(false)} />
    </>
  )
}
