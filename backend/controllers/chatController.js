// controllers/chatController.js
const Mensaje = require('../models/Mensaje.js');
const Reservation = require('../models/Reservation.js');
const User = require('../models/Usuario.js');
const Prestador = require('../models/Prestador.js');
/*
const enviarMensaje = async (req, res) => {
  const { reservaId, mensaje } = req.body;
  const emisorId = req.user.id;

  try {
    const reserva = await Reservation.findById(reservaId);
    if (!reserva) {
      return res.status(403).json({ mensaje: 'No se puede enviar mensaje sin reserva' });
    }

    let emisorTipo = '';
    let nombreEmisor = '';

    if (reserva.user.toString() === emisorId) {
      emisorTipo = 'Usuario';
      const user = await User.findById(emisorId);
      nombreEmisor = user?.fullName || 'Usuario';
    } else if (reserva.provider.toString() === emisorId) {
      emisorTipo = 'Prestador';
      const prestador = await Prestador.findById(emisorId);
      nombreEmisor = prestador?.name || 'Prestador';
    } else {
      return res.status(403).json({ mensaje: 'No autorizado para enviar mensajes en esta reserva' });
    }

    const nuevoMensaje = new Mensaje({
      reservaId,
      emisorId,
      emisorTipo,
      mensaje,
      nombreEmisor
    });

    await nuevoMensaje.save();
    const receptorId = emisorTipo === 'Usuario' ? reserva.provider.toString() : reserva.user.toString();
    req.app.get('io').to(receptorId).emit('mensajeRecibido', nuevoMensaje);
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al enviar mensaje' });
    console.error(error);
  }
};*/
const enviarMensaje = async (req, res) => {
  const { reservaId, mensaje, emisorTipo: emisorTipoBody, emisorId: emisorIdBody } = req.body;
  const emisorId = req.user?.id || emisorIdBody; // puede ser undefined si no hay token

  try {
    const reserva = await Reservation.findById(reservaId);
    if (!reserva) {
      return res.status(403).json({ mensaje: 'No se puede enviar mensaje sin reserva' });
    }

    let emisorTipo = '';
    let nombreEmisor = '';

    if (emisorId) {
      // Token presente, lógica original
      if (reserva.user.toString() === emisorId) {
        emisorTipo = 'Usuario';
        const user = await User.findById(emisorId);
        nombreEmisor = user?.fullName || 'Usuario';
      } else if (reserva.provider.toString() === emisorId) {
        emisorTipo = 'Prestador';
        const prestador = await Prestador.findById(emisorId);
        nombreEmisor = prestador?.name || 'Prestador';
      } else {
        return res.status(403).json({ mensaje: 'No autorizado para enviar mensajes en esta reserva' });
      }
    } else if (emisorTipoBody === 'Prestador') {
      // No token pero dice que es prestador, lo aceptamos
      emisorTipo = 'Prestador';
      nombreEmisor = 'Prestador (sin token)';
      // opcional: validar que reserva.provider exista o algo más
    } else {
      return res.status(403).json({ mensaje: 'No autorizado para enviar mensajes sin token' });
    }

    const nuevoMensaje = new Mensaje({
      reservaId,
      emisorId: emisorId || null,
      emisorTipo,
      mensaje,
      nombreEmisor
    });

    await nuevoMensaje.save();

    const receptorId = emisorTipo === 'Usuario' ? reserva.provider.toString() : reserva.user.toString();
    req.app.get('io').to(receptorId).emit('mensajeRecibido', nuevoMensaje);

    res.status(201).json(nuevoMensaje);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al enviar mensaje' });
    console.error(error);
  }
};


const obtenerMensajes = async (req, res) => {
  const { reservaId } = req.params;
  const userId = req.user.id;

  try {
    const reserva = await Reservation.findById(reservaId);


    if (!reserva) {
      return res.status(403).json({ mensaje: 'Reserva no válida' });
    }

    if (reserva.user.toString() !== userId && reserva.provider.toString() !== userId) {
      return res.status(403).json({ mensaje: 'No autorizado para ver mensajes de esta reserva' });
    }

    const mensajes = await Mensaje.find({ reservaId }).sort({ fecha: 1 });
    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ mensaje: 'Error al obtener mensajes' });
  }
};

module.exports = {
  enviarMensaje,
  obtenerMensajes
};
