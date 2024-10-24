const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Controlador para registrar un nuevo usuario
exports.register = async (req, res) => {
  const { email, nombre, apellido, password, level } = req.body;

  try {
    // Verificar si el email ya está registrado
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Si no se proporciona el nivel, establecerlo en 2 por defecto
    const userLevel = level || 2;

    // Guardar el usuario en la base de datos
    await pool.query(
      'INSERT INTO users (email, nombre, apellido, password, level) VALUES ($1, $2, $3, $4, $5)',
      [email, nombre, apellido, hashedPassword, userLevel]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};
