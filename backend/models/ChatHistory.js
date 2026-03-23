const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  userId: String,
  message: String,
  intent: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('ChatHistory', chatSchema)