const express = require('express');
const router = express.Router();
const { getAllPrestadores, createManyPrestadores } = require('../controllers/prestadorController');

// Ruta para obtener todos los prestadores con filtro opcional
router.get('/', getAllPrestadores);

// Ruta para crear múltiples prestadores
router.post('/many', createManyPrestadores);

module.exports = router; 