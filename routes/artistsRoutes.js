const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const pool = require('../config/db');
const router = express.Router();

// Ruta para obtener la lista de artistas (protegida)
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
