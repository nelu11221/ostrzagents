import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

// Внутренние ссылки ("/leadgen", "/#pricing") — через React Router без перезагрузки, внешние и якоря — обычным <a>.
export function SmartLink({ href = '', ...rest }: ComponentProps<'a'>) {
  if (href.startsWith('/')) return <Link to={href} {...rest} />
  return <a href={href} {...rest} />
}
