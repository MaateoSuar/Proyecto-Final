// controllers/reservationController.js
const Reservation = require('../models/Reservation');
const Pet = require('../models/Pet');
const Provider = require('../models/Prestador');

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

    const reservation = new Reservation({
      user: userId,
      provider,
      pet,
      date,
      time
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
    const dayAvailability = provider.availability.find(a => a.day.toLowerCase() === reservation.date.toLowerCase());
    
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

    // Eliminar la reserva
    await Reservation.findByIdAndDelete(id);

    res.status(200).json({ message: 'Reserva cancelada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al cancelar la reserva' });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  cancelReservation
};
