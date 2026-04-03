import { useState } from 'react'
import { useLang } from '../context/LangContext'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Contacts() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Введите ваше имя'
    if (!form.email.trim()) e.email = 'Введите email'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Некорректный формат email'
    if (!form.message.trim()) e.message = 'Введите сообщение'
    else if (form.message.trim().length < 10) e.message = 'Сообщение минимум 10 символов'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await axios.post(`${API}/contacts`, form)
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
      setErrors({})
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Ошибка отправки. Попробуйте позже.' })
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  return (
    <section className="section contacts-section" id="contacts">
      <div className="section-inner contacts-inner">
        <div className="contacts-left reveal">
          <span className="section-tag">{t('contacts-tag')}</span>
          <h2 className="section-title">
            {t('contacts-title-1')} <span>{t('contacts-title-2')}</span>
          </h2>
          <p className="section-subtitle">{t('contacts-subtitle')}</p>

          <div className="contact-items">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <div className="contact-label">Адрес</div>
                <div className="contact-value">Алматы, пр. Аль-Фараби 17</div>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <div className="contact-label">Телефон</div>
                <div className="contact-value"><a href="tel:+77001234567">+7 700 123-45-67</a></div>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value"><a href="mailto:hello@endless-line.kz">hello@endless-line.kz</a></div>
              </div>
            </div>
          </div>

          <div className="social-links">
            <a href="#!" onClick={e => e.preventDefault()} className="social-btn" id="social-instagram" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#!" onClick={e => e.preventDefault()} className="social-btn" id="social-telegram" aria-label="Telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
            </a>
            <a href="#!" onClick={e => e.preventDefault()} className="social-btn" id="social-whatsapp" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
          </div>
        </div>

        <div className="contacts-right reveal">
          <form className="contact-form" id="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label className="field-label" htmlFor="c-name">{t('c-name')}</label>
              <input type="text" id="c-name" className={`field-input ${errors.name ? 'field-input--error' : ''}`}
                placeholder="Ваше имя" value={form.name} onChange={set('name')} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="c-email">Email</label>
              <input type="email" id="c-email" className={`field-input ${errors.email ? 'field-input--error' : ''}`}
                placeholder="example@mail.com" value={form.email} onChange={set('email')} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="c-message">{t('c-message')}</label>
              <textarea id="c-message" className={`field-input field-textarea ${errors.message ? 'field-input--error' : ''}`}
                placeholder="Расскажите о вашем путешествии..." rows="4" value={form.message} onChange={set('message')} />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>
            {errors.global && <div className="form-error-global">{errors.global}</div>}
            <button type="submit" className="btn-primary btn-send" id="btn-send" disabled={loading}>
              {loading ? '⏳ Отправка...' : t('btn-send')}
            </button>
            {success && <p className="form-success visible" id="form-success">✅ Сообщение отправлено! Мы ответим в течение 2 часов.</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
