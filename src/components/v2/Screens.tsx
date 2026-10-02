import { screens } from '../../content/ru'
import { TONE } from '../landing/theme'
import { Container, Reveal, SectionHead, cx } from '../ui/primitives'

// Реальные экраны из видео вместо абстрактного «кому подходит»: посетитель видит продукт изнутри.
export function Screens() {
  const s = screens
  return (
    <section id="screens" className="bg-paper py-24 text-ink lg:py-28">
      <Container>
        <SectionHead label={s.label} title={s.title} sub={s.sub} tone="light" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((item, i) => {
            const tone = TONE[item.tone]
            return (
              <Reveal key={item.src} delay={i * 0.06}>
                <figure className="flex h-full flex-col">
                  <div className="notch relative aspect-[3/4] overflow-hidden bg-ink [--notch:20px]">
                    <img
                      src={item.src}
                      alt={`${item.product}: ${item.title}`}
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.03]"
                    />
                    <span className={cx('absolute top-0 left-0 px-2.5 py-1.5 font-mono text-[11px] text-white', tone.solid)}>{item.product}</span>
                  </div>
                  <figcaption className="mt-4">
                    <p className="font-display text-base font-semibold tracking-tight">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{item.text}</p>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
