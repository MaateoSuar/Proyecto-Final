const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('../models/Usuario.js');

async function checkAndUpdateUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 Conectado a MongoDB');

    // Buscar el usuario
    const usuario = await Usuario.findOne({ email: 'maateosuar@gmail.com' });
    
    if (!usuario) {
      // Si no existe, lo creamos
      const hashedPassword = await bcrypt.hash('12345678', 10);
      const nuevoUsuario = new Usuario({
        fullName: 'Mateo Suarez',
        email: 'maateosuar@gmail.com',
        password: hashedPassword,
        isAdmin: false
      });
      await nuevoUsuario.save();
      console.log('✅ Usuario creado exitosamente');
    } else {
      // Si existe, actualizamos la contraseña
      const hashedPassword = await bcrypt.hash('12345678', 10);
      usuario.password = hashedPassword;
      await usuario.save();
      console.log('✅ Contraseña actualizada exitosamente');
    }

    // Mostrar todos los usuarios
    const usuarios = await Usuario.find();
    console.log('\nUsuarios en la base de datos:');
    console.log(usuarios.map(u => ({
      id: u._id,
      email: u.email,
      fullName: u.fullName,
      isAdmin: u.isAdmin
    })));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

checkAndUpdateUser(); 