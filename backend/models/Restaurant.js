const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['appetizer', 'main', 'dessert', 'beverage'],
    required: true
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/200x200'
  },
  available: {
    type: Boolean,
    default: true
  }
});

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  cuisine: {
    type: [String],
    required: true
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
    },
    address: {
      type: String,
      required: true
    }
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 1,
    max: 5
  },
  deliveryTime: {
    type: String,
    default: '30-45 mins'
  },
  minOrder: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 40
  },
  menu: [MenuItemSchema],
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300'
  },
  openingHours: {
    type: String,
    default: '9:00 AM - 11:00 PM'
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

RestaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', RestaurantSchema);

