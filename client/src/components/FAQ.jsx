import { useState } from 'react'
import { useLang } from '../context/LangContext'

const faqs = [
  { q: 'faq1-q', a: 'faq1-a' },
  { q: 'faq2-q', a: 'faq2-a' },
  { q: 'faq3-q', a: 'faq3-a' },
  { q: 'faq4-q', a: 'faq4-a' },
  { q: 'faq5-q', a: 'faq5-a' },
]

const faqTexts = {
  'faq1-q': 'Как выбрать подходящий маршрут?',
  'faq1-a': 'Используйте форму поиска: выберите тип транспорта, укажите откуда и куда, дату и количество пассажиров. Мы покажем лучшие варианты по цене и удобству.',
  'faq2-q': 'Какие документы нужны для поездки?',
  'faq2-a': 'Для международных маршрутов нужны действующий загранпаспорт и виза (при необходимости). Для внутренних — удостоверение личности или паспорт.',
  'faq3-q': 'Можно ли вернуть или обменять билет?',
  'faq3-a': 'Да. Большинство билетов можно вернуть за 24 часа до отправления с удержанием сервисного сбора. Условия зависят от перевозчика.',
  'faq4-q': 'Работаете ли вы с корпоративными клиентами?',
  'faq4-a': 'Да, у нас есть специальные корпоративные тарифы для групп от 10 человек. Свяжитесь с нами для индивидуального предложения.',
  'faq5-q': 'Как оплатить бронирование?',
  'faq5-a': 'Принимаем Visa/Mastercard, Kaspi Pay, Apple Pay и Google Pay. Оплата через защищённый SSL-шлюз.',
}

export default function FAQ() {
  const { t } = useLang()
  const [open, setOpen] = useState(null)

  const toggle = (i) => setOpen(prev => prev === i ? null : i)

  return (
    <section className="section faq-section" id="faq">
      <div className="section-inner faq-inner">
        <div className="section-header reveal">
          <span className="section-tag">{t('faq-tag')}</span>
          <h2 className="section-title">
            {t('faq-title-1')} <span>{t('faq-title-2')}</span>
          </h2>
        </div>

        <div className="faq-list" id="faq-list">
          {faqs.map((item, i) => (
            <div key={i} className="faq-item reveal" id={`faq-${i + 1}`}
              style={{ transitionDelay: `${i * 0.07}s` }}>
              <button className="faq-q" aria-expanded={open === i}
                onClick={() => toggle(i)}>
                <span>{faqTexts[item.q]}</span>
                <span className="faq-icon">{open === i ? '×' : '+'}</span>
              </button>
              <div className={`faq-a ${open === i ? 'open' : ''}`}>
                <p>{faqTexts[item.a]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
