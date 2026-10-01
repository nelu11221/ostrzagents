import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// three.js (~130 КБ gzip) грузится отдельным чанком и только когда секция рядом с экраном
const PixelBlast = lazy(() => import('./PixelBlast.jsx'))

type Props = { className?: string; density?: number; opacity?: number }
type Mode = 'pending' | 'webgl' | 'static' | 'css'

function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

// Фоновый пиксельный эффект в фирменном синем.
// webgl — анимированный PixelBlast; static — тот же рисунок без движения (prefers-reduced-motion);
// css — запасной пиксельный узор, если WebGL недоступен (отключено аппаратное ускорение и т.п.).
// Текущий режим виден в атрибуте data-pixel — удобно для диагностики.
export function PixelBg({ className = '', density = 1, opacity = 0.55 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('pending')
  const [near, setNear] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMode(!hasWebGL2() ? 'css' : reduced ? 'static' : 'webgl')

    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const animated = mode === 'webgl'

  return (
    <div ref={ref} aria-hidden data-pixel={mode} className={`absolute inset-0 ${className}`} style={{ opacity }}>
      {mode === 'css' && <div className="pixel-fallback absolute inset-0" />}
      {near && (mode === 'webgl' || mode === 'static') && (
        <Suspense fallback={null}>
          <PixelBlast
            className=""
            style={undefined}
            variant="square"
            color="#3374ff"
            pixelSize={mobile ? 5 : 4}
            patternScale={2.5}
            patternDensity={density}
            pixelSizeJitter={0.4}
            enableRipples={animated}
            rippleSpeed={0.35}
            rippleThickness={0.12}
            rippleIntensityScale={1.4}
            liquid={animated && !mobile}
            liquidStrength={0.1}
            liquidRadius={1.1}
            liquidWobbleSpeed={4.5}
            speed={animated ? 0.5 : 0}
            edgeFade={0.25}
            antialias={false}
            transparent
          />
        </Suspense>
      )}
    </div>
  )
}
