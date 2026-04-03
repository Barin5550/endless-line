import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="star-rating-input">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" className={`star-btn ${(hover || value) >= s ? 'filled' : ''}`}
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}>★</button>
      ))}
    </div>
  )
}

function renderStars(rating) {
  return (
    <div className="t-stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= rating ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  )
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Reviews() {
  const { t } = useLang()
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ rating: 0, text: '', destination: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [userReviewId, setUserReviewId] = useState(null)

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/reviews`)
      setReviews(res.data)
      if (user) {
        const mine = res.data.find(r => r.userId === user.id)
        setUserReviewId(mine?._id || null)
        if (mine) setSubmitted(true)
      }
    } catch { /* server offline */ }
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.rating) errs.rating = 'Выберите оценку'
    if (!form.text.trim() || form.text.trim().length < 10) errs.text = 'Минимум 10 символов'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    try {
      await axios.post(`${API}/reviews`, form)
      setSubmitted(true)
      await fetchReviews()
      setForm({ rating: 0, text: '', destination: '' })
      setErrors({})
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Ошибка отправки' })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteReview = async () => {
    if (!userReviewId || !window.confirm('Удалить ваш отзыв?')) return
    try {
      await axios.delete(`${API}/reviews/${userReviewId}`)
      setSubmitted(false)
      setUserReviewId(null)
      await fetchReviews()
    } catch {}
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <section className="section reviews-section" id="reviews">
      <div className="section-inner">
        <div className="section-header reveal">
          <span className="section-tag">{t('reviews-tag')}</span>
          <h2 className="section-title">
            {t('reviews-title-1')} <span>{t('reviews-title-2')}</span>
          </h2>
          {avgRating && (
            <div className="reviews-summary">
              <span className="reviews-avg">{avgRating}</span>
              <div>
                {renderStars(Math.round(avgRating))}
                <span className="reviews-count">на основе {reviews.length} {reviews.length === 1 ? 'отзыва' : reviews.length < 5 ? 'отзывов' : 'отзывов'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="reviews-layout">
          {/* Reviews list */}
          <div className="reviews-list">
            {loading && <div className="reviews-loading">Загрузка отзывов...</div>}
            {!loading && reviews.length === 0 && (
              <div className="reviews-empty">
                <p>Отзывов пока нет. Станьте первым!</p>
              </div>
            )}
            {reviews.map(r => (
              <div key={r._id} className={`review-card reveal ${r.userId === user?.id ? 'review-card--mine' : ''}`}>
                <div className="review-header">
                  <div className="t-avatar">{getInitials(r.userName)}</div>
                  <div className="review-meta">
                    <div className="t-name">{r.userName}
                      {r.userId === user?.id && <span className="review-mine-badge">Ваш отзыв</span>}
                    </div>
                    <div className="t-loc">
                      {r.destination && <span>🌍 {r.destination} · </span>}
                      {new Date(r.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  {renderStars(r.rating)}
                </div>
                <p className="t-text">"{r.text}"</p>
                {r.userId === user?.id && (
                  <button className="review-delete-btn" onClick={deleteReview}>Удалить отзыв</button>
                )}
              </div>
            ))}
          </div>

          {/* Write review */}
          <div className="review-form-wrap reveal">
            {!user ? (
              <div className="review-cta-box">
                <div className="review-cta-icon">✍️</div>
                <h3>Поделитесь впечатлениями</h3>
                <p>Войдите в аккаунт, чтобы оставить отзыв о вашей поездке</p>
                <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
                  Войти
                </Link>
              </div>
            ) : submitted ? (
              <div className="review-cta-box">
                <div className="review-cta-icon">✅</div>
                <h3>Спасибо за отзыв!</h3>
                <p>Ваш отзыв опубликован и виден другим путешественникам</p>
                <button className="review-delete-btn" style={{ marginTop: '16px' }} onClick={deleteReview}>
                  Удалить и написать заново
                </button>
              </div>
            ) : (
              <div className="review-form-card">
                <h3 className="review-form-title">Оставить отзыв</h3>
                <p className="review-form-sub">Ваш опыт поможет другим путешественникам</p>
                {errors.global && <div className="form-error-global">{errors.global}</div>}
                <form onSubmit={handleSubmit} noValidate id="review-form">
                  <div className="field-group">
                    <label className="field-label-dark">Оценка</label>
                    <StarRating value={form.rating} onChange={v => { setForm(f => ({...f, rating: v})); setErrors(p => ({...p, rating: null})) }} />
                    {errors.rating && <span className="field-error">{errors.rating}</span>}
                  </div>
                  <div className="field-group">
                    <label className="field-label-dark">Направление (необязательно)</label>
                    <input type="text" className="field-input" id="review-destination"
                      placeholder="Например: Алматы, Дубай..."
                      value={form.destination} onChange={e => setForm(f => ({...f, destination: e.target.value}))} />
                  </div>
                  <div className="field-group">
                    <label className="field-label-dark">Ваш отзыв</label>
                    <textarea className={`field-input field-textarea ${errors.text ? 'field-input--error' : ''}`}
                      id="review-text" rows="4"
                      placeholder="Расскажите о вашем путешествии с Endless Line..."
                      value={form.text}
                      onChange={e => { setForm(f => ({...f, text: e.target.value})); setErrors(p => ({...p, text: null})) }} />
                    <div className="field-hint" style={{ color: form.text.trim().length >= 10 ? '#27ae60' : undefined }}>
                      {form.text.trim().length >= 10 ? `${form.text.trim().length} символов ✓` : `${form.text.trim().length}/10 символов минимум`}
                    </div>
                    {errors.text && <span className="field-error">{errors.text}</span>}
                  </div>
                  <button type="submit" className="btn-primary btn-send" id="review-submit" disabled={submitting}>
                    {submitting ? '⏳ Публикация...' : 'Опубликовать отзыв'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
