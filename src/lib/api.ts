// Типы и запросы к бэкенду Leadroom (FastAPI). Документация: http://5.39.249.108:8010/docs

export type PlanLimits = {
  leads?: number
  sales_messages?: number
  chats?: number
}

export type Plan = {
  id: string
  name: string
  price: number
  unit: string
  tag: string
  description: string
  features: string[]
  limits: PlanLimits
  featured?: boolean
}

export type PublicConfig = {
  contact?: string
  plans: Plan[]
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export function fetchPublicConfig(signal?: AbortSignal) {
  return getJson<PublicConfig>('/api/public/config', { signal })
}
