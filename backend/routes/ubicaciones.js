const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const ubicacionController = require('../controllers/ubicacionController');

// Todas las rutas requieren autenticación
router.use(auth);

// Obtener todas las ubicaciones del usuario
router.get('/', ubicacionController.obtenerUbicaciones);

// Crear una nueva ubicación
router.post('/', ubicacionController.crearUbicacion);

// Actualizar una ubicación existente
router.put('/:id', ubicacionController.actualizarUbicacion);

// Eliminar una ubicación
router.delete('/:id', ubicacionController.eliminarUbicacion);

// Establecer una ubicación como predeterminada
router.patch('/:id/predeterminada', ubicacionController.establecerPredeterminada);

module.exports = router; 