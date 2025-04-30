// controller/authController.js
const Usuario = require('../models/Usuario.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ msg: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      fullName,
      email,
      password: hashedPassword,
      address: "",
      phone: ""
    });

    await nuevoUsuario.save();

    res.status(201).json({ 
      msg: 'Usuario registrado correctamente',
      usuario: {
        fullName: nuevoUsuario.fullName,
        email: nuevoUsuario.email,
      }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const obtenerPerfil = async (req, res) => {
  const userId = req.user.id;

  try {
    const usuario = await Usuario.findById(userId).select('-password'); // excluye password
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el perfil" });
  }
};

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign(
      { userId: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, usuario: { fullName: usuario.fullName, email: usuario.email } });
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id; // asumimos que el middleware agrega `req.user`
  const { fullName, address, phone } = req.body;

  try {
    const updatedUser = await Usuario.findByIdAndUpdate(
      userId,
      { fullName, address, phone },
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar perfil" });
  }
};

module.exports = {	loginUsuario, registrarUsuario, updateProfile, obtenerPerfil };
