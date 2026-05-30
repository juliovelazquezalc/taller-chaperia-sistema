const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /auth/registro - crear usuario nuevo
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const passwordEncriptada = await bcrypt.hash(password, 10);
    const resultado = await db.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, rol',
      [nombre, email, passwordEncriptada]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /auth/login - iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    const usuario = resultado.rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;