const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['train', 'cruise', 'air'],
    required: true
  },
  from: {
    type: String,
    required: [true, 'Город отправления обязателен'],
    trim: true
  },
  to: {
    type: String,
    required: [true, 'Город назначения обязателен'],
    trim: true
  },
  departDate: {
    type: Date,
    required: [true, 'Дата отправления обязательна']
  },
  returnDate: {
    type: Date
  },
  passengers: {
    type: Number,
    default: 1,
    min: [1, 'Минимум 1 пассажир'],
    max: [9, 'Максимум 9 пассажиров']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  price: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
