// routes/chat.js
const express = require('express');
const { enviarMensaje, obtenerMensajes } = require('../controllers/chatController.js');
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router();

router.post('/mensaje', verifyToken, enviarMensaje);
router.post('/mensajeprovider', enviarMensaje); 
router.get('/mensajes/:reservaId', verifyToken, obtenerMensajes);

module.exports = router;
