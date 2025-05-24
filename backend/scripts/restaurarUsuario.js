const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('../models/Usuario.js');

async function restaurarUsuario() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/petcare');
    console.log('🟢 Conectado a MongoDB');

    // Verificar si el usuario existe
    let usuario = await Usuario.findOne({ email: 'maateosuar@gmail.com' });
    
    if (!usuario) {
      // Si no existe, lo creamos
      const hashedPassword = await bcrypt.hash('12345678', 10);
      usuario = new Usuario({
        fullName: 'Mateo Suarez',
        email: 'maateosuar@gmail.com',
        password: hashedPassword,
        isAdmin: false
      });
      await usuario.save();
      console.log('✅ Usuario restaurado exitosamente');
    } else {
      // Si existe, actualizamos la contraseña
      const hashedPassword = await bcrypt.hash('12345678', 10);
      usuario.password = hashedPassword;
      await usuario.save();
      console.log('✅ Contraseña actualizada exitosamente');
    }

    // Mostrar todos los usuarios en la base de datos
    const usuarios = await Usuario.find();
    console.log('\nUsuarios en la base de datos:');
    usuarios.forEach(u => {
      console.log(`- ${u.email} (${u.fullName})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

restaurarUsuario(); 