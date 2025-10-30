const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventInfo: {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },       // or Date type if you prefer
    time: { type: String, required: true },
    ticketTypes: [{
      type: { type: String, required: true },
      price: { type: Number, required: true },
      available: { type: Number, required: true }
    }],
    image: { type: String }
  },
  ticketType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerTicket: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  status: {
    type: String,
    enum: ['active', 'used', 'cancelled'],
    default: 'active'
  },
  qrCode: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ticket', TicketSchema);