import { useState, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import axios from 'axios'

const destinations = [
  { id: 'almaty', name: 'Алматы', flag: '🇰🇿', countryKey: 'Казахстан', img: '/assets/city_almaty.png', kzt: 45000, usd: 99, eur: 92, weatherCity: 'Almaty' },
  { id: 'istanbul', name: 'Стамбул', flag: '🇹🇷', countryKey: 'Турция', img: '/assets/city_istanbul.png', kzt: 189000, usd: 415, eur: 385, weatherCity: 'Istanbul' },
  { id: 'dubai', name: 'Дубай', flag: '🇦🇪', countryKey: 'ОАЭ', img: '/assets/city_dubai.png', kzt: 265000, usd: 580, eur: 540, weatherCity: 'Dubai', large: true },
  { id: 'vienna', name: 'Вена', flag: '🇦🇹', countryKey: 'Австрия', img: '/assets/city_vienna.png', kzt: 320000, usd: 700, eur: 650, weatherCity: 'Vienna' },
  { id: 'berlin', name: 'Берлин', flag: '🇩🇪', countryKey: 'Германия', img: '/assets/city_berlin.png', kzt: 298000, usd: 655, eur: 608, weatherCity: 'Berlin' },
  { id: 'beijing', name: 'Пекин', flag: '🇨🇳', countryKey: 'Китай', img: '/assets/city_beijing.png', kzt: 215000, usd: 472, eur: 438, weatherCity: 'Beijing' },
]

const currencySymbols = { kzt: '₸', usd: '$', eur: '€' }

export default function Destinations() {
  const { t } = useLang()
  const [currency, setCurrency] = useState('kzt')
  const [weather, setWeather] = useState({})
  const [hoveredCity, setHoveredCity] = useState(null)

  const formatPrice = (dest) => {
    const val = dest[currency]
    const sym = currencySymbols[currency]
    return currency === 'kzt'
      ? `${val.toLocaleString('ru-KZ')} ${sym}`
      : `${sym} ${val.toLocaleString('en')}`
  }

  const fetchWeather = async (city, cityId) => {
    if (weather[cityId]) return
    try {
      const key = import.meta.env.VITE_WEATHER_API_KEY
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=ru`
      )
      setWeather(prev => ({
        ...prev,
        [cityId]: {
          temp: Math.round(res.data.main.temp),
          desc: res.data.weather[0].description,
          icon: res.data.weather[0].icon,
        }
      }))
    } catch {
      // Fallback demo data
      const demos = { almaty: { temp: 18, desc: 'ясно', icon: '01d' }, istanbul: { temp: 22, desc: 'облачно', icon: '03d' }, dubai: { temp: 38, desc: 'солнечно', icon: '01d' }, vienna: { temp: 14, desc: 'пасмурно', icon: '04d' }, berlin: { temp: 12, desc: 'дождь', icon: '10d' }, beijing: { temp: 20, desc: 'ясно', icon: '02d' } }
      setWeather(prev => ({ ...prev, [cityId]: demos[cityId] }))
    }
  }

  return (
    <section className="section destinations-section" id="destinations">
      <div className="section-inner">
        <div className="section-header reveal">
          <span className="section-tag">{t('dest-tag')}</span>
          <h2 className="section-title">
            {t('dest-title-1')} <span>{t('dest-title-2')}</span>
          </h2>
          <p className="section-subtitle">{t('dest-subtitle')}</p>
        </div>

        <div className="currency-switcher" id="currency-switcher">
          {['kzt', 'usd', 'eur'].map(c => (
            <button key={c} className={`currency-btn ${currency === c ? 'active' : ''}`}
              onClick={() => setCurrency(c)}>
              {currencySymbols[c]} {c.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="destinations-grid">
          {destinations.map((dest, i) => (
            <div key={dest.id}
              className={`dest-card reveal ${dest.large ? 'dest-card--large' : ''}`}
              id={`dest-${dest.id}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
              onMouseEnter={() => { setHoveredCity(dest.id); fetchWeather(dest.weatherCity, dest.id) }}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <div className="dest-img-wrap">
                <img src={dest.img} alt={dest.name} className="dest-img" loading="lazy" />
                <div className="dest-overlay" />
              </div>
              <div className="dest-info">
                <div className="dest-meta">
                  <span className="dest-flag">{dest.flag}</span>
                  <span className="dest-country">{dest.countryKey}</span>
                </div>
                <h3 className="dest-name">{dest.name}</h3>
                <div className="dest-price">
                  <span>{t('from-text')}</span>
                  <strong className="price-value">{formatPrice(dest)}</strong>
                </div>
                {hoveredCity === dest.id && weather[dest.id] && (
                  <div className="dest-weather">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather[dest.id].icon}.png`}
                      alt={weather[dest.id].desc}
                      className="weather-icon"
                    />
                    <span>{weather[dest.id].temp}°C · {weather[dest.id].desc}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
