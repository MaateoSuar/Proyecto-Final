const mongoose = require('mongoose');

const prestadorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  services: [{
    type: {
      type: String,
      enum: ['paseo', 'cuidado', 'peluqueria', 'dentista'],
      required: true
    },
    description: String,
    price: Number
  }],
  availability: [{
    day: String,
    slots: [String]
  }],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    comment: String,
    rating: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  profileImage: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Crear índice para búsquedas geoespaciales
prestadorSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Prestador', prestadorSchema); 