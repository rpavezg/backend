const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');  // Middleware para verificar el token
const pool = require('../config/db');
const router = express.Router();

// Definir una ruta protegida
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Accediste a una ruta protegida',
    user: req.user  // Información del usuario obtenida del token JWT
  });
});
// Ruta para obtener la lista de artistas
router.get('/artists', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM artista');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los artistas:', error);
    res.status(500).json({ error: 'Error al obtener los artistas' });
  }
});

module.exports = router;
