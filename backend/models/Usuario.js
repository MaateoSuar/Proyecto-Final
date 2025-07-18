const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nickname: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false },
  country: { type: String, default: "" }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
