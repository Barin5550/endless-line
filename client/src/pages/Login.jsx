import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

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

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef(null)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  useEffect(() => { emailRef.current?.focus() }, [])

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Введите email'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Некорректный формат email'
    if (!form.password) e.password = 'Введите пароль'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Ошибка входа' })
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; delete n.global; return n })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <img src="/logo.png" alt="Endless Line" className="logo-img" />
          <div className="logo-text">
            <span className="logo-name">Endless</span>
            <span className="logo-name-accent">Line</span>
          </div>
        </Link>

        <h1 className="auth-title">Добро пожаловать!</h1>
        <p className="auth-subtitle">Войдите, чтобы управлять путешествиями</p>

        {errors.global && <div className="form-error-global">{errors.global}</div>}

        <form onSubmit={handleSubmit} noValidate id="login-form">
          <div className="field-group">
            <label className="field-label-dark" htmlFor="login-email">Email</label>
            <input ref={emailRef} type="email" id="login-email"
              className={`field-input ${errors.email ? 'field-input--error' : ''}`}
              placeholder="example@mail.com" value={form.email}
              onChange={set('email')} autoComplete="email" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <label className="field-label-dark" htmlFor="login-password">Пароль</label>
              <button type="button" className="forgot-link" onClick={() =>
                setErrors({ global: 'Для восстановления пароля обратитесь на hello@endless-line.kz' })
              }>Забыли пароль?</button>
            </div>
            <div className="input-eye-wrap">
              <input type={showPw ? 'text' : 'password'} id="login-password"
                className={`field-input ${errors.password ? 'field-input--error' : ''}`}
                placeholder="••••••••" value={form.password}
                onChange={set('password')} autoComplete="current-password" />
              <button type="button" className="eye-btn" onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Скрыть пароль' : 'Показать пароль'}>
                <EyeIcon open={showPw} />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary auth-btn" id="btn-login-submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="btn-spinner" />Вход...</span>
            ) : 'Войти'}
          </button>
        </form>

        <p className="auth-switch">
          Нет аккаунта? <Link to="/register" id="link-to-register">Зарегистрируйтесь</Link>
        </p>
      </div>
    </div>
  )
}
