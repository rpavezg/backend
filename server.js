const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Cargar variables de entorno

const pool = require('./config/db');  // Conexión a la base de datos
const authRoutes = require('./routes/authRoutes');  // Importar rutas de autenticación
const protectedRoutes = require('./routes/protectedRoutes');  // Importar rutas protegidas
const artistsRoutes = require('./routes/artistsRoutes'); // Importar la nueva ruta de artistas

const app = express();
app.use(cors());
app.use(express.json());

// Registrar las rutas de autenticación
app.use('/api', authRoutes);

// Registrar las rutas protegidas
app.use('/api', protectedRoutes);

// Registrar las rutas de artistas
app.use('/api', artistsRoutes);  // Las rutas de artistas se registran aquí

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
