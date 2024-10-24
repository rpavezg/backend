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

    // Guardar el usuario en la base de datos
    await pool.query(
      'INSERT INTO users (email, nombre, apellido, password, level) VALUES ($1, $2, $3, $4, $5)',
      [email, nombre, apellido, hashedPassword, level]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Datos recibidos para login:', { email, password });

    // Buscar el usuario en la base de datos por email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generar un token JWT con la información del usuario
    const token = jwt.sign(
      { id: user.id, email: user.email, level: user.level },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ token, user: { id: user.id, email: user.email, level: user.level, nombre: user.nombre, apellido: user.apellido } });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Controlador para obtener el perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token (req.user se rellena en el middleware de autenticación)
    const userId = req.user.id;
    
    const result = await pool.query('SELECT email, nombre, apellido FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
  }
};
