import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// При смене страницы — наверх; при переходе на якорь ("/#pricing") — к секции, когда она отрисуется.
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    let tries = 0
    const timer = window.setInterval(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target || ++tries > 20) {
        window.clearInterval(timer)
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
    return () => window.clearInterval(timer)
  }, [pathname, hash])

  return null
}
