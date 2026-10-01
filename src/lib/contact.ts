// Ссылка на Telegram-контакт с готовым текстом сообщения: менеджер видит, с какой кнопки пришёл человек.
// Telegram подставляет text как черновик; старые клиенты просто откроют чат.
export function tgLink(contact: string, text?: string) {
  const base = `https://t.me/${contact}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
