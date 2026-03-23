const mongoose = require('mongoose')

const preferenceSchema = new mongoose.Schema({
  userId: String,
  preferences: {
    transport: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    household: { type: Number, default: 0 },
    entertainment: { type: Number, default: 0 }
  }
})

module.exports = mongoose.model('UserPreference', preferenceSchema)