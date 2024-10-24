const express = require('express');
const pool = require('../config/db');  // Conexión a la base de datos
const router = express.Router();

// Ruta para obtener la lista de artistas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM artista');  // Consulta la tabla 'artista' en la BD
    res.json(result.rows);  // Devuelve los resultados en formato JSON
  } catch (error) {
    console.error('Error al obtener los artistas:', error);
    res.status(500).json({ error: 'Error al obtener los artistas' });
  }
});

module.exports = router;
