// routes/prestador.js
const express = require('express');
const router = express.Router();
const { getAllPrestadores, createManyPrestadores, updateAvailability, togglePrestadorStatus, deletePrestador, getPrestadorById } = require('../controllers/prestadorController');

// Ruta para obtener todos los prestadores con filtro opcional
router.get('/', getAllPrestadores);

// Ruta para crear múltiples prestadores
router.post('/create', createManyPrestadores);

// Ruta para actualizar la disponibilidad de un prestador
router.put('/:proveedorId/availability', updateAvailability);

// Ruta para activar/desactivar un prestador
router.put('/:prestadorId/toggle-status', togglePrestadorStatus);

// Ruta para eliminar un prestador
router.delete('/:prestadorId', deletePrestador);

// Ruta para obtener un prestador por su ID
router.get('/:id', getPrestadorById);

module.exports = router; 