const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');  // Middleware para verificar el token
const { getProfile } = require('../controllers/authController');  // Controlador para obtener el perfil (asegúrate de que exista y esté bien importado)
const pool = require('../config/db');
const router = express.Router();

// Ruta protegida para obtener el perfil del usuario autenticado
router.get('/profile', verifyToken, getProfile);

// Ruta para obtener la lista de artistas (protegida)
router.get('/artists', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM artista');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los artistas:', error);
    res.status(500).json({ error: 'Error al obtener los artistas' });
  }
});

// Ruta de prueba para una ruta protegida genérica
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Accediste a una ruta protegida',
    user: req.user  // Información del usuario obtenida del token JWT
  });
});

module.exports = router;
