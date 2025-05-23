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
      return res.status(404).json({ message: 'Pet or provider not found' });
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
    res.status(500).json({ message: 'Error creating reservation' });
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
    res.status(500).json({ message: 'Error fetching reservations' });
  }
};



module.exports = {
  createReservation,
  getAllReservations
};
