const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId) {
      req.user = { id: decoded.userId, tipo: 'usuario' };
    } else if (decoded.prestadorId) {
      req.user = { id: decoded.prestadorId, tipo: 'prestador' };
    } else {
      return res.status(401).json({ error: 'No autorizado - Token sin tipo válido' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'No autorizado - Token inválido' });
  }
};

module.exports = authMiddleware;
