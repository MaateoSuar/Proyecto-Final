//routes/auth.js
const express = require('express');
const { 
  registrarUsuario, 
  loginUsuario, 
  updateProfile, 
  obtenerPerfil, 
  getAllUsers, 
  deleteUser,
  cambiarPassword 
} = require('../controllers/authController.js');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware.js');
const upload = require('../middlewares/upload.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.put("/perfil", authMiddleware, upload.single('profileImage'), updateProfile);
router.get("/perfil", authMiddleware, obtenerPerfil);
router.get("/usuarios", authMiddleware, getAllUsers);
router.delete("/usuarios/:userId", authMiddleware, deleteUser);
router.put("/cambiar-password", authMiddleware, cambiarPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Generar JWT y redirigir al frontend
  const user = req.user;
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  // Redirigir al frontend con el token como query param
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}`);
});

module.exports = router;