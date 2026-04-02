import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function Footer() {
  const { t } = useLang()
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <footer className="footer" id="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="logo-link">
            <div className="logo">
              <img src="/logo.png" alt="Endless Line" className="logo-img logo-img--sm" />
              <div className="logo-text">
                <span className="logo-name">Endless</span>
                <span className="logo-name-accent">Line</span>
              </div>
            </div>
          </Link>
          <p className="footer-tagline">Путешествие без границ</p>
        </div>

        <nav className="footer-nav">
          <button className="footer-link" onClick={() => scrollTo('services')}>{t('nav-services')}</button>
          <button className="footer-link" onClick={() => scrollTo('destinations')}>{t('nav-destinations')}</button>
          <button className="footer-link" onClick={() => scrollTo('booking')}>{t('nav-booking')}</button>
          <button className="footer-link" onClick={() => scrollTo('contacts')}>{t('nav-contacts')}</button>
        </nav>

        <div className="footer-copy">
          © 2026 Endless Line. {t('footer-rights')}
        </div>
      </div>
    </footer>
  )
}
