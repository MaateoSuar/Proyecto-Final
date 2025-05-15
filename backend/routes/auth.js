//routes/auth.js
const express = require('express');
const registrarUsuario = require('../controllers/authController.js').registrarUsuario;
const loginUsuario = require('../controllers/authController.js').loginUsuario;
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware.js');
const updateProfile = require('../controllers/authController.js').updateProfile;
const obtenerPerfil = require('../controllers/authController.js').obtenerPerfil;
const upload = require('../middlewares/upload.js');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.put("/perfil", authMiddleware, upload.single('profileImage'), updateProfile);
router.get("/perfil", authMiddleware, obtenerPerfil);

module.exports = router;