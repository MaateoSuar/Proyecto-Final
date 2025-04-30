const express = require('express');
const registrarUsuario = require('../controllers/authController.js').registrarUsuario;
const loginUsuario = require('../controllers/authController.js').loginUsuario;
const updateProfile = require('../controllers/authController.js').updateProfile;
const authMiddleware = require('../middlewares/authMiddleware.js');
const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.put("/perfil", authMiddleware, updateProfile)

module.exports = router;