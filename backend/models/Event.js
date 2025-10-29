const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['movie', 'concert', 'sports', 'comedy'],
    required: true
  },
  venue: {
    name: {
      type: String,
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
    }
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: String,
  ticketTypes: [{
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      required: true
    }
  }],
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x600'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  language: String,
  ageRating: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

EventSchema.index({ 'venue.location': '2dsphere' });

module.exports = mongoose.model('Event', EventSchema);
