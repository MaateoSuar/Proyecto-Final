// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider', 
    required: true 
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: false
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, // formato HH:mm o un ISO String si prefieres
    required: true 
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
