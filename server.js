const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Cargar variables de entorno

const pool = require('./config/db');  // Conexión a la base de datos
const authRoutes = require('./routes/authRoutes');  // Importar rutas de autenticación
const protectedRoutes = require('./routes/protectedRoutes');  // Importar rutas protegidas

const app = express();
app.use(cors({
  origin: 'https://frontendgaleria.onrender.com/', 
}));
app.use(express.json());

// Registrar las rutas de autenticación con prefijo '/api/auth'
app.use('/api/auth', authRoutes);

// Registrar las rutas protegidas con prefijo '/api/protected'
app.use('/api/protected', protectedRoutes);

// Ruta de prueba para verificar que el servidor esté corriendo
app.get('/', (req, res) => {
  res.send('API corriendo');
});

// Iniciar el servidor en el puerto especificado
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;  // Exportar app para usar en las pruebas con Supertest
