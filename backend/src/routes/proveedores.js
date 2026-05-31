const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM proveedores ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, email, ruc, direccion } = req.body;
    const resultado = await db.query(
      'INSERT INTO proveedores (nombre, telefono, email, ruc, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, telefono, email, ruc, direccion]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query('SELECT * FROM proveedores WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, ruc, direccion } = req.body;
    const resultado = await db.query(
      'UPDATE proveedores SET nombre=$1, telefono=$2, email=$3, ruc=$4, direccion=$5 WHERE id=$6 RETURNING *',
      [nombre, telefono, email, ruc, direccion, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM proveedores WHERE id = $1', [id]);
    res.json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;