const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const pool = require('../config/db');  // Conexión a la base de datos
const router = express.Router();

// Obtener todas las obras
router.get('/artworks', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM obra');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las obras:', error);
    res.status(500).json({ error: 'Error al obtener las obras' });
  }
});

// Registrar "Me gusta" para una obra
router.post('/artworks/:id/like', verifyToken, async (req, res) => {
  try {
    const artworkId = req.params.id;
    const userId = req.user.id; // Obtener el ID del usuario desde el token

    // Verificar si ya existe un "Me gusta" de este usuario para esta obra
    const existingLike = await pool.query('SELECT * FROM me_gusta WHERE id_obra = $1 AND id_users = $2', [artworkId, userId]);

    if (existingLike.rows.length > 0) {
      return res.status(400).json({ error: 'Ya has dado "Me gusta" a esta obra' });
    }

    // Insertar el "Me gusta" en la base de datos
    await pool.query('INSERT INTO me_gusta (id_obra, id_users) VALUES ($1, $2)', [artworkId, userId]);
    res.json({ message: 'Me gusta registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar "Me gusta":', error);
    res.status(500).json({ error: 'Error al registrar "Me gusta"' });
  }
});

// Registrar oferta para una obra
router.post('/artworks/:id/bid', verifyToken, async (req, res) => {
  try {
    const artworkId = req.params.id;
    const userId = req.user.id;

    // Verificar si ya existe una oferta para esta obra por el mismo usuario
    const existingBid = await pool.query('SELECT * FROM oferta WHERE id_obra = $1 AND id_users = $2', [artworkId, userId]);

    if (existingBid.rows.length > 0) {
      return res.status(400).json({ error: 'Ya has realizado una oferta para esta obra' });
    }

    // Insertar la oferta en la base de datos
    await pool.query('INSERT INTO oferta (id_obra, id_users) VALUES ($1, $2)', [artworkId, userId]);
    res.json({ message: 'Oferta registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar la oferta:', error);
    res.status(500).json({ error: 'Error al registrar la oferta' });
  }
});

// Obtener las obras con "Me gusta" del usuario
router.get('/likes', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT obra.id, obra.nombre, obra.img 
      FROM obra 
      JOIN me_gusta ON obra.id = me_gusta.id_obra 
      WHERE me_gusta.id_users = $1`, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener "Me gusta":', error);
    res.status(500).json({ error: 'Error al obtener "Me gusta"' });
  }
});

// Obtener las obras ofertadas por el usuario
router.get('/offers', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT obra.id, obra.nombre, obra.img 
      FROM obra 
      JOIN oferta ON obra.id = oferta.id_obra 
      WHERE oferta.id_users = $1`, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las ofertas:', error);
    res.status(500).json({ error: 'Error al obtener las ofertas' });
  }
});

// Eliminar "Me gusta" de una obra
router.delete('/likes/:id', verifyToken, async (req, res) => {
  try {
    const artworkId = req.params.id;
    await pool.query('DELETE FROM me_gusta WHERE id_obra = $1 AND id_users = $2', [artworkId, req.user.id]);
    res.json({ message: 'Me gusta eliminado' });
  } catch (error) {
    console.error('Error al eliminar "Me gusta":', error);
    res.status(500).json({ error: 'Error al eliminar "Me gusta"' });
  }
});

// Eliminar oferta de una obra
router.delete('/offers/:id', verifyToken, async (req, res) => {
  try {
    const artworkId = req.params.id;
    await pool.query('DELETE FROM oferta WHERE id_obra = $1 AND id_users = $2', [artworkId, req.user.id]);
    res.json({ message: 'Oferta eliminada' });
  } catch (error) {
    console.error('Error al eliminar la oferta:', error);
    res.status(500).json({ error: 'Error al eliminar la oferta' });
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
