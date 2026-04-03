/**
 * ============================================================
 * ENDLESS LINE — Маршруты авторизации (api/routes/auth.js)
 * ============================================================
 * POST   /api/auth/register  → Регистрация нового пользователя
 * POST   /api/auth/login     → Вход в аккаунт (получение JWT)
 * GET    /api/auth/me        → Получить данные текущего пользователя
 * PUT    /api/auth/profile   → Обновить профиль (имя, телефон)
 * PUT    /api/auth/password  → Сменить пароль
 * ============================================================
 * Безопасность:
 * - Пароли хешируются bcrypt с saltRounds=12 (очень надёжно)
 * - Токены JWT живут 7 дней, подписаны JWT_SECRET
 * - Одинаковое сообщение при неверном email И пароле (защита от enum)
 * ============================================================
 */

const express = require('express')    // HTTP-фреймворк
const bcrypt  = require('bcryptjs')  // Хеширование паролей (более надёжный чем bcrypt c binding)
const jwt     = require('jsonwebtoken') // JSON Web Tokens — авторизация без сессий
const db      = require('../db')     // Наша NeDB база данных
const router  = express.Router()      // Отдельный мини-роутер для /api/auth/*

/**
 * Генерирует JWT-токен для пользователя
 * @param {string} id - _id пользователя из NeDB
 * @returns {string} Подписанный JWT-токен
 *
 * Токен содержит: { id: '...' }  — только ID, не email/пароль!
 * expiresIn: '7d' — токен истекает через 7 дней, затем нужно войти снова
 */
const sign = (id) => jwt.sign(
  { id },                                                    // Payload токена
  process.env.JWT_SECRET || 'endless_secret_2026',         // Секретный ключ (из .env)
  { expiresIn: '7d' }                                       // Срок жизни токена
)

// ── РЕГИСТРАЦИЯ ───────────────────────────────────────────────
/**
 * POST /api/auth/register
 * Создаёт новый аккаунт пользователя
 * Body: { name, email, password, phone? }
 * Response: { token, user: { id, name, email, phone } }
 */
router.post('/register', async (req, res) => {
  try {
    // Деструктурируем тело запроса (req.body — это JSON от клиента)
    const { name, email, password, phone } = req.body

    // ── Валидация входных данных ──────────────────────────────
    // Проверяем что обязательные поля не пустые
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' })

    // Имя минимум 2 символа
    if (name.trim().length < 2)
      return res.status(400).json({ message: 'Имя должно содержать минимум 2 символа' })

    // Пароль минимум 6 символов
    if (password.length < 6)
      return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' })

    // Проверка формата email с помощью регулярного выражения
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: 'Некорректный формат email' })

    // ── Проверка уникальности email ───────────────────────────
    // Ищем пользователя с таким же email (email.toLowerCase() — регистронезависимо)
    const existing = await db.users.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(400).json({ message: 'Этот email уже зарегистрирован' })

    // ── Хеширование пароля ────────────────────────────────────
    // bcrypt.hash(password, 12) — 12 раундов соления (2^12 = 4096 операций)
    // Это делает брутфорс паролей крайне медленным даже при утечке БД
    const hash = await bcrypt.hash(password, 12)

    // ── Сохранение в базу данных ──────────────────────────────
    const user = await db.users.insert({
      name:      name.trim(),               // Имя без лишних пробелов
      email:     email.toLowerCase(),       // Email в нижнем регистре (единообразие)
      password:  hash,                      // НИКОГДА не сохраняем открытый пароль!
      phone:     phone?.trim() || null,     // Телефон опционален
      createdAt: new Date().toISOString()   // Дата регистрации в ISO формате
    })

    // ── Ответ: токен + данные пользователя ───────────────────
    // Статус 201 Created (а не 200 OK) — стандарт REST для создания ресурса
    res.status(201).json({
      token: sign(user._id),  // JWT-токен для авторизации последующих запросов
      user: {                  // Данные пользователя (без пароля!)
        id:    user._id,
        name:  user.name,
        email: user.email,
        phone: user.phone
      }
    })
  } catch (err) {
    // Любая непредвиденная ошибка → 500 Internal Server Error
    res.status(500).json({ message: 'Ошибка при регистрации. Попробуйте позже.' })
  }
})

