// Базовые элементы дизайн-системы OSTRO AI — те же, что на сайте агентства (github.com/nelu11221/OstroAI).
import { motion, useReducedMotion } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

type ButtonProps = ComponentProps<'a'> & {
  variant?: 'signal' | 'iris' | 'duo' | 'ghost' | 'paper' | 'ink'
  size?: 'md' | 'lg'
}

export function Button({ variant = 'signal', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <a
      {...rest}
      className={cx(
        'group notch inline-flex items-center justify-center gap-3 font-display font-semibold tracking-tight transition-[background-color,color,transform] duration-200 active:translate-y-px',
        size === 'lg' ? 'h-16 px-5 text-[15px] sm:px-8 sm:text-base [--notch:16px]' : 'h-12 px-6 text-sm [--notch:12px]',
        variant === 'signal' && 'bg-signal-btn text-white hover:bg-signal',
        variant === 'iris' && 'bg-iris-btn text-white hover:bg-iris',
        variant === 'duo' && 'bg-linear-to-r from-signal-btn to-iris-btn text-white hover:from-signal hover:to-iris',
        variant === 'paper' && 'bg-paper text-ink hover:bg-white',
        variant === 'ink' && 'bg-ink text-paper hover:bg-ink-3',
        variant === 'ghost' && 'bg-white/5 text-paper ring-1 ring-inset ring-white/15 hover:bg-white/10',
        className,
      )}
    >
      {children}
      <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  )
}

export function Arrow({ className, down }: { className?: string; down?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cx('size-4 shrink-0', down && 'rotate-90', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M3 10h13M11 4.5 16.5 10 11 15.5" strokeLinecap="square" />
    </svg>
  )
}

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cx('size-5 shrink-0', className)} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  )
}

export function Label({
  children,
  tone = 'dark',
  dot = 'bg-signal',
  className,
}: {
  children: ReactNode
  tone?: 'dark' | 'light'
  dot?: string
  className?: string
}) {
  return (
    <p className={cx('label flex items-center gap-2', tone === 'dark' ? 'text-bone' : 'text-ink/60', className)}>
      <span className={cx('inline-block size-1.5', dot)} aria-hidden />
      {children}
    </p>
  )
}

export function SectionHead({
  label,
  title,
  sub,
  tone = 'dark',
  dot,
  className,
}: {
  label: string
  title: ReactNode
  sub?: string
  tone?: 'dark' | 'light'
  dot?: string
  className?: string
}) {
  return (
    <Reveal className={cx('max-w-3xl', className)}>
      <Label tone={tone} dot={dot}>{label}</Label>
      <h2 className="mt-5 font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-balance">
        {title}
      </h2>
      {sub && <p className={cx('mt-5 max-w-xl text-lg leading-relaxed', tone === 'dark' ? 'text-bone' : 'text-ink/70')}>{sub}</p>}
    </Reveal>
  )
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10', className)}>{children}</div>
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2 font-display text-lg font-bold tracking-[-0.04em]', className)}>
      <LogoMark className="size-7" />
      OSTRO<span className="text-signal">AI</span>
    </span>
  )
}

// Знак OSTRO AI: синий квадрат с «О». Тот же, что public/logo.svg (фавикон).
export function LogoMark({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={cx('shrink-0', className)} aria-hidden>
      {!mono && <rect width="64" height="64" rx="14" fill="#2433C4" />}
      <g transform="translate(32 32) scale(1.0476190476190477) translate(-30 -36)" fill={mono ? 'currentColor' : '#fff'}>
        <circle cx="26" cy="34" r="13.5" fill="none" stroke={mono ? 'currentColor' : '#fff'} strokeWidth="7" />
        <path d="M41.6 28.32 Q44.5 40 51 55 Q42 51 33.79 48.66 A16.6 16.6 0 0 0 41.6 28.32 Z" />
        <circle cx="26" cy="34" r="4.5" />
      </g>
    </svg>
  )
}

export function TelegramIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.2 13.1l-4.9-1.5c-1.1-.3-1.1-1 .2-1.5L20.5 2.8c.9-.3 1.7.2 1.4 1.5Z" />
    </svg>
  )
}
