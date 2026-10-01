import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_CONTACT } from '../content/ru'
import { fetchPublicConfig, type Plan } from './api'
import { FALLBACK_CONFIG } from './fallbackConfig'

export type ConfigStatus = 'loading' | 'ready' | 'error'

// Повторы при сбое API: бэкенд может кратко перезапускаться (рестарт контейнера).
const RETRY_DELAYS = [1500, 4000]

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason) }, { once: true })
  })

// Тарифы и контакт для лендинга. Если API так и не ответил — показываем снимок тарифов, а не ошибку.
export function usePublicConfig() {
  const [contact, setContact] = useState(DEFAULT_CONTACT)
  const [plans, setPlans] = useState<Plan[]>([])
  const [status, setStatus] = useState<ConfigStatus>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function load() {
      for (let i = 0; ; i++) {
        try {
          return await fetchPublicConfig(signal)
        } catch (error) {
          if (signal.aborted) throw error
          if (i >= RETRY_DELAYS.length) throw error
          await wait(RETRY_DELAYS[i], signal)
        }
      }
    }

    load()
      .catch((error: unknown) => {
        if (signal.aborted) throw error
        console.warn('API тарифов недоступен, показываем сохранённые тарифы', error)
        return FALLBACK_CONFIG
      })
      .then((config) => {
        setPlans(config.plans ?? [])
        if (config.contact) setContact(config.contact)
        setStatus(config.plans?.length ? 'ready' : 'error')
      })
      .catch(() => { /* запрос отменён при размонтировании */ })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setStatus('loading')
    setAttempt((n) => n + 1)
  }, [])

  return { contact, plans, status, retry }
}
