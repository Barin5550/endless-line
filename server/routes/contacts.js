const express = require('express')
const db = require('../db')
const router = express.Router()

// POST /api/contacts — save contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name?.trim()) return res.status(400).json({ message: 'Введите ваше имя' })
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: 'Некорректный email' })
    if (!message?.trim() || message.trim().length < 10)
      return res.status(400).json({ message: 'Сообщение минимум 10 символов' })

    await db.contacts.insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    })

    res.status(201).json({ message: 'Сообщение принято. Мы ответим в течение 2 часов.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
