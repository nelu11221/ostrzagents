import { ru } from '../../content/ru'
import { cx } from '../ui/primitives'

function DemoCard({ title, accent, compact, children }: { title: string; accent: string; compact?: boolean; children: React.ReactNode }) {
  return (
    <div className="notch bg-ink-2 ring-1 ring-inset ring-white/10 [--notch:28px]">
      <div className={cx('flex items-center gap-2.5 border-b border-white/10 px-5 font-mono text-xs text-bone', compact ? 'py-3' : 'py-4')}>
        <span className={cx('size-1.5 animate-rec rounded-full', accent)} aria-hidden />
        {title}
      </div>
      <div className={cx('grid', compact ? 'gap-4 p-5' : 'gap-5 p-5 sm:p-6')}>{children}</div>
    </div>
  )
}

// Лидоген: ключевые слова и воронка отбора за день.
export function LeadgenDemo({ compact }: { compact?: boolean }) {
  const d = ru.leadgen.demo
  return (
    <DemoCard title={d.title} accent="bg-signal-hot" compact={compact}>
      <div className="flex flex-wrap gap-2" aria-label="Пример ключевых слов">
        {d.keywords.map((word) => (
          <span key={word} className="bg-signal/10 px-3 py-2 font-mono text-xs text-signal-hot ring-1 ring-inset ring-signal/30">
            {word}
          </span>
        ))}
      </div>
      <ol className="ring-1 ring-white/10" aria-label={d.title}>
        {d.funnel.map((row, i) => {
          const result = i === d.funnel.length - 1
          return (
            <li
              key={row.label}
              className={cx(
                'flex items-center justify-between gap-4 px-5 text-sm',
                compact ? 'py-3' : 'py-4',
                i > 0 && 'border-t border-white/10',
                result ? 'bg-signal-btn text-white' : 'text-bone',
              )}
              // Полоса показывает долю от исходного потока
              style={result ? undefined : { backgroundImage: `linear-gradient(90deg, rgb(51 116 255 / .12) ${i === 0 ? 100 : 40}%, transparent 0)` }}
            >
              <span>{row.label}</span>
              <b className="font-display text-lg font-semibold tabular-nums">{row.value}</b>
            </li>
          )
        })}
      </ol>
    </DemoCard>
  )
}

// AI-сейлз: короткий диалог в личке и передача менеджеру.
export function SalesDemo({ compact }: { compact?: boolean }) {
  const d = ru.sales.demo
  return (
    <DemoCard title={d.title} accent="bg-iris-hot" compact={compact}>
      <ul className="grid gap-3" aria-label={d.title}>
        {d.messages.map((m, i) => {
          const ai = m.from === 'ai'
          return (
            <li key={i} className={cx('flex', ai ? 'justify-end' : 'justify-start')}>
              <div
                className={cx(
                  'max-w-[85%] px-4 py-3 text-sm leading-snug',
                  ai ? 'notch bg-iris-btn text-white [--notch:10px]' : 'notch-bl bg-white/[0.06] text-paper [--notch:10px]',
                )}
              >
                {ai && <span className="mb-1 block font-mono text-[10px] tracking-[0.12em] text-white/70 uppercase">✦ AI-сейлз</span>}
                {m.text}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="flex items-center gap-2 border-t border-dashed border-white/15 pt-4 font-mono text-xs text-iris-hot">
        <span className="size-1.5 bg-iris" aria-hidden />
        {d.handoff}
      </p>
    </DemoCard>
  )
}
