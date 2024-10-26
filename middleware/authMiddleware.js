const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Verificar si el token existe y sigue el formato 'Bearer token'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Token no proporcionado o formato inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar el token utilizando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar el usuario decodificado en la solicitud
    next(); // Continuar con la siguiente función en la cadena
  } catch (error) {
    // Manejo de errores si el token es inválido o ha expirado
    return res.status(401).json({ error: 'Token inválido o expirado', details: error.message });
  }
};
