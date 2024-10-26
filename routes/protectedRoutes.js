// artistsRoutes.js (actualizado)
const express = require('express');
const pool = require('../config/db');  // Conexión a la base de datos
const router = express.Router();

// Ruta para obtener la lista de artistas (no protegida)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM artista');  // Consulta la tabla 'artista' en la BD
    res.json(result.rows);  // Devuelve los resultados en formato JSON
  } catch (error) {
    console.error('Error al obtener los artistas:', error);
    res.status(500).json({ error: 'Error al obtener los artistas' });
  }
});

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT email, nombre, apellido, level FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

module.exports = router;
