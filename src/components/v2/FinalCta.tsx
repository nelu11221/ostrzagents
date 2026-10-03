import { v2 } from '../../content/ru'
import { Button, Container, Reveal, TelegramIcon } from '../ui/primitives'

// Финал: что произойдёт после клика (3 шага) + основной и мягкий CTA.
export function FinalCta({ trialHref, consultHref }: { trialHref: string; consultHref: string }) {
  const f = v2.final
  return (
    <section id="lead" className="border-t border-white/10 bg-ink-2 py-10 sm:py-24 lg:py-32">
      <Container>
        <Reveal className="notch relative overflow-hidden bg-linear-to-br from-signal-btn to-iris-btn p-5 text-white [--notch:28px] sm:p-10 sm:[--notch:36px] lg:p-14">
          <div
            className="pointer-events-none absolute -top-40 -right-40 size-[520px] opacity-40 [background:repeating-radial-gradient(circle,transparent_0_54px,rgb(255_255_255/.18)_54px_55px)] [mask-image:radial-gradient(closest-side,black_20%,transparent)]"
            aria-hidden
          />
          <div className="relative">
            <p className="label flex items-center gap-2 text-white/70">
              <span className="inline-block size-1.5 bg-white" aria-hidden />
              {f.label}
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.45rem,3.8vw,3rem)] leading-[1.05] sm:mt-5 font-semibold tracking-[-0.03em] text-balance">
              {f.title}
            </h2>

            <ol className="mt-6 grid gap-px bg-white/20 sm:mt-10 sm:grid-cols-3">
              {f.steps.map((s, i) => (
                <li key={s.title} className="flex items-baseline gap-3 bg-ink/25 px-4 py-3 backdrop-blur-sm sm:block sm:p-5">
                  <span className="font-mono text-xs text-white/60">0{i + 1}</span>
                  <div>
                    <p className="font-display text-sm font-semibold tracking-tight sm:mt-3 sm:text-base">{s.title}</p>
                    <p className="mt-0.5 text-xs text-white/75 sm:mt-1 sm:text-sm">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-2 sm:mt-10 sm:flex-row sm:gap-3">
              <Button href={trialHref} target="_blank" rel="noreferrer" variant="paper" size="lg">
                {f.cta}
              </Button>
              <a
                href={consultHref}
                target="_blank"
                rel="noreferrer"
                className="notch inline-flex h-12 items-center justify-center gap-3 px-6 font-display text-[15px] font-semibold ring-1 ring-white/40 ring-inset transition-colors [--notch:16px] hover:bg-white/10 sm:h-16 sm:text-base"
              >
                <TelegramIcon className="size-5" /> {f.secondary}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
