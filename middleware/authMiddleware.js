const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Comprobar si el token está presente en el encabezado de autorización
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Token no proporcionado o formato inválido' });
  }

  // Extraer el token del encabezado
  const token = authHeader.split(' ')[1];

  try {
    // Verificar y decodificar el token usando el secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar los datos del usuario al objeto de solicitud
    req.user = decoded;
    next();
  } catch (error) {
    // Manejo de errores en caso de token inválido o expirado
    return res.status(401).json({ error: 'Token inválido o expirado', details: error.message });
  }
};