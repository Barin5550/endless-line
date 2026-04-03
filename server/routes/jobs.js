const express = require('express')
const db = require('../db')
const router = express.Router()

// POST /api/jobs — save job application
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, position, resume, message } = req.body
    if (!name?.trim()) return res.status(400).json({ message: 'Введите имя' })
    if (!phone?.trim()) return res.status(400).json({ message: 'Введите телефон' })
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: 'Некорректный email' })
    if (!position?.trim()) return res.status(400).json({ message: 'Не указана вакансия' })

    await db.jobs.insert({
      name: name.trim(), phone: phone.trim(),
      email: email.toLowerCase().trim(),
      position: position.trim(),
      resume: resume?.trim() || null,
      message: message?.trim() || null,
      createdAt: new Date().toISOString(),
      status: 'new'
    })
    res.status(201).json({ message: 'Отклик принят! Свяжемся в течение 2 рабочих дней.' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
