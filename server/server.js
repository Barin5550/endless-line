const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// Ensure data directory exists
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true })

const app = express()

// Security headers
app.use(helmet({ crossOriginEmbedderPolicy: false }))

app.use(cors({ origin: true, credentials: true }))

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..')))
app.use(express.json())

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Слишком много попыток. Попробуйте снова через 15 минут.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: 'Слишком много запросов. Подождите немного.' },
})

app.use('/api/auth', authLimiter)
app.use('/api', generalLimiter)

app.use('/api/auth', require('./routes/auth'))
app.use('/api/bookings', require('./routes/bookings'))
app.use('/api/reviews', require('./routes/reviews'))
app.use('/api/contacts', require('./routes/contacts'))

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const db = require('./db')
    const [users, bookings, reviews, contacts] = await Promise.all([
      db.users.count({}),
      db.bookings.count({}),
      db.reviews.count({}),
      db.contacts.count({}),
    ])
    res.json({ users, bookings, reviews, contacts })
  } catch {
    res.json({ users: 0, bookings: 0, reviews: 0, contacts: 0 })
  }
})

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'nedb', time: new Date() }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Внутренняя ошибка сервера' })
})

// 404 handler — serve 404.html for unknown routes (non-API)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Маршрут не найден' })
  }
  res.status(404).sendFile(path.join(__dirname, '..', '404.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Endless Line server → http://localhost:${PORT}`))
