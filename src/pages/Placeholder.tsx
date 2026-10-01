import { Container, Label, Logo } from '../components/ui/primitives'

// Временная заглушка для разделов, которые ещё не перенесены на React.
export default function Placeholder({ title }: { title: string }) {
  return (
    <main className="grain grid-lines grid min-h-svh place-items-center">
      <Container className="relative z-10 text-center">
        <a href="/" className="inline-block"><Logo /></a>
        <Label className="mt-12 justify-center">в разработке</Label>
        <h1 className="mt-5 font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold tracking-[-0.03em]">{title}</h1>
        <a href="/" className="mt-8 inline-block font-mono text-xs text-smoke hover:text-paper">← На главную</a>
      </Container>
    </main>
  )
}
