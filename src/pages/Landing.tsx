import { useState } from 'react'
import { Footer, MobileCta } from '../components/landing/Closing'
import { Header } from '../components/landing/Header'
import { Ticker } from '../components/landing/HowItWorks'
import { Faq } from '../components/v2/Faq'
import { FinalCta } from '../components/v2/FinalCta'
import { Hero } from '../components/v2/Hero'
import { Modules, type ModuleTab } from '../components/v2/Modules'
import { Pricing } from '../components/v2/Pricing'
import { Screens } from '../components/v2/Screens'
import { v2 } from '../content/ru'
import { usePublicConfig } from '../lib/usePublicConfig'
import { tgLink } from '../lib/contact'

// Вариант 2: путь посетителя «конвейер продукта → модули → экраны продукта → тарифы → возражения → запуск».
// Предыдущая версия лендинга доступна на /v1.
export default function Landing() {
  const { contact } = usePublicConfig()
  const [tab, setTab] = useState<ModuleTab>('leadgen')

  const msg = v2.messages
  const trialHref = tgLink(contact, msg.trial)
  const consultHref = tgLink(contact, msg.consult)
  const moduleTrialHref = (id: ModuleTab) => tgLink(contact, id === 'leadgen' ? msg.trialLeadgen : msg.trialSales)
  const planHref = (name: string, period: string) => tgLink(contact, msg.plan(name, period))

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
        <Modules tab={tab} onTab={setTab} trialHref={moduleTrialHref} />
        <Screens />
        <Pricing planHref={planHref} />
        <Faq />
        <FinalCta trialHref={trialHref} consultHref={consultHref} />
      </main>
      <Footer contact={contact} nav={v2.nav} />
      <MobileCta contactUrl={trialHref} label={v2.mobileCta} />
    </>
  )
}
