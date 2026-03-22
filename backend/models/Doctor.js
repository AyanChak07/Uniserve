const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  availability: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);