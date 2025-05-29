const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const prestadorRoutes = require('./routes/prestador');
const ubicacionRoutes = require('./routes/ubicaciones');
const path = require('path');
const reservationRoutes = require('./routes/reservations')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/reservas', reservationRoutes);
app.use('/api/prestadores', prestadorRoutes);
app.use('/api/ubicaciones', ubicacionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🟢 port: ${process.env.PORT}`));
  })
  .catch((err) => console.error('❌ Error de conexión:', err));
