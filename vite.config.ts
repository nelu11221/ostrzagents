import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Бэкенд (FastAPI) на VPS. Локально (dev и preview) проксируем /api, чтобы не упираться в CORS.
const API_TARGET = process.env.VITE_API_TARGET ?? 'http://5.39.249.108:8010'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
    },
  },
  // Локальный просмотр продакшен-сборки (npm run preview): тот же прокси на API
  preview: {
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
    },
  },
})
