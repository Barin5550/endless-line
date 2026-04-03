import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const tabs = ['train', 'cruise', 'air']
const tabIcons = { train: '🚂', cruise: '🚢', air: '✈️' }
const tabPlaceholders = {
  train: { from: 'Алматы', to: 'Берлин' },
  cruise: { from: 'Стамбул', to: 'Барселона' },
  air: { from: 'Алматы', to: 'Дубай' },
}

export default function BookingForm() {
  const { t } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()

  const today = new Date()
  const fmt = d => d.toISOString().split('T')[0]
  const dep = new Date(today); dep.setDate(dep.getDate() + 7)
  const ret = new Date(today); ret.setDate(ret.getDate() + 14)

  const [activeTab, setActiveTab] = useState('train')
  const [form, setForm] = useState({ from: '', to: '', departDate: fmt(dep), returnDate: fmt(ret), passengers: 1 })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.from.trim()) e.from = 'Укажите город отправления'
    if (!form.to.trim()) e.to = 'Укажите город назначения'
    if (!form.departDate) e.departDate = 'Укажите дату отправления'
    if (form.from.trim().toLowerCase() === form.to.trim().toLowerCase() && form.from.trim())
      e.to = 'Города отправления и назначения должны различаться'
    if (form.returnDate && form.departDate && form.returnDate < form.departDate)
      e.returnDate = 'Дата возврата не может быть раньше отправления'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    if (!user) { navigate('/login'); return }

    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, { ...form, type: activeTab })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
      setForm(f => ({ ...f, from: '', to: '' }))
      setErrors({})
    } catch (err) {
      const msg = err.response?.data?.message || 'Ошибка создания бронирования'
      setErrors({ global: msg })
    } finally {
      setLoading(false)
    }
  }

  const swap = () => setForm(f => ({ ...f, from: f.to, to: f.from }))

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  return (
    <section className="section booking-section" id="booking">
      <div className="section-inner">
        <div className="section-header section-header--light reveal">
          <span className="section-tag section-tag--light">{t('booking-tag')}</span>
          <h2 className="section-title section-title--light">
            {t('booking-title-1')} <span>{t('booking-title-2')}</span>
          </h2>
          <p className="section-subtitle section-subtitle--light">{t('booking-subtitle')}</p>
        </div>

        <div className="booking-widget reveal">
          <div className="booking-tabs" id="booking-tabs">
            {tabs.map(tab => (
              <button key={tab} id={`tab-${tab}`}
                className={`booking-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}>
                {tabIcons[tab]} <span>{t(`tab-${tab}`)}</span>
              </button>
            ))}
          </div>

          <form className="booking-form" id="booking-form" onSubmit={handleSubmit} noValidate>
            {errors.global && <div className="form-error-global">{errors.global}</div>}
            <div className="booking-fields">
              <div className="field-group">
                <label className="field-label">{t('field-from')}</label>
                <input type="text" id="field-from" className={`field-input ${errors.from ? 'field-input--error' : ''}`}
                  placeholder={tabPlaceholders[activeTab].from} value={form.from} onChange={set('from')} autoComplete="off" />
                {errors.from && <span className="field-error">{errors.from}</span>}
              </div>

              <div className="field-swap" id="btn-swap" title="Поменять местами" onClick={swap}>⇄</div>

              <div className="field-group">
                <label className="field-label">{t('field-to')}</label>
                <input type="text" id="field-to" className={`field-input ${errors.to ? 'field-input--error' : ''}`}
                  placeholder={tabPlaceholders[activeTab].to} value={form.to} onChange={set('to')} autoComplete="off" />
                {errors.to && <span className="field-error">{errors.to}</span>}
              </div>

              <div className="field-group">
                <label className="field-label">{t('field-depart')}</label>
                <input type="date" id="field-depart" className={`field-input ${errors.departDate ? 'field-input--error' : ''}`}
                  value={form.departDate} min={fmt(today)} onChange={set('departDate')} />
                {errors.departDate && <span className="field-error">{errors.departDate}</span>}
              </div>

              <div className="field-group">
                <label className="field-label">{t('field-return')}</label>
                <input type="date" id="field-return" className={`field-input ${errors.returnDate ? 'field-input--error' : ''}`}
                  value={form.returnDate} min={form.departDate} onChange={set('returnDate')} />
                {errors.returnDate && <span className="field-error">{errors.returnDate}</span>}
              </div>

              <div className="field-group field-group--narrow">
                <label className="field-label">{t('field-passengers')}</label>
                <div className="passengers-control">
                  <button type="button" className="pass-btn" id="pass-minus"
                    disabled={form.passengers <= 1}
                    onClick={() => setForm(f => ({ ...f, passengers: Math.max(1, f.passengers - 1) }))}>−</button>
                  <span className="pass-count" id="pass-count">{form.passengers}</span>
                  <button type="button" className="pass-btn" id="pass-plus"
                    disabled={form.passengers >= 9}
                    onClick={() => setForm(f => ({ ...f, passengers: Math.min(9, f.passengers + 1) }))}>+</button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-search" id="btn-search" disabled={loading}>
              {loading ? '⏳ Бронирование...' : (user ? t('btn-book-now') : t('btn-search'))}
            </button>

            {success && (
              <p className="form-success visible">✅ Бронирование создано! Откройте «Мои поездки» для управления.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
