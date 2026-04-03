/**
 * ============================================================
 * ENDLESS LINE — Главный файл сервера (api/index.js)
 * ============================================================
 * Стек: Node.js + Express.js
 * База данных: NeDB (NoSQL, хранение в файлах .db)
 * Безопасность: Helmet (CSP), bcrypt, JWT, rate-limit
 * Деплой: Vercel (Serverless Functions)
 * ============================================================
 */

// ── ИМПОРТЫ ──────────────────────────────────────────────────
const express  = require('express')           // HTTP-фреймворк для создания REST API
const cors     = require('cors')              // Разрешает запросы с других доменов (браузер → сервер)
const helmet   = require('helmet')            // Добавляет заголовки безопасности (XSS, CSP, и др.)
const rateLimit = require('express-rate-limit') // Ограничивает частоту запросов (защита от брутфорса)
const fs       = require('fs')                // Встроенный модуль Node.js для работы с файловой системой
const path     = require('path')              // Встроенный модуль для работы с путями (кросс-платформенно)
require('dotenv').config()                    // Загружает переменные из .env файла (JWT_SECRET и др.)

// ── ПОДГОТОВКА ПАПКИ ДЛЯ БАЗЫ ДАННЫХ ────────────────────────
// Создаёт папку api/data/ если её нет (там хранятся .db файлы NeDB)
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true })

// ── ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ─────────────────────────────────
const app = express()  // Создаём экземпляр Express-приложения

// ── БЕЗОПАСНОСТЬ: HELMET + CSP ───────────────────────────────
// Content Security Policy (CSP) — белый список разрешённых источников
// Защищает от XSS-атак (внедрение вредоносного кода)
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Отключаем COEP — иначе браузер блокирует CDN-ресурсы

  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],         // По умолчанию — только с нашего сервера
      scriptSrc: [
        "'self'",                     // Наши собственные JS-файлы
        "'unsafe-inline'",            // Inline-скрипты в HTML (onclick="...", <script>)
        "'unsafe-eval'",              // eval() — нужен для Babel (JSX компиляция в браузере)
        "https://cdn.jsdelivr.net",   // CDN: React, ReactDOM, React Router
        "https://cdnjs.cloudflare.com", // CDN: Babel standalone
        "https://unpkg.com",          // CDN: альтернативный источник библиотек
        "https://d3js.org",           // D3.js — интерактивная карта мира
      ],
      scriptSrcAttr: ["'unsafe-inline'"],  // Разрешает onclick="..." атрибуты в HTML
      styleSrc: [
        "'self'",                     // Наши собственные CSS-файлы
        "'unsafe-inline'",            // style="" атрибуты в HTML
        "https://fonts.googleapis.com", // Google Fonts (загрузка шрифтов)
        "https://cdn.jsdelivr.net",   // CSS из CDN
      ],
      fontSrc: [
        "'self'",                     // Локальные шрифты
        "https://fonts.gstatic.com",  // Google Fonts — сами файлы шрифтов
        "data:",                      // Base64-закодированные шрифты
      ],
      imgSrc: ["'self'", "data:", "blob:", "https:"], // Картинки: свои + base64 + blob + любые https
      connectSrc: [
        "'self'",                              // Fetch к нашему API
        "https://api.openweathermap.org",      // Погодный API (для карты)
        "https:",                              // Любые HTTPS запросы
        "http://localhost:5000",               // Локальная разработка
      ],
      frameSrc:  ["'none'"],          // Запрещаем <iframe> (защита от кликджекинга)
      objectSrc: ["'none'"],          // Запрещаем <object>, <embed> (устаревшие опасные теги)
    },
  },
}))

// ── CORS ─────────────────────────────────────────────────────
// Cross-Origin Resource Sharing: разрешаем запросы с любого домена
// credentials: true — разрешает передачу куки и заголовков авторизации
app.use(cors({ origin: true, credentials: true }))

// ── ПАРСИНГ ТЕЛА ЗАПРОСА ─────────────────────────────────────
// ВАЖНО: должен быть ДО маршрутов, иначе req.body будет пустым
app.use(express.json({ limit: '1mb' }))              // Для JSON (Content-Type: application/json)
app.use(express.urlencoded({ extended: true, limit: '1mb' })) // Для HTML-форм

