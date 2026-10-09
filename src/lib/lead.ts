export type LeadPayload = {
  name: string
  method: string
  contact: string
  niche: string
  intent: string // с какой кнопки пришёл человек — текст её готового сообщения в Telegram
  page: string
  utm: Record<string, string>
  company: string // ловушка для ботов: должно остаться пустым
}

export function readUtm(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const [key, value] of params) {
    if (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid' || key === 'yclid') utm[key] = value
  }
  return utm
}

// В продакшене заявки идут в Netlify Function /api/lead (netlify/functions/lead.mjs) → Telegram-бот и/или Google-таблица.
// VITE_LEAD_ENDPOINT переопределяет адрес; в dev без него форма работает в демо-режиме.
const endpoint = (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) ?? (import.meta.env.PROD ? '/api/lead' : undefined)

export async function submitLead(payload: LeadPayload): Promise<void> {
  if (!endpoint) {
    console.info('[lead] демо-режим: заявка не отправлена', payload)
    await new Promise((r) => setTimeout(r, 700))
    return
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Lead endpoint responded ${res.status}`)
}
