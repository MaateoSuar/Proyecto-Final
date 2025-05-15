const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 Conectado a MongoDB');
    app.listen(process.env.PORT || 5000, () => console.log(`Servidor en puerto ${process.env.PORT}`));
  })
  .catch((err) => console.error('❌ Error de conexión:', err));
