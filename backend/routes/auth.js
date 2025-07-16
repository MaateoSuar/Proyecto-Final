//routes/auth.js
const express = require('express');
const { 
  registrarUsuario, 
  loginUsuario, 
  updateProfile, 
  obtenerPerfil, 
  getAllUsers, 
  deleteUser,
  cambiarPassword,
  loginPrestador,
  registrarPrestador,
  getUserById 
} = require('../controllers/authController.js');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware.js');
const verifyToken = require('../middlewares/verifyToken.js');
const upload = require('../middlewares/upload.js');

router.post('/registro-cuidador', registrarPrestador);
router.post('/login-cuidador', loginPrestador);
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.put("/perfil", authMiddleware, upload.single('profileImage'), updateProfile);
router.get("/perfil", authMiddleware, obtenerPerfil);
router.get("/usuarios", authMiddleware, getAllUsers);
router.get("/usuarios/:id", verifyToken, getUserById);
router.delete("/usuarios/:userId", authMiddleware, deleteUser);
router.put("/cambiar-password", authMiddleware, cambiarPassword);

module.exports = router;