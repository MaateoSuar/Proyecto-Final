// controllers/chatController.js
const Mensaje = require('../models/Mensaje.js');
const Reservation = require('../models/Reservation.js');

const enviarMensaje = async (req, res) => {
  const { reservaId, mensaje } = req.body;
  const emisorId = req.user.id;

  try {
    const reserva = await Reservation.findById(reservaId);
    if (!reserva) {
      return res.status(403).json({ mensaje: 'No se puede enviar mensaje sin reserva' });
    }

    // Verificamos que el emisor sea parte de la reserva
    if (reserva.user.toString() !== emisorId && reserva.provider.toString() !== emisorId) {
      return res.status(403).json({ mensaje: 'No autorizado para enviar mensajes en esta reserva' });
    }

    const nuevoMensaje = new Mensaje({ reservaId, emisorId, emisorTipo: 'Usuario', mensaje });
    await nuevoMensaje.save();

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
    res.status(500).json({ mensaje: 'Error al obtener mensajes' });
  }
};

module.exports = {
  enviarMensaje,
  obtenerMensajes
};
