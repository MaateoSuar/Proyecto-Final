const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false },
  country: { type: String, required: true },
  countryChanged: { type: Boolean, default: false }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
