//routes/auth.js
const express = require('express');
const { registrarUsuario, loginUsuario, updateProfile, obtenerPerfil, getAllUsers, deleteUser } = require('../controllers/authController.js');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware.js');
const upload = require('../middlewares/upload.js');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.put("/perfil", authMiddleware, upload.single('profileImage'), updateProfile);
router.get("/perfil", authMiddleware, obtenerPerfil);
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

module.exports = router;