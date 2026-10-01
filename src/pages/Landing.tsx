import { useCallback, useEffect, useState } from 'react'
import { Footer, MobileCta } from '../components/landing/Closing'
import { Header } from '../components/landing/Header'
import { Ticker } from '../components/landing/HowItWorks'
import { Cases } from '../components/v2/Cases'
import { Faq } from '../components/v2/Faq'
import { FinalCta } from '../components/v2/FinalCta'
import { Hero } from '../components/v2/Hero'
import { Modules, type ModuleTab } from '../components/v2/Modules'
import { Pricing } from '../components/v2/Pricing'
import { DEFAULT_CONTACT, v2 } from '../content/ru'
import { fetchPublicConfig, type Plan } from '../lib/api'
import { tgLink } from '../lib/contact'

// Вариант 2: путь посетителя «конвейер продукта → модули → кому подходит → тарифы → возражения → запуск».
// Предыдущая версия лендинга доступна на /v1.
export default function Landing() {
  const [contact, setContact] = useState(DEFAULT_CONTACT)
  const [plans, setPlans] = useState<Plan[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [tab, setTab] = useState<ModuleTab>('leadgen')

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

  const msg = v2.messages
  const trialHref = tgLink(contact, msg.trial)
  const consultHref = tgLink(contact, msg.consult)
  const moduleTrialHref = (id: ModuleTab) => tgLink(contact, id === 'leadgen' ? msg.trialLeadgen : msg.trialSales)
  const planHref = (plan: Plan, period: string) => tgLink(contact, msg.plan(plan.name, period))

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-signal-btn focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>
      <Header contactUrl={consultHref} ctaHref={trialHref} ctaLabel={v2.headerCta} nav={v2.nav} />
      <main id="main">
        <Hero trialHref={trialHref} />
        <Ticker />
        <Modules tab={tab} onTab={setTab} plans={plans} trialHref={moduleTrialHref} />
        <Cases />
        <Pricing plans={plans} status={status} onRetry={retry} planHref={planHref} />
        <Faq />
        <FinalCta trialHref={trialHref} consultHref={consultHref} />
      </main>
      <Footer contact={contact} nav={v2.nav} />
      <MobileCta contactUrl={trialHref} label={v2.mobileCta} />
    </>
  )
}
