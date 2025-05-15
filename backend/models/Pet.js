// models/Pet.js
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String },
  birthdate: { type: Date },
  weight: { type: Number },
  spayed: { type: Boolean, default: false },
  vaccines: [{ type: String }],
  allergies: [{ type: String }],
  image: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
