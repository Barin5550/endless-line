import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setUserMenuOpen(false); setMobileOpen(false) }

  const scrollTo = (id) => {
    setMobileOpen(false)
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 10)
  }

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?'

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="header-inner">
          <Link to="/" className="logo-link" id="logo-home" onClick={() => setMobileOpen(false)}>
            <div className="logo">
              <img src="/logo.png" alt="Endless Line" className="logo-img" />
              <div className="logo-text">
                <span className="logo-name">Endless</span>
                <span className="logo-name-accent">Line</span>
              </div>
            </div>
          </Link>

          <nav className="nav" id="main-nav">
            <ul className="nav-list">
              <li><button className="nav-link nav-btn" onClick={() => scrollTo('services')}>{t('nav-services')}</button></li>
              <li><button className="nav-link nav-btn" onClick={() => scrollTo('destinations')}>{t('nav-destinations')}</button></li>
              <li><button className="nav-link nav-btn" onClick={() => scrollTo('booking')}>{t('nav-booking')}</button></li>
              <li><button className="nav-link nav-btn" onClick={() => scrollTo('contacts')}>{t('nav-contacts')}</button></li>
              {user && <li><Link to="/dashboard" className="nav-link">{t('nav-dashboard')}</Link></li>}
            </ul>
          </nav>

          <div className="header-right">
            <div className="lang-switcher" id="lang-switcher">
              {['ru', 'en', 'de'].map(l => (
                <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`}
                  onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>

            {user ? (
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button className="user-avatar-btn" id="user-menu-btn"
                  onClick={() => setUserMenuOpen(v => !v)}
                  aria-expanded={userMenuOpen}>
                  <span className="user-avatar">{initials}</span>
                  <span className="user-name-short">{user.name.split(' ')[0]}</span>
                  <svg className={`chevron ${userMenuOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown" id="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-avatar user-avatar--lg">{initials}</div>
                      <div>
                        <div className="user-dropdown-name">{user.name}</div>
                        <div className="user-dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="user-dropdown-divider" />
                    <Link to="/dashboard" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      🗺️ {t('nav-dashboard')}
                    </Link>
                    <button className="user-dropdown-item user-dropdown-item--danger" onClick={handleLogout}>
                      🚪 {t('nav-logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="header-auth">
                <Link to="/login" className="nav-link" id="btn-login">{t('nav-login')}</Link>
                <Link to="/register" className="cta-header" id="btn-register">{t('nav-register')}</Link>
              </div>
            )}

            {/* Hamburger */}
            <button className={`hamburger ${mobileOpen ? 'open' : ''}`} id="hamburger-btn"
              onClick={() => setMobileOpen(v => !v)} aria-label="Меню">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile menu */}
      <nav className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobile-menu">
        <ul className="mobile-nav-list">
          <li><button className="mobile-nav-link" onClick={() => scrollTo('services')}>{t('nav-services')}</button></li>
          <li><button className="mobile-nav-link" onClick={() => scrollTo('destinations')}>{t('nav-destinations')}</button></li>
          <li><button className="mobile-nav-link" onClick={() => scrollTo('booking')}>{t('nav-booking')}</button></li>
          <li><button className="mobile-nav-link" onClick={() => scrollTo('contacts')}>{t('nav-contacts')}</button></li>
          {user && (
            <li><Link to="/dashboard" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>{t('nav-dashboard')}</Link></li>
          )}
        </ul>
        <div className="mobile-menu-footer">
          <div className="lang-switcher" style={{ justifyContent: 'center' }}>
            {['ru', 'en', 'de'].map(l => (
              <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`}
                onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          {user ? (
            <div style={{ marginTop: 16 }}>
              <div className="mobile-user-info">
                <span className="user-avatar">{initials}</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{user.email}</div>
                </div>
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={handleLogout}>
                {t('nav-logout')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <Link to="/login" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none' }}
                onClick={() => setMobileOpen(false)}>{t('nav-login')}</Link>
              <Link to="/register" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}
                onClick={() => setMobileOpen(false)}>{t('nav-register')}</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
