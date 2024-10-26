const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const pool = require('../config/db');  // Conexión a la base de datos
const router = express.Router();

// Ruta protegida para obtener todas las obras
router.get('/artworks', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obra');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las obras:', error);
    res.status(500).json({ error: 'Error al obtener las obras' });
  }
});

// Ruta protegida para "Me gusta" en una obra
router.post('/artworks/:id/like', verifyToken, async (req, res) => {
  try {
    const artworkId = req.params.id;
    await pool.query('INSERT INTO me_gusta (id_obra, id_users) VALUES ($1, $2)', [artworkId, req.user.id]);
    res.json({ message: 'Me gusta registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar "Me gusta":', error);
    res.status(500).json({ error: 'Error al registrar "Me gusta"' });
  }
});

// Ruta protegida para realizar una oferta en una obra
router.post('/artworks/:id/bid', verifyToken, async (req, res) => {
  try {
    const artworkId = req.params.id;
    const { bid } = req.body;
    await pool.query('INSERT INTO oferta (id_obra, id_users) VALUES ($1, $2)', [artworkId, req.user.id, bid]);
    res.json({ message: 'Oferta registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar la oferta:', error);
    res.status(500).json({ error: 'Error al registrar la oferta' });
  }
});

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
