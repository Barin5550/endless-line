import { useLang } from '../context/LangContext'

const services = [
  { id: 'train', icon: '🚂', nameKey: 'service-train', descKey: 'service-train-desc', featured: false },
  { id: 'cruise', icon: '🚢', nameKey: 'service-cruise', descKey: 'service-cruise-desc', featured: true },
  { id: 'air', icon: '✈️', nameKey: 'service-air', descKey: 'service-air-desc', featured: false },
]

export default function Services() {
  const { t } = useLang()

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="section services-section" id="services">
      <div className="section-inner">
        <div className="section-header reveal">
          <span className="section-tag">{t('services-tag')}</span>
          <h2 className="section-title">
            {t('services-title-1')} <span>{t('services-title-2')}</span>
          </h2>
          <p className="section-subtitle">{t('services-subtitle')}</p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={s.id} className={`service-card reveal ${s.featured ? 'service-card--featured' : ''}`}
              id={`service-${s.id}`} style={{ transitionDelay: `${i * 0.1}s` }}>
              {s.featured && (
                <div className="service-card-badge">{t('badge-popular')}</div>
              )}
              <span className="service-icon">{s.icon}</span>
              <h3 className="service-name">{t(s.nameKey)}</h3>
              <p className="service-desc">{t(s.descKey)}</p>
              <button className="service-link" onClick={() => scrollTo('booking')}>
                {t('service-link')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
