const mongoose = require('mongoose');

const ubicacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['casa', 'trabajo', 'otro'],
    default: 'casa'
  },
  calle: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    required: true
  },
  referencia: {
    type: String
  },
  coordenadas: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  predeterminada: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Asegurarse de que solo una ubicación sea predeterminada por usuario
ubicacionSchema.pre('save', async function(next) {
  if (this.predeterminada) {
    await this.constructor.updateMany(
      { usuario: this.usuario, _id: { $ne: this._id } },
      { predeterminada: false }
    );
  }
  next();
});

const Ubicacion = mongoose.model('Ubicacion', ubicacionSchema);

module.exports = Ubicacion; 