const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const router = express.Router()

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'endless_secret_2026', { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' })
    if (name.trim().length < 2)
      return res.status(400).json({ message: 'Имя должно содержать минимум 2 символа' })
    if (password.length < 6)
      return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' })
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: 'Некорректный формат email' })

    const existing = await db.users.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(400).json({ message: 'Этот email уже зарегистрирован' })

    const hash = await bcrypt.hash(password, 12)
    const user = await db.users.insert({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hash,
      phone: phone?.trim() || null,
      createdAt: new Date().toISOString()
    })
    res.status(201).json({
      token: sign(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при регистрации. Попробуйте позже.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Введите email и пароль' })

    const user = await db.users.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ message: 'Неверный email или пароль' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Неверный email или пароль' })

    res.json({
      token: sign(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone || null }
    })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при входе. Попробуйте позже.' })
  }
})

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.userId })
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' })
    res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone || null, createdAt: user.createdAt })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/auth/profile — update own profile
router.put('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const { name, phone } = req.body
    if (!name?.trim()) return res.status(400).json({ message: 'Имя не может быть пустым' })
    if (name.trim().length < 2) return res.status(400).json({ message: 'Имя минимум 2 символа' })

    await db.users.update(
      { _id: req.userId },
      { $set: { name: name.trim(), phone: phone?.trim() || null } }
    )
    const updated = await db.users.findOne({ _id: req.userId })
    res.json({ id: updated._id, name: updated.name, email: updated.email, phone: updated.phone || null })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/auth/password — change password
router.put('/password', require('../middleware/auth'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Заполните все поля' })
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Новый пароль минимум 6 символов' })

    const user = await db.users.findOne({ _id: req.userId })
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' })

    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) return res.status(400).json({ message: 'Неверный текущий пароль' })

    const hash = await bcrypt.hash(newPassword, 12)
    await db.users.update({ _id: req.userId }, { $set: { password: hash } })
    res.json({ message: 'Пароль изменён успешно' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
