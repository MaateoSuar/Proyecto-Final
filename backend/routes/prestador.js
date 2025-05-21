// routes/prestador.js
const express = require('express');
const router = express.Router();
const { getAllPrestadores, createManyPrestadores, updateAvailability } = require('../controllers/prestadorController');

// Ruta para obtener todos los prestadores con filtro opcional
router.get('/', getAllPrestadores);

// Ruta para crear múltiples prestadores
router.post('/create', createManyPrestadores);

// Ruta para actualizar la disponibilidad de un prestador
router.put('/:proveedorId/availability', updateAvailability);

module.exports = router; 