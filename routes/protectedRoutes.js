const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/authController');
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
