const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const artistsRoutes = require('./routes/artistsRoutes');

const app = express();
app.use(cors({
  origin: 'https://frontgaleria.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Registrar las rutas de autenticación con prefijo '/api/auth'
app.use('/api/auth', authRoutes);

// Registrar las rutas protegidas con prefijo '/api/protected'
app.use('/api/protected', protectedRoutes);

// Registrar las rutas de artistas con prefijo '/api/artists'
app.use('/api/artists', artistsRoutes);

app.get('/', (req, res) => {
  res.send('API corriendo');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;
