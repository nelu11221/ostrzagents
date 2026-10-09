// POST /api/lead — принимает заявку с сайта и доставляет её менеджеру.
// Переменные окружения Netlify (нужен хотя бы один канал):
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID — бот пишет заявку в чат (можно несколько id через запятую)
//   GOOGLE_SHEETS_WEBHOOK_URL            — веб-приложение Apps Script, пишет строку в таблицу
//   GOOGLE_SHEETS_SECRET                 — необязательный общий секрет для таблицы
// Ключи остаются на сервере и не попадают в браузер.

const LIMITS = { name: 100, method: 30, contact: 200, niche: 200, intent: 300, page: 500 }
const METHODS = { telegram: 'Telegram', whatsapp: 'WhatsApp', phone: 'Звонок' }

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function sendTelegram(lead, utm) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chats = (process.env.TELEGRAM_CHAT_ID ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!token || !chats.length) return null

  const utmLine = Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(' · ')
  const rows = [
    '🔥 <b>Новая заявка — OSTRO AI</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>${escapeHtml(METHODS[lead.method] ?? lead.method)}:</b> ${escapeHtml(lead.contact)}`,
    lead.niche ? `<b>Ниша:</b> ${escapeHtml(lead.niche)}` : null,
    lead.intent ? `<b>Кнопка:</b> ${escapeHtml(lead.intent)}` : null,
    utmLine ? `<b>Метки:</b> ${escapeHtml(utmLine)}` : null,
  ].filter((r) => r !== null)

  const results = await Promise.all(
    chats.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text: rows.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
      })
        .then((r) => r.ok || (console.error('[lead] telegram rejected', chat_id, r.status), false))
        .catch((err) => (console.error('[lead] telegram unreachable', err), false)),
    ),
  )
  return results.some(Boolean)
}

async function sendSheet(lead, utm) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!url) return null
  try {
    // Apps Script выполняет doPost и отвечает 302 на адрес с результатом. Идём туда сами GET-запросом:
    // fetch в Node повторяет по редиректу POST, и Google отвечает 404 (хотя строка уже записана).
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, source: 'agents', locale: 'ru', utm, secret: process.env.GOOGLE_SHEETS_SECRET ?? '' }),
      redirect: 'manual',
    })
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) res = await fetch(location)
    const out = await res.json().catch(() => ({}))
    if (!res.ok || !out.ok) console.error('[lead] sheet rejected', res.status, out)
    return res.ok && !!out.ok
  } catch (err) {
    console.error('[lead] sheet unreachable', err)
    return false
  }
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' })

  let data
  try {
    data = await req.json()
  } catch {
    return json(400, { ok: false, error: 'bad_json' })
  }

  // ловушка для ботов: людям поле не видно — делаем вид, что всё прошло
  if (data.company) return json(200, { ok: true })

  const lead = {}
  for (const [key, max] of Object.entries(LIMITS)) lead[key] = String(data[key] ?? '').trim().slice(0, max)
  if (!lead.name || lead.contact.length < 3) return json(422, { ok: false, error: 'invalid' })

  const utm = {}
  for (const [k, v] of Object.entries(data.utm ?? {}).slice(0, 10)) utm[String(k).slice(0, 40)] = String(v).slice(0, 200)

  const delivered = (await Promise.all([sendTelegram(lead, utm), sendSheet(lead, utm)])).filter((r) => r !== null)
  if (!delivered.length) {
    console.error('[lead] no delivery channel configured')
    return json(500, { ok: false, error: 'not_configured' })
  }
  // заявка считается принятой, если дошла хотя бы до одного канала
  if (!delivered.some(Boolean)) return json(502, { ok: false, error: 'delivery_failed' })
  return json(200, { ok: true })
}
