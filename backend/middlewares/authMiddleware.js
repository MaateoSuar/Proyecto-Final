// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Espera formato: Bearer token123

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Guardamos el ID del usuario para usar después
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
}

module.exports = verificarToken;
