const express = require('express')
const auth = require('../middleware/auth')
const db = require('../db')
const router = express.Router()

const PRICES = { train: 45000, cruise: 280000, air: 95000 }

router.use(auth)

// GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await db.bookings.find({ userId: req.userId }, { createdAt: -1 })
    res.json(bookings)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { type, from, to, departDate, returnDate, passengers } = req.body
    if (!type || !from?.trim() || !to?.trim() || !departDate)
      return res.status(400).json({ message: 'Заполните все обязательные поля' })
    if (from.trim().toLowerCase() === to.trim().toLowerCase())
      return res.status(400).json({ message: 'Города отправления и назначения должны различаться' })

    const pax = Math.max(1, Math.min(9, parseInt(passengers) || 1))
    const price = (PRICES[type] || 50000) * pax

    const booking = await db.bookings.insert({
      userId: req.userId, type,
      from: from.trim(), to: to.trim(),
      departDate, returnDate: returnDate || null,
      passengers: pax, price, status: 'confirmed',
      createdAt: new Date().toISOString()
    })
    res.status(201).json(booking)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    const n = await db.bookings.remove({ _id: req.params.id, userId: req.userId })
    if (!n) return res.status(404).json({ message: 'Бронирование не найдено' })
    res.json({ message: 'Бронирование отменено' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