// ── ВХОД В АККАУНТ ────────────────────────────────────────────
/**
 * POST /api/auth/login
 * Проверяет учётные данные и выдаёт JWT-токен
 * Body: { email, password }
 * Response: { token, user: { id, name, email, phone } }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Базовая проверка — оба поля должны быть заполнены
    if (!email || !password)
      return res.status(400).json({ message: 'Введите email и пароль' })

    // Ищем пользователя по email (toLowerCase — нечувствительность к регистру)
    const user = await db.users.findOne({ email: email.toLowerCase() })

    // НАМЕРЕННО одинаковое сообщение для несуществующего email И неверного пароля
    // Это защита "security through obscurity" — атакующий не знает, что именно неверно
    if (!user) return res.status(401).json({ message: 'Неверный email или пароль' })

    // bcrypt.compare() сравнивает введённый пароль с хешем в БД
    // Возвращает true/false — никогда не дехеширует (это физически невозможно)
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Неверный email или пароль' })

    // Успех! Возвращаем токен и данные пользователя
    res.json({
      token: sign(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone || null }
    })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при входе. Попробуйте позже.' })
  }
})

// ── ПОЛУЧЕНИЕ СВОЕГО ПРОФИЛЯ ──────────────────────────────────
/**
 * GET /api/auth/me
 * Возвращает данные авторизованного пользователя
 * Headers: Authorization: Bearer <token>
 * Response: { id, name, email, phone, createdAt }
 */
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    // req.userId устанавливается JWT middleware (middleware/auth.js)
    // Ищем пользователя по его ID из токена
    const user = await db.users.findOne({ _id: req.userId })
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' })

    // Возвращаем профиль без пароля
    res.json({
      id:        user._id,
      name:      user.name,
      email:     user.email,
      phone:     user.phone || null,
      createdAt: user.createdAt
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── ОБНОВЛЕНИЕ ПРОФИЛЯ ────────────────────────────────────────
/**
 * PUT /api/auth/profile
 * Изменяет имя и телефон пользователя
 * Headers: Authorization: Bearer <token>
 * Body: { name, phone? }
 */
router.put('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const { name, phone } = req.body
    if (!name?.trim()) return res.status(400).json({ message: 'Имя не может быть пустым' })
    if (name.trim().length < 2) return res.status(400).json({ message: 'Имя минимум 2 символа' })

    // $set — обновляем только указанные поля (остальные остаются нетронутыми)
    await db.users.update(
      { _id: req.userId },                                      // Условие поиска
      { $set: { name: name.trim(), phone: phone?.trim() || null } } // Что меняем
    )

    // Получаем обновлённые данные и возвращаем клиенту
    const updated = await db.users.findOne({ _id: req.userId })
    res.json({ id: updated._id, name: updated.name, email: updated.email, phone: updated.phone || null })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── СМЕНА ПАРОЛЯ ─────────────────────────────────────────────
/**
 * PUT /api/auth/password
 * Меняет пароль пользователя
 * Headers: Authorization: Bearer <token>
 * Body: { currentPassword, newPassword }
 */
router.put('/password', require('../middleware/auth'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Проверяем что оба поля заполнены
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Заполните все поля' })
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Новый пароль минимум 6 символов' })

    // Получаем текущие данные пользователя
    const user = await db.users.findOne({ _id: req.userId })
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' })

    // Проверяем что текущий пароль правильный (защита от смены чужого пароля)
    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) return res.status(400).json({ message: 'Неверный текущий пароль' })

    // Хешируем новый пароль и сохраняем
    const hash = await bcrypt.hash(newPassword, 12)
    await db.users.update({ _id: req.userId }, { $set: { password: hash } })
    res.json({ message: 'Пароль изменён успешно' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Экспортируем роутер для использования в index.js
module.exports = router
