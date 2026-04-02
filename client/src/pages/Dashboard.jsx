import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const typeLabels = { train: '🚂 Поезд', cruise: '🚢 Круиз', air: '✈️ Авиа' }
const statusLabels = { confirmed: '✅ Подтверждено', pending: '⏳ Ожидание', cancelled: '❌ Отменено' }
const API = import.meta.env.VITE_API_URL

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function fmt(d) {
  return d ? new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
}

// Inline confirm dialog component
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn-confirm-cancel" onClick={onCancel}>Отмена</button>
          <button className="btn-confirm-ok" onClick={onConfirm}>Отменить бронирование</button>
        </div>
      </div>
    </div>
  )
}

// Profile tab
function ProfileTab({ user, updateUser }) {
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNew: '' })
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [pwErrors, setPwErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [showCur, setShowCur] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setErrors({ name: 'Имя не может быть пустым' }); return }
    setSaving(true)
    try {
      const res = await axios.put(`${API}/auth/profile`, { name: form.name, phone: form.phone })
      updateUser(res.data)
      setSuccess('Профиль обновлён!')
      setErrors({})
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    const e2 = {}
    if (!pwForm.currentPassword) e2.currentPassword = 'Введите текущий пароль'
    if (!pwForm.newPassword) e2.newPassword = 'Введите новый пароль'
    else if (pwForm.newPassword.length < 6) e2.newPassword = 'Минимум 6 символов'
    if (pwForm.newPassword !== pwForm.confirmNew) e2.confirmNew = 'Пароли не совпадают'
    if (Object.keys(e2).length) { setPwErrors(e2); return }
    setSavingPw(true)
    try {
      await axios.put(`${API}/auth/password`, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwSuccess('Пароль изменён!')
      setPwForm({ currentPassword: '', newPassword: '', confirmNew: '' })
      setPwErrors({})
      setTimeout(() => setPwSuccess(''), 3000)
    } catch (err) {
      setPwErrors({ global: err.response?.data?.message || 'Ошибка смены пароля' })
    } finally {
      setSavingPw(false)
    }
  }

  const EyeBtn = ({ show, onClick }) => (
    <button type="button" className="eye-btn" onClick={onClick} style={{ top: '50%', transform: 'translateY(-50%)' }}>
      {show ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5.06-5.94"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  )

  return (
    <div className="profile-layout">
      {/* Avatar */}
      <div className="profile-avatar-section">
        <div className="profile-avatar">{getInitials(user?.name)}</div>
        <div className="profile-avatar-info">
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
          {user?.createdAt && (
            <div className="profile-since">
              Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      {/* Edit profile form */}
      <div className="profile-section">
        <h3 className="profile-section-title">Личные данные</h3>
        {errors.global && <div className="form-error-global">{errors.global}</div>}
        {success && <div className="form-success visible">{success}</div>}
        <form onSubmit={saveProfile} className="profile-form" id="profile-form">
          <div className="field-group">
            <label className="field-label-dark" htmlFor="prof-name">Имя</label>
            <input type="text" id="prof-name" className={`field-input ${errors.name ? 'field-input--error' : ''}`}
              value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors({}) }} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="field-group">
            <label className="field-label-dark" htmlFor="prof-email">Email <span className="field-optional">(нельзя изменить)</span></label>
            <input type="email" id="prof-email" className="field-input" value={user?.email || ''} disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>
          <div className="field-group">
            <label className="field-label-dark" htmlFor="prof-phone">Телефон</label>
            <input type="tel" id="prof-phone" className="field-input" placeholder="+7 700 000-00-00"
              value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 32px' }}
            disabled={saving} id="btn-save-profile">
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="profile-section">
        <h3 className="profile-section-title">Смена пароля</h3>
        {pwErrors.global && <div className="form-error-global">{pwErrors.global}</div>}
        {pwSuccess && <div className="form-success visible">{pwSuccess}</div>}
        <form onSubmit={changePassword} className="profile-form" id="change-password-form">
          <div className="field-group">
            <label className="field-label-dark" htmlFor="pw-current">Текущий пароль</label>
            <div className="input-eye-wrap">
              <input type={showCur ? 'text' : 'password'} id="pw-current"
                className={`field-input ${pwErrors.currentPassword ? 'field-input--error' : ''}`}
                value={pwForm.currentPassword}
                onChange={e => { setPwForm(f => ({ ...f, currentPassword: e.target.value })); setPwErrors({}) }} />
              <EyeBtn show={showCur} onClick={() => setShowCur(v => !v)} />
            </div>
            {pwErrors.currentPassword && <span className="field-error">{pwErrors.currentPassword}</span>}
          </div>
          <div className="field-group">
            <label className="field-label-dark" htmlFor="pw-new">Новый пароль</label>
            <div className="input-eye-wrap">
              <input type={showNew ? 'text' : 'password'} id="pw-new"
                className={`field-input ${pwErrors.newPassword ? 'field-input--error' : ''}`}
                value={pwForm.newPassword}
                onChange={e => { setPwForm(f => ({ ...f, newPassword: e.target.value })); setPwErrors({}) }} />
              <EyeBtn show={showNew} onClick={() => setShowNew(v => !v)} />
            </div>
            {pwErrors.newPassword && <span className="field-error">{pwErrors.newPassword}</span>}
          </div>
          <div className="field-group">
            <label className="field-label-dark" htmlFor="pw-confirm">Подтверждение нового пароля</label>
            <input type="password" id="pw-confirm"
              className={`field-input ${pwErrors.confirmNew ? 'field-input--error' : ''}`}
              value={pwForm.confirmNew}
              onChange={e => { setPwForm(f => ({ ...f, confirmNew: e.target.value })); setPwErrors({}) }} />
            {pwErrors.confirmNew && <span className="field-error">{pwErrors.confirmNew}</span>}
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 32px' }}
            disabled={savingPw} id="btn-change-password">
            {savingPw ? 'Сохранение...' : 'Изменить пароль'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Bookings tab
function BookingsTab({ bookings, loading, error, onDelete, totalSpent }) {
  const [confirmId, setConfirmId] = useState(null)

  const handleDelete = (id) => setConfirmId(id)
  const confirmDelete = () => { onDelete(confirmId); setConfirmId(null) }

  if (loading) return <div className="dash-loading">⏳ Загрузка бронирований...</div>
  if (error) return <div className="form-error-global">{error}</div>

  if (bookings.length === 0) return (
    <div className="dash-empty">
      <div className="dash-empty-icon">🗺️</div>
      <h3>Пока нет бронирований</h3>
      <p>Выберите маршрут и начните своё путешествие</p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
        Найти маршрут
      </Link>
    </div>
  )

  return (
    <>
      {confirmId && (
        <ConfirmDialog
          message="Отменить это бронирование? Действие нельзя отменить."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Stats bar */}
      <div className="dash-stats">
        <div className="dash-stat">
          <span className="dash-stat-num">{bookings.length}</span>
          <span className="dash-stat-label">Бронирований</span>
        </div>
        <div className="dash-stat-divider" />
        <div className="dash-stat">
          <span className="dash-stat-num">{bookings.filter(b => b.status === 'confirmed').length}</span>
          <span className="dash-stat-label">Активных</span>
        </div>
        <div className="dash-stat-divider" />
        <div className="dash-stat">
          <span className="dash-stat-num">{totalSpent.toLocaleString('ru-KZ')} ₸</span>
          <span className="dash-stat-label">Потрачено</span>
        </div>
      </div>

      <div className="bookings-grid">
        {bookings.map(b => (
          <div key={b._id} className="booking-card" id={`booking-${b._id}`}>
            <div className="booking-card-header">
              <span className="booking-type">{typeLabels[b.type] || b.type}</span>
              <span className={`booking-status ${b.status}`}>{statusLabels[b.status]}</span>
            </div>
            <div className="booking-route">
              <span className="booking-city">{b.from}</span>
              <span className="booking-arrow">→</span>
              <span className="booking-city">{b.to}</span>
            </div>
            <div className="booking-details">
              <div className="booking-detail">
                <span className="booking-detail-label">Отправление</span>
                <span>{fmt(b.departDate)}</span>
              </div>
              {b.returnDate && (
                <div className="booking-detail">
                  <span className="booking-detail-label">Возврат</span>
                  <span>{fmt(b.returnDate)}</span>
                </div>
              )}
              <div className="booking-detail">
                <span className="booking-detail-label">Пассажиры</span>
                <span>{b.passengers}</span>
              </div>
              {b.price && (
                <div className="booking-detail">
                  <span className="booking-detail-label">Стоимость</span>
                  <span className="booking-price">{b.price.toLocaleString('ru-KZ')} ₸</span>
                </div>
              )}
            </div>
            {b.status !== 'cancelled' && (
              <button className="booking-cancel" onClick={() => handleDelete(b._id)}>
                Отменить бронирование
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('bookings')

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API}/bookings`)
      setBookings(res.data)
    } catch {
      setError('Не удалось загрузить бронирования')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${API}/bookings/${id}`)
      setBookings(prev => prev.filter(b => b._id !== id))
    } catch {
      setError('Ошибка при отмене бронирования')
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const totalSpent = bookings.reduce((s, b) => s + (b.price || 0), 0)
  const initials = getInitials(user?.name)

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="logo-link">
          <img src="/logo.png" alt="Endless Line" className="logo-img" />
          <div className="logo-text">
            <span className="logo-name">Endless</span>
            <span className="logo-name-accent">Line</span>
          </div>
        </Link>
        <div className="dashboard-user">
          <div className="user-avatar" style={{ width: 36, height: 36, fontSize: '0.82rem' }}>{initials}</div>
          <span id="dash-username">{user?.name}</span>
          <Link to="/" className="dash-link">← На главную</Link>
          <button className="cta-header cta-outline" id="btn-dash-logout" onClick={handleLogout}>Выйти</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-inner">
          <div className="dash-page-header">
            <div>
              <h1 className="dashboard-title">Личный кабинет</h1>
              <p className="dashboard-subtitle">Управляйте поездками и профилем</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="dash-tabs" id="dash-tabs">
            <button id="tab-bookings" className={`dash-tab ${tab === 'bookings' ? 'active' : ''}`}
              onClick={() => setTab('bookings')}>
              🗺️ Мои бронирования
              {bookings.length > 0 && <span className="dash-tab-badge">{bookings.length}</span>}
            </button>
            <button id="tab-profile" className={`dash-tab ${tab === 'profile' ? 'active' : ''}`}
              onClick={() => setTab('profile')}>
              👤 Профиль
            </button>
          </div>

          <div className="dash-content">
            {tab === 'bookings' ? (
              <BookingsTab
                bookings={bookings} loading={loading} error={error}
                onDelete={deleteBooking} totalSpent={totalSpent}
              />
            ) : (
              <ProfileTab user={user} updateUser={updateUser} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
