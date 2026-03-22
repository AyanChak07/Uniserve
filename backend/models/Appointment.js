const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String, // e.g. "2026-02-15"
      required: true,
    },
    time: {
      type: String, // e.g. "10:30 AM"
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate booking
AppointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  { unique: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);