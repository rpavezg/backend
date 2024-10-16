const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');  // Middleware para verificar el token
const router = express.Router();

// Definir una ruta protegida
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Accediste a una ruta protegida',
    user: req.user  // Información del usuario obtenida del token JWT
  });
});

module.exports = router;