// ── СТАТИЧЕСКИЕ ФАЙЛЫ ────────────────────────────────────────
// Раздаёт все HTML, CSS, JS, картинки из корневой папки проекта
// maxAge: '1h' — браузер кешируем на 1 час (ускорение загрузки)
app.use(express.static(path.join(__dirname, '..'), { maxAge: '1h' }))

// ── RATE LIMITING (ЗАЩИТА ОТ БРУТФОРСА) ─────────────────────
// Для /api/auth: максимум 20 запросов за 15 минут
// Защищает от автоматического перебора паролей
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут в миллисекундах
  max: 20,                   // Максимум 20 запросов
  message: { message: 'Слишком много попыток. Попробуйте снова через 15 минут.' },
  standardHeaders: true,     // Возвращает заголовки RateLimit-* (стандарт RFC 6585)
  legacyHeaders: false,      // Отключаем устаревшие X-RateLimit-* заголовки
})

// Для всего API: максимум 100 запросов в минуту
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100,            // Максимум 100 запросов
  message: { message: 'Слишком много запросов. Подождите немного.' },
})

// Применяем rate limiters к нужным маршрутам
app.use('/api/auth', authLimiter)  // Строгий лимит только для авторизации
app.use('/api', generalLimiter)    // Мягкий лимит для всего остального API

// ── ПОДКЛЮЧЕНИЕ МАРШРУТОВ API ────────────────────────────────
// Каждый файл в routes/ — это отдельный Express Router
app.use('/api/auth',      require('./routes/auth'))       // POST /api/auth/register, /login
app.use('/api/bookings',  require('./routes/bookings'))   // CRUD: бронирования
app.use('/api/reviews',   require('./routes/reviews'))    // CRUD: отзывы
app.use('/api/contacts',  require('./routes/contacts'))   // POST: обратная связь
app.use('/api/favorites', require('./routes/favorites'))  // CRUD: избранные туры
app.use('/api/jobs',      require('./routes/jobs'))       // GET/POST: вакансии

// ── ENDPOINT: СТАТИСТИКА ─────────────────────────────────────
// GET /api/stats → возвращает количество записей в каждой коллекции NeDB
app.get('/api/stats', async (req, res) => {
  try {
    const db = require('./db') // Подключаем базу данных
    // Promise.all выполняет все запросы параллельно (быстрее чем последовательно)
    const [users, bookings, reviews, contacts] = await Promise.all([
      db.users.count({}),     // Считаем всех пользователей
      db.bookings.count({}),  // Считаем все бронирования
      db.reviews.count({}),   // Считаем все отзывы
      db.contacts.count({}),  // Считаем все обращения
    ])
    res.json({ users, bookings, reviews, contacts }) // Возвращаем в JSON
  } catch {
    // Если БД недоступна — возвращаем нули (не роняем сервер)
    res.json({ users: 0, bookings: 0, reviews: 0, contacts: 0 })
  }
})

// ── ENDPOINT: HEALTH CHECK ────────────────────────────────────
// GET /api/health → проверка работоспособности сервера
// Используется для мониторинга и деплоя
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', db: 'nedb', time: new Date() })
)

// ── ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК ─────────────────────────────
// Перехватывает все необработанные ошибки в middleware
// next(err) из любого маршрута попадает сюда
app.use((err, req, res, next) => {
  console.error(err.stack)  // Выводим стектрейс в консоль сервера
  res.status(500).json({ message: 'Внутренняя ошибка сервера' })
})

// ── ОБРАБОТЧИК 404 ────────────────────────────────────────────
// Срабатывает если ни один маршрут выше не совпал
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    // API-запрос к несуществующему эндпоинту → JSON-ошибка
    return res.status(404).json({ message: 'Маршрут не найден' })
  }
  // Браузерный запрос → показываем нашу красивую 404-страницу
  res.status(404).sendFile(path.join(__dirname, '..', '404.html'))
})

// ── ЗАПУСК СЕРВЕРА ────────────────────────────────────────────
const PORT = process.env.PORT || 5000  // Берём порт из .env или используем 5000

// Запускаем HTTP-сервер только при локальной разработке
// На Vercel сервер не запускается напрямую — Vercel сам управляет воркерами
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Endless Line server → http://localhost:${PORT}`))
}

// Экспортируем Express-приложение для Vercel (serverless entry point)
module.exports = app
