const express = require('express');
const router = express.Router();
const { obtenerSugerencias } = require('../controllers/sugerenciasController');

router.get('/', obtenerSugerencias);

module.exports = router;
