const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adress: { type: String, default: "" },
  phone: { type: String, default: "" }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
