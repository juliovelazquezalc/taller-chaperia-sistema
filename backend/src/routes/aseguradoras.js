const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM aseguradoras ORDER BY nombre');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, ruc, telefono, email, direccion, contacto_nombre, contacto_telefono, contacto_email } = req.body;
    const resultado = await db.query(
      'INSERT INTO aseguradoras (nombre, ruc, telefono, email, direccion, contacto_nombre, contacto_telefono, contacto_email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [nombre, ruc, telefono, email, direccion, contacto_nombre, contacto_telefono, contacto_email]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query('SELECT * FROM aseguradoras WHERE id = $1', [id]);
    if (resultado.rows.length === 0) return res.status(404).json({ error: 'Aseguradora no encontrada' });
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ruc, telefono, email, direccion, contacto_nombre, contacto_telefono, contacto_email } = req.body;
    const resultado = await db.query(
      'UPDATE aseguradoras SET nombre=$1, ruc=$2, telefono=$3, email=$4, direccion=$5, contacto_nombre=$6, contacto_telefono=$7, contacto_email=$8 WHERE id=$9 RETURNING *',
      [nombre, ruc, telefono, email, direccion, contacto_nombre, contacto_telefono, contacto_email, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM aseguradoras WHERE id = $1', [id]);
    res.json({ mensaje: 'Aseguradora eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;