// server.js
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const passport = require('passport');
require('./utils/googleStrategy');

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const prestadorRoutes = require('./routes/prestador');
const ubicacionRoutes = require('./routes/ubicaciones');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/report');
const reservationRoutes = require('./routes/reservations');
const sugerenciasRoutes = require('./routes/sugerencias');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.set('io', io);

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'petcare_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/reservas', reservationRoutes);
app.use('/api/prestadores', prestadorRoutes);
app.use('/api/ubicaciones', ubicacionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sugerencias', sugerenciasRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔌 Socket.io listeners
io.on('connection', socket => {
  socket.on('joinSala', userId => {
    socket.join(userId);
  });

  socket.on('reservaRealizada', data => {
    io.to(data.proveedorId).emit('notificacionReserva', {
      titulo: 'Nueva reserva',
      mensaje: `Tenés una nueva reserva para el ${data.fecha} a las ${data.hora}`,
      ...data
    });
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🟢 Servidor y WebSocket corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ Error de conexión:', err));
 