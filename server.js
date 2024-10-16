const express = require('express');
const pool = require('./config/db');  // Conexión a la base de datos
require('dotenv').config();           // Cargar variables de entorno
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);  // Rutas de autenticación

// Importar rutas protegidas
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api', protectedRoutes);  // Rutas protegidas por token JWT

app.get('/', (req, res) => {
  res.send('API corriendo');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;  // Exportar app para usar en las pruebas con Supertest
