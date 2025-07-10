// controllers/reservationController.js
const Reservation = require('../models/Reservation');
const Pet = require('../models/Pet');
const Provider = require('../models/Prestador');
const sendEmail = require('../utils/sendEmail');

const createReservation = async (req, res) => {
  try {
    const { provider, pet, date, time } = req.body;
    const userId = req.user.id; // Asegúrate de tener middleware de autenticación que agregue req.user

    // Validar existencia del proveedor y la mascota
    const existingPet = await Pet.findById(pet);
    const existingProvider = await Provider.findById(provider);

    if (!existingPet || !existingProvider) {
      return res.status(404).json({ message: 'No se encontró la mascota o el proveedor' });
    }

    const fechaReserva = new Date(date); // date es string tipo '2025-07-09'

    const reservation = new Reservation({
      user: userId,
      provider,
      pet,
      date: fechaReserva,
      time,
      status: 'pendiente'
    });

    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }) // solo las del usuario logueado
      .populate('user', 'fullName email') // si querés los datos del usuario
      .populate('provider', 'name email')
      .populate('pet', 'name type');

    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las reservas' });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Buscar la reserva y verificar que pertenezca al usuario
    const reservation = await Reservation.findOne({ _id: id, user: userId });

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada o no autorizada' });
    }

    // Obtener el proveedor para restaurar su disponibilidad
    const provider = await Provider.findById(reservation.provider);
    if (!provider) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    // Restaurar la disponibilidad del proveedor
    const diaSemana = new Date(reservation.date).toLocaleDateString('es-AR', { weekday: 'long' }).toLowerCase();
    const dayAvailability = provider.availability.find(a => a.day.toLowerCase() === diaSemana);

    if (dayAvailability) {
      // Si el día ya existe, agregar el horario
      if (!dayAvailability.slots.includes(reservation.time)) {
        dayAvailability.slots.push(reservation.time);
        dayAvailability.slots.sort(); // Mantener los horarios ordenados
      }
    } else {
      // Si el día no existe, crearlo con el horario
      provider.availability.push({
        day: reservation.date,
        slots: [reservation.time]
      });
    }

    // Guardar los cambios en el proveedor
    await provider.save();

    reservation.status = "cancelada";
    await reservation.save();
    res.status(200).json({ message: 'Reserva cancelada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al cancelar la reserva' });
  }
};

// POST /api/reservations/:id/review
const leaveReview = async (req, res) => {
  try {
    const { id } = req.params; // ID de la reserva
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La calificación debe estar entre 1 y 5' });
    }

    // Buscar la reserva
    const reservation = await Reservation.findOne({ _id: id, user: userId });

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada o no autorizada' });
    }

    if (reservation.status !== 'completada') {
      return res.status(400).json({ message: 'Solo se puede valorar una reserva completada' });
    }

    if (reservation.rating) {
      return res.status(400).json({ message: 'Esta reserva ya fue valorada' });
    }

    // Guardar la valoración en la reserva
    reservation.rating = rating;
    reservation.comment = comment;
    reservation.reviewDate = new Date();
    await reservation.save();

    // Actualizar el prestador con la nueva review
    const provider = await Provider.findById(reservation.provider);
    if (!provider) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    // Agregar la review
    provider.reviews.push({
      userId,
      rating,
      comment,
      date: new Date()
    });

    // Calcular nuevo promedio
    const totalReviews = provider.rating.totalReviews + 1;
    const totalSum = provider.rating.average * provider.rating.totalReviews + rating;
    const newAverage = totalSum / totalReviews;

    provider.rating.average = newAverage;
    provider.rating.totalReviews = totalReviews;

    await provider.save();

    res.status(200).json({ message: 'Review enviada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al dejar la review' });
  }
};

const getReservationsByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const reservations = await Reservation.find({ provider: providerId })
      .populate('user', 'fullName email')
      .populate('pet', 'name type');

    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener reservas del prestador' });
  }
};

 const getReservationById = async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }
      res.status(200).json(reservation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener la reserva' });
    }
  };


const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pendiente', 'aceptada', 'completada', 'cancelada'].includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const reservation = await Reservation.findById(id).populate('user provider');
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    reservation.status = status;
    await reservation.save();

    // 💌 Enviar email si la reserva fue confirmada
    if (status === 'ceptada') {
      const user = reservation.user;
      const providerName = reservation.provider?.name || 'el prestador';

      await sendEmail({
        to: user.email,
        subject: 'Tu reserva fue confirmada ✅',
        html: `
          <h2>¡Hola ${user.fullName || user.email}!</h2>
          <p>Tu reserva con <strong>${providerName}</strong> ha sido <strong>confirmada</strong>.</p>
          <p><strong>Fecha:</strong> ${reservation.date}</p>
          <p><strong>Hora:</strong> ${reservation.time}</p>
          <p>¡Gracias por confiar en nosotros!</p>
        `
      });
    }

    res.status(200).json({ message: 'Estado actualizado correctamente', reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el estado de la reserva' });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
  leaveReview,
  getReservationsByProvider,
  getReservationById
};
