// models/Pet.js
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Perro, gato, etc.
  age: { type: Number },
  breed: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Relación con el usuario
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
