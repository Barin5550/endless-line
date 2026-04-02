import { useLang } from '../context/LangContext'
import { useEffect, useRef } from 'react'

export default function Hero() {
  const { t } = useLang()
  const canvasRef = useRef(null)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.35 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = canvas.width
        if (d.x > canvas.width) d.x = 0
        if (d.y < 0) d.y = canvas.height
        if (d.y > canvas.height) d.y = 0
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,107,53,${d.alpha})`
        ctx.fill()
      })
      // Draw connecting lines between close dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(255,107,53,${0.07 * (1 - dist / 100)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-badge">{t('hero-badge')}</div>
        <h1 className="hero-title">
          {t('hero-title-1')}<br />
          <span>{t('hero-title-2')}</span>
        </h1>
        <p className="hero-subtitle">{t('hero-subtitle')}</p>
        <div className="hero-actions">
          <button className="btn-primary" id="btn-explore" onClick={() => scrollTo('destinations')}>
            {t('btn-explore')}
          </button>
          <button className="btn-secondary" id="btn-learn" onClick={() => scrollTo('services')}>
            {t('btn-learn')}
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">150+</span>
            <span className="stat-label">{t('stat-countries')}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">3 200+</span>
            <span className="stat-label">{t('stat-routes')}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">500K+</span>
            <span className="stat-label">{t('stat-travelers')}</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-globe">
          <img src="/logo.png" alt="" className="hero-logo-float" />
          <div className="hero-globe-ring ring1" />
          <div className="hero-globe-ring ring2" />
          <div className="hero-globe-ring ring3" />
        </div>
      </div>
    </section>
  )
}
