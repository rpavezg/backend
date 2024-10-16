const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];  // Obtener el header de autorización
  const token = authHeader && authHeader.split(' ')[1];  // Separar 'Bearer' del token

  if (!token) {
    return res.status(403).json({ error: 'No se proporcionó un token' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Guardar los datos del usuario decodificado en req.user
    next();  // Continuar con la siguiente función
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

