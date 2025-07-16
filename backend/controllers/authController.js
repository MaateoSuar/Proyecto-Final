// controller/authController.js
const Usuario = require('../models/Usuario.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary.js');
const Prestador = require('../models/Prestador');

const registrarPrestador = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const prestadorExistente = await Prestador.findOne({ email });
    if (prestadorExistente) {
      return res.status(400).json({ msg: 'El prestador ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoPrestador = new Prestador({
      name,
      email,
      password: hashedPassword,
      phone,
      location: {
        address: '',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0] // Valor por defecto válido
        }
      },
      isActive: true
    });

    await nuevoPrestador.save();

    res.status(201).json({
      msg: 'Prestador registrado correctamente',
      prestador: {
        name: nuevoPrestador.name,
        email: nuevoPrestador.email,
        id: nuevoPrestador._id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const loginPrestador = async (req, res) => {
  const { email, password } = req.body;

  try {
    const prestador = await Prestador.findOne({ email });
    if (!prestador) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, prestador.password);
    if (!passwordValido) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { prestadorId: prestador._id },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      prestador: {
        name: prestador.name,
        email: prestador.email,
        id: prestador._id,
        img: prestador.profileImage || '',
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

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
    if (!usuario) {
      const usuario = await Prestador.findById(userId).select('-password');
      if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
      res.json(usuario)
      return;
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el perfil" });
    console.error(error);
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
      process.env.JWT_SECRET
    );

    res.json({ token, usuario: { fullName: usuario.fullName, email: usuario.email, id: usuario._id } });
  } catch (error) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { fullName, address, phone } = req.body;
  const updateFields = { fullName, address, phone };

  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'profiles' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updateFields.profileImage = result.secure_url;
    }

    const updatedUser = await Usuario.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al actualizar perfil" });
  }
};

// Nuevo controlador para obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select('-password')
      .sort({ fullName: 1 }); // Ordenar por nombre

    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron usuarios'
      });
    }

    res.json({
      success: true,
      data: usuarios,
      count: usuarios.length
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// Nuevo controlador para eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const usuario = await Usuario.findByIdAndDelete(userId);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

const cambiarPassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // Buscar el usuario
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar la contraseña actual
    const passwordValido = await bcrypt.compare(currentPassword, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ msg: 'La contraseña actual es incorrecta' });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    usuario.password = hashedPassword;
    await usuario.save();

    res.json({ msg: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ msg: 'Error al cambiar la contraseña' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Usuario.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.json({ data: user });
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};


module.exports = {
  loginUsuario,
  registrarUsuario,
  updateProfile,
  obtenerPerfil,
  getAllUsers,
  deleteUser,
  cambiarPassword,
  registrarPrestador,
  loginPrestador,
  getUserById
};
