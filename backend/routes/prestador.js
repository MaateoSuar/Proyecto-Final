// routes/prestador.js
const express = require('express');
const router = express.Router();
const { getAllPrestadores, createManyPrestadores, updateAvailability, togglePrestadorStatus, deletePrestador, getPrestadorById, getHorariosDisponibles, getReviewsFromProvider } = require('../controllers/prestadorController');

// Ruta para obtener todos los prestadores con filtro opcional
router.get('/', getAllPrestadores);

// Ruta para crear múltiples prestadores
router.post('/create', createManyPrestadores);

// Ruta para actualizar la disponibilidad de un prestador
router.put('/:proveedorId/availability', updateAvailability);

// Ruta para actualizar toda la disponibilidad de un prestador
router.put('/:proveedorId/full-availability', authMiddleware, updateFullAvailability);

// Ruta para activar/desactivar un prestador
router.put('/:prestadorId/toggle-status', togglePrestadorStatus);

router.get('/:prestadorId/horarios-disponibles', getHorariosDisponibles);

// Ruta para eliminar un prestador
router.delete('/:prestadorId', deletePrestador);

// Ruta para obtener un prestador por su ID
router.get('/:id', getPrestadorById);

module.exports = router; 