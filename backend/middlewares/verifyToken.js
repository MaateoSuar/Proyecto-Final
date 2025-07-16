const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId) {
      req.user = { id: decoded.userId, tipo: 'usuario' };
    } else if (decoded.prestadorId) {
      req.user = { id: decoded.prestadorId, tipo: 'prestador' };
    } else {
      return res.status(401).json({ msg: 'Token inválido: tipo no reconocido' });
    }

    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error);
    res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
