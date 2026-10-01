# OSTRO AI — Leadroom frontend

Фронтенд продукта OSTRO AI (Лидоген + AI-сейлз для Telegram).
React 19 + Vite + Tailwind CSS v4 + Motion, TypeScript. Дизайн-система — как на сайте агентства OSTRO AI.

```bash
npm install
npm run dev      # http://localhost:5173, /api проксируется на бэкенд
npm run build    # сборка в dist/
npm run preview
```

Адрес бэкенда для dev-прокси можно переопределить: `VITE_API_TARGET=http://… npm run dev`.

## Маршруты

- `/` — лендинг (вариант 2: конвейер → модули → кому подходит → тарифы → FAQ → запуск)
- `/v1` — предыдущий вариант лендинга (для сравнения)
- `/app`, `/admin` — кабинет (Telegram Mini App) и админка — в разработке
- всё остальное — страница 404

## Структура

- `src/content/ru.ts` — весь текст. Пункты с пометкой CONFIRM нужно подтвердить перед запуском
- `src/components/ui/primitives.tsx` — кнопки, типографика, Reveal, Logo
- `src/components/effects/` — пиксельный фон (PixelBlast / three.js, грузится лениво)
- `src/components/landing/` — секции v1 и общие части (Header, LiveFeed, Demos, theme)
- `src/components/v2/` — секции текущего лендинга
- `src/lib/api.ts` — запросы к бэкенду (`/api/public/config` — тарифы и контакт)
- `src/lib/pricing.ts` — расчёт цен со скидками за срок
- `src/lib/contact.ts` — ссылки в Telegram с готовым текстом сообщения

## Цвета продуктов

Лидоген — фирменный синий (`signal`), AI-сейлз — фиолетовый (`iris`), связка — градиент `signal → iris`.

## Деплой

Это SPA: сервер должен отдавать `index.html` на любой неизвестный путь, иначе не будут работать `/v1` и страница 404.
