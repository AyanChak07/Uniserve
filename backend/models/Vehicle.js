const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['bike', 'car', 'suv']
  },
  model: {
    type: String,
    required: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  driver: {
    name: String,
    phone: String,
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  available: {
    type: Boolean,
    default: true
  },
  pricePerKm: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

VehicleSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vehicle', VehicleSchema);
