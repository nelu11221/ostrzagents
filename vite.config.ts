import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Бэкенд (FastAPI) на VPS. Локально (dev и preview) проксируем /api, чтобы не упираться в CORS.
const API_TARGET = process.env.VITE_API_TARGET ?? 'http://5.39.249.108:8010'
// Заявки — в Netlify Function (netlify/functions/lead.mjs). Локально её поднимает `netlify functions:serve` (порт 9999).
const LEAD_TARGET = process.env.LEAD_FUNCTIONS_TARGET ?? 'http://localhost:9999'
const proxy = {
  '/api/lead': { target: LEAD_TARGET, rewrite: () => '/.netlify/functions/lead' },
  '/api': { target: API_TARGET, changeOrigin: true },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy },
  // Локальный просмотр продакшен-сборки (npm run preview): тот же прокси на API
  preview: { proxy },
})
