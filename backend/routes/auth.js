const express = require('express');
const registrarUsuario = require('../controllers/authController.js').registrarUsuario;
const loginUsuario = require('../controllers/authController.js').loginUsuario;
const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

module.exports = router;