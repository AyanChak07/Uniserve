const mongoose = require('mongoose')

const chatBookingSchema = new mongoose.Schema({
  userId: String,
  type: String, // ride, food, medical, etc.
  data: Object,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('ChatBooking', chatBookingSchema)