const express = require('express')
const auth = require('../middleware/auth')
const db = require('../db')
const router = express.Router()

router.use(auth)

// GET /api/favorites — get user's favorite tour IDs
router.get('/', async (req, res) => {
  try {
    const favs = await db.favorites.find({ userId: req.userId })
    res.json(favs)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/favorites — add a tour to favorites
router.post('/', async (req, res) => {
  try {
    const { tourId, tourName } = req.body
    if (!tourId) return res.status(400).json({ message: 'tourId обязателен' })
    const existing = await db.favorites.findOne({ userId: req.userId, tourId })
    if (existing) return res.json(existing)
    const fav = await db.favorites.insert({
      userId: req.userId, tourId, tourName: tourName || '',
      createdAt: new Date().toISOString()
    })
    res.status(201).json(fav)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/favorites/:tourId — remove from favorites
router.delete('/:tourId', async (req, res) => {
  try {
    await db.favorites.remove({ userId: req.userId, tourId: req.params.tourId })
    res.json({ message: 'Удалено из избранного' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
