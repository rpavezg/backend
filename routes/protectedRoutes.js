const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');  // Middleware para verificar el token
const { getProfile } = require('../controllers/authController');  // Controlador para obtener el perfil
const pool = require('../config/db');
const router = express.Router();

// Ruta protegida para obtener el perfil del usuario autenticado
router.get('/profile', verifyToken, getProfile);

// Ruta de prueba para una ruta protegida genérica
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Accediste a una ruta protegida',
    user: req.user
  });
});

module.exports = router;
