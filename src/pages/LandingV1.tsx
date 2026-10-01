import { useCallback, useEffect, useState } from 'react'
import { Closing, Footer, MobileCta } from '../components/landing/Closing'
import { LeadgenDemo, SalesDemo } from '../components/landing/Demos'
import { Header } from '../components/landing/Header'
import { Hero } from '../components/landing/Hero'
import { HowItWorks, Ticker } from '../components/landing/HowItWorks'
import { ProductSection, type PlansStatus } from '../components/landing/ProductSection'
import { Together } from '../components/landing/Together'
import { DEFAULT_CONTACT, ru } from '../content/ru'
import { fetchPublicConfig, type Plan } from '../lib/api'

export default function LandingV1() {
  const [contact, setContact] = useState(DEFAULT_CONTACT)
  const [plans, setPlans] = useState<Plan[]>([])
  const [status, setStatus] = useState<PlansStatus>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchPublicConfig(controller.signal)
      .then((config) => {
        setPlans(config.plans ?? [])
        if (config.contact) setContact(config.contact)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error('Не удалось загрузить тарифы', error)
        setStatus('error')
      })
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setStatus('loading')
    setAttempt((n) => n + 1)
  }, [])

  const contactUrl = `https://t.me/${contact}`
  const planById = (id: string) => plans.find((p) => p.id === id)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-signal-btn focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>
      <Header contactUrl={contactUrl} />
      <main id="main">
        <Hero contactUrl={contactUrl} />
        <Ticker />
        <HowItWorks />
        <ProductSection
          id="leadgen"
          tone="leadgen"
          content={ru.leadgen}
          demo={<LeadgenDemo />}
          plan={planById('leadgen')}
          status={status}
          onRetry={retry}
          contactUrl={contactUrl}
        />
        <ProductSection
          id="sales"
          tone="sales"
          content={ru.sales}
          demo={<SalesDemo />}
          plan={planById('sales')}
          status={status}
          onRetry={retry}
          contactUrl={contactUrl}
          reverse
          className="bg-ink-2"
        />
        <Together plans={plans} status={status} onRetry={retry} contactUrl={contactUrl} />
        <Closing contactUrl={contactUrl} />
      </main>
      <Footer contact={contact} />
      <MobileCta contactUrl={contactUrl} />
    </>
  )
}
