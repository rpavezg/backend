const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Verificar si el header de autorización contiene 'Bearer'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Separa 'Bearer' del token

  if (!token) {
    return res.status(403).json({ error: 'No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Decodificar y almacenar la información del usuario en req.user
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
