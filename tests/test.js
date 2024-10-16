const request = require('supertest');
const app = require('../server');  // Asegúrate de que exportas tu servidor en `server.js`
const pool = require('../config/db');  // Cierra la conexión a la base de datos después de las pruebas

describe('Pruebas de rutas de la API', () => {
  afterAll(() => {
    pool.end();  // Cierra la conexión a la base de datos al final de las pruebas
  });

  // 1. Registro exitoso de usuario
  it('Debe registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'pavez.rodrigo@gmail3.com',
        nombre: 'Test',
        apellido: 'User',
        password: '12345',
        level: 2
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
  });

  // 2. Intento de registro con un email ya existente
  it('Debe fallar el registro con un email ya registrado', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'pavez.rodrigo@gmail.com',
        nombre: 'Test',
        apellido: 'User',
        password: '12345',
        level: 1
      });
    expect(res.statusCode).toEqual(400);  // Código de estado para email duplicado
    expect(res.body).toHaveProperty('error', 'El email ya está registrado');
  });

  // 3. Inicio de sesión exitoso
  it('Debe iniciar sesión y devolver un token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'pavez.rodrigo@gmail.com',
        password: '12345'
      });
    expect(res.statusCode).toEqual(200);  // Login exitoso
    expect(res.body).toHaveProperty('token');  // JWT devuelto
  });

  // 4. Intento de inicio de sesión con contraseña incorrecta
  it('Debe fallar el inicio de sesión con una contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'pavez.rodrigo@gmail.com',
        password: 'wrongpassword'  // Contraseña incorrecta
      });
    expect(res.statusCode).toEqual(400);  // Código de estado 400 para login fallido
    expect(res.body).toHaveProperty('error', 'Contraseña incorrecta');
  });

  // 5. Intento de inicio de sesión con email incorrecto
  it('Debe fallar el inicio de sesión con un email incorrecto', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'wrongemail@example.com',  // Email incorrecto
        password: 'password123'
      });
    expect(res.statusCode).toEqual(400);  // Código de estado 400 para email incorrecto
    expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
  });

  // 6. Acceso a una ruta protegida con un token válido
  it('Debe acceder a una ruta protegida con un token válido', async () => {
    // Iniciar sesión para obtener el token JWT
    const loginRes = await request(app)
      .post('/api/login')
      .send({
        email: 'pavez.rodrigo@gmail.com',
        password: '12345'
      });

    const token = loginRes.body.token;  // Obtener el token del login exitoso

    // Hacer una solicitud a una ruta protegida pasando el token en el header
    const res = await request(app)
      .get('/api/protected')  // Suponiendo que tienes una ruta protegida
      .set('Authorization', `Bearer ${token}`);  // Pasar el token en el header

    expect(res.statusCode).toEqual(200);  // Código de estado 200 si el acceso es exitoso
  });
});
