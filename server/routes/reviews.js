const express = require('express')
const auth = require('../middleware/auth')
const db = require('../db')
const router = express.Router()

// GET /api/reviews  — all approved reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await db.reviews.find({}, { createdAt: -1 })
    // Attach only safe user info (already stored in review)
    res.json(reviews)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/reviews  — logged in users only
router.post('/', auth, async (req, res) => {
  try {
    const { rating, text, destination } = req.body
    if (!text?.trim() || text.trim().length < 10)
      return res.status(400).json({ message: 'Отзыв должен содержать минимум 10 символов' })
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Оценка от 1 до 5' })

    // Check if user already left a review
    const existing = await db.reviews.findOne({ userId: req.userId })
    if (existing) return res.status(400).json({ message: 'Вы уже оставили отзыв. Чтобы написать новый — удалите старый.' })

    // Get user name
    const user = await db.users.findOne({ _id: req.userId })
    if (!user) return res.status(401).json({ message: 'Пользователь не найден' })

    const review = await db.reviews.insert({
      userId: req.userId,
      userName: user.name,
      rating: parseInt(rating),
      text: text.trim(),
      destination: destination?.trim() || null,
      createdAt: new Date().toISOString()
    })
    res.status(201).json(review)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/reviews/:id  — own review only
router.delete('/:id', auth, async (req, res) => {
  try {
    const n = await db.reviews.remove({ _id: req.params.id, userId: req.userId })
    if (!n) return res.status(404).json({ message: 'Отзыв не найден' })
    res.json({ message: 'Отзыв удалён' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
