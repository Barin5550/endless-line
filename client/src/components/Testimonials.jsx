import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function renderStars(rating) {
  return (
    <div className="t-stars">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </div>
  )
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Testimonials() {
  const { t } = useLang()
  const [reviews, setReviews] = useState([])
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const trackRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    axios.get(`${API}/reviews`)
      .then(res => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (reviews.length < 2) return
    timerRef.current = setInterval(() => setIdx(prev => (prev + 1) % reviews.length), 4000)
    return () => clearInterval(timerRef.current)
  }, [reviews.length])

  useEffect(() => {
    if (!trackRef.current) return
    const card = trackRef.current.querySelector('.testimonial-card')
    if (!card) return
    const w = card.offsetWidth + 24
    trackRef.current.style.transform = `translateX(-${idx * w}px)`
  }, [idx])

  const goTo = (i) => {
    clearInterval(timerRef.current)
    setIdx(i)
  }

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="section-inner">
        <div className="section-header reveal">
          <span className="section-tag">{t('reviews-tag')}</span>
          <h2 className="section-title">
            {t('reviews-title-1')} <span>{t('reviews-title-2')}</span>
          </h2>
        </div>

        {loading && (
          <div className="reviews-loading">Загрузка отзывов...</div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="reviews-empty" style={{ textAlign: 'center', padding: '40px 0', opacity: 0.6 }}>
            <p>Отзывов пока нет. Станьте первым после бронирования!</p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <>
            <div className="testimonials-track-wrap">
              <div className="testimonials-track" id="testimonials-track" ref={trackRef}>
                {reviews.map(r => (
                  <div key={r._id} className="testimonial-card">
                    {renderStars(r.rating)}
                    <p className="t-text">"{r.text}"</p>
                    <div className="t-author">
                      <div className="t-avatar">{getInitials(r.userName)}</div>
                      <div>
                        <div className="t-name">{r.userName}</div>
                        {r.destination && (
                          <div className="t-loc">🌍 {r.destination}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length > 1 && (
              <div className="testimonials-dots" id="testimonials-dots">
                {reviews.map((_, i) => (
                  <button key={i} className={`dot ${idx === i ? 'active' : ''}`}
                    data-idx={i} onClick={() => goTo(i)} aria-label={`Отзыв ${i + 1}`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
