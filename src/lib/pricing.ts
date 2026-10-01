// Логика цен — та же, что в старом лендинге (static/landing.js на бэкенде).
import type { Plan, PlanLimits } from './api'

export type Months = 1 | 3 | 6 | 12

export const PERIODS: Record<Months, { label: string; short: string; discount: number }> = {
  1: { label: 'за месяц', short: '1 месяц', discount: 0 },
  3: { label: 'за 3 месяца', short: '3 месяца', discount: 0.05 },
  6: { label: 'за 6 месяцев', short: '6 месяцев', discount: 0.10 },
  12: { label: 'за 12 месяцев', short: '12 месяцев', discount: 0.15 },
}
export const MONTH_OPTIONS: Months[] = [1, 3, 6, 12]

export const TRIAL_PRICE = 15
export const TRIAL_PLANS = ['leadgen', 'sales']

export const LIMIT_LABELS: Record<keyof PlanLimits, string> = {
  leads: 'AI-проверок в месяц',
  sales_messages: 'AI-сообщений в месяц',
  chats: 'Telegram-чатов',
}

// Скидка за длинный срок, итог округляется до $5.
export function priceFor(monthlyPrice: number, months: Months) {
  if (months === 1) return monthlyPrice
  return Math.round((monthlyPrice * months * (1 - PERIODS[months].discount)) / 5) * 5
}

export function planLimits(plan: Plan) {
  return (Object.entries(plan.limits ?? {}) as [keyof PlanLimits, number][])
    .filter(([key, value]) => Number(value) > 0 && LIMIT_LABELS[key])
}

export const formatNumber = (value: number) => Number(value).toLocaleString('ru-RU')
