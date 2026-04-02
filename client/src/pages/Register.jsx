import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score: 1, label: 'Слабый', color: '#e74c3c' }
  if (score <= 2) return { score: 2, label: 'Средний', color: '#f39c12' }
  if (score <= 3) return { score: 3, label: 'Хороший', color: '#3498db' }
  return { score: 4, label: 'Надёжный', color: '#27ae60' }
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const nameRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [touched, setTouched] = useState({})

  useEffect(() => { nameRef.current?.focus() }, [])

  const pwStrength = getPasswordStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Введите ваше имя'
    else if (form.name.trim().length < 2) e.name = 'Имя минимум 2 символа'
    if (!form.email.trim()) e.email = 'Введите email'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Некорректный формат email'
    if (!form.password) e.password = 'Введите пароль'
    else if (form.password.length < 6) e.password = 'Минимум 6 символов'
    if (!form.confirm) e.confirm = 'Подтвердите пароль'
    else if (form.confirm !== form.password) e.confirm = 'Пароли не совпадают'
    if (!agreed) e.agreed = 'Необходимо принять условия'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name: form.name, email: form.email, password: form.password,
        phone: form.phone || undefined
      })
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Ошибка регистрации' })
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; delete n.global; return n })
  }

  const blur = (key) => () => setTouched(t => ({ ...t, [key]: true }))

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <Link to="/" className="auth-logo">
          <img src="/logo.png" alt="Endless Line" className="logo-img" />
          <div className="logo-text">
            <span className="logo-name">Endless</span>
            <span className="logo-name-accent">Line</span>
          </div>
        </Link>

        <h1 className="auth-title">Создать аккаунт</h1>
        <p className="auth-subtitle">Начните путешествовать с Endless Line уже сегодня</p>

        {errors.global && <div className="form-error-global">{errors.global}</div>}

        <form onSubmit={handleSubmit} noValidate id="register-form">
          {/* Name */}
          <div className="field-group">
            <label className="field-label-dark" htmlFor="reg-name">Имя *</label>
            <input ref={nameRef} type="text" id="reg-name"
              className={`field-input ${errors.name ? 'field-input--error' : touched.name && form.name.length >= 2 ? 'field-input--ok' : ''}`}
              placeholder="Ваше имя" value={form.name}
              onChange={set('name')} onBlur={blur('name')} autoComplete="name" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="field-group">
            <label className="field-label-dark" htmlFor="reg-email">Email *</label>
            <input type="email" id="reg-email"
              className={`field-input ${errors.email ? 'field-input--error' : touched.email && /^\S+@\S+\.\S+$/.test(form.email) ? 'field-input--ok' : ''}`}
              placeholder="example@mail.com" value={form.email}
              onChange={set('email')} onBlur={blur('email')} autoComplete="email" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Phone (optional) */}
          <div className="field-group">
            <label className="field-label-dark" htmlFor="reg-phone">
              Телефон <span className="field-optional">(необязательно)</span>
            </label>
            <input type="tel" id="reg-phone"
              className="field-input"
              placeholder="+7 700 000-00-00" value={form.phone}
              onChange={set('phone')} autoComplete="tel" />
          </div>

          {/* Password */}
          <div className="field-group">
            <label className="field-label-dark" htmlFor="reg-password">Пароль *</label>
            <div className="input-eye-wrap">
              <input type={showPw ? 'text' : 'password'} id="reg-password"
                className={`field-input ${errors.password ? 'field-input--error' : ''}`}
                placeholder="Минимум 6 символов" value={form.password}
                onChange={set('password')} onBlur={blur('password')} autoComplete="new-password" />
              <button type="button" className="eye-btn" onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Скрыть пароль' : 'Показать пароль'}>
                <EyeIcon open={showPw} />
              </button>
            </div>
            {form.password && (
              <div className="pw-strength">
                <div className="pw-strength-bars">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="pw-bar"
                      style={{ background: i <= pwStrength.score ? pwStrength.color : undefined }} />
                  ))}
                </div>
                <span className="pw-strength-label" style={{ color: pwStrength.color }}>
                  {pwStrength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm password */}
          <div className="field-group">
            <label className="field-label-dark" htmlFor="reg-confirm">Подтверждение пароля *</label>
            <div className="input-eye-wrap">
              <input type={showConfirm ? 'text' : 'password'} id="reg-confirm"
                className={`field-input ${errors.confirm ? 'field-input--error' : touched.confirm && form.confirm && form.confirm === form.password ? 'field-input--ok' : ''}`}
                placeholder="Повторите пароль" value={form.confirm}
                onChange={set('confirm')} onBlur={blur('confirm')} autoComplete="new-password" />
              <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? 'Скрыть пароль' : 'Показать пароль'}>
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>

          {/* Terms */}
          <div className="field-group">
            <label className={`terms-checkbox ${errors.agreed ? 'terms-checkbox--error' : ''}`}>
              <input type="checkbox" id="reg-terms"
                checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: null })) }} />
              <span className="check-custom" />
              <span>Я принимаю <a href="#" onClick={e => e.preventDefault()}>условия использования</a> и <a href="#" onClick={e => e.preventDefault()}>политику конфиденциальности</a></span>
            </label>
            {errors.agreed && <span className="field-error">{errors.agreed}</span>}
          </div>

          <button type="submit" className="btn-primary auth-btn" id="btn-register-submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="btn-spinner" />Регистрация...</span>
            ) : 'Создать аккаунт'}
          </button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт? <Link to="/login" id="link-to-login">Войдите</Link>
        </p>
      </div>
    </div>
  )
}
