// authController.js

exports.getProfile = async (req, res) => {
  try {
    // Usa el ID del usuario desde el token decodificado (req.user.id)
    const result = await pool.query('SELECT email, nombre, apellido FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};
