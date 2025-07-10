// models/Mensaje.js
const mongoose = require('mongoose');
const mensajeSchema = new mongoose.Schema({
  reservaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reserva',
    required: true
  },
  emisorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'emisorTipo'
  },
  emisorTipo: {
    type: String,
    required: true,
    enum: ['Usuario', 'Prestador']
  },
  nombreEmisor: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Mensaje', mensajeSchema);