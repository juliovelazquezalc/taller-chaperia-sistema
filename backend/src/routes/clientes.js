const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /clientes - traer todos los clientes
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM clientes ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// POST /clientes - crear un cliente nuevo
router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, email, direccion } = req.body;
    const resultado = await db.query(
      'INSERT INTO clientes (nombre, telefono, email, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, telefono, email, direccion]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// GET /clientes/:id - traer un cliente por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// PUT /clientes/:id - modificar un cliente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, direccion } = req.body;
    const resultado = await db.query(
      'UPDATE clientes SET nombre=$1, telefono=$2, email=$3, direccion=$4 WHERE id=$5 RETURNING *',
      [nombre, telefono, email, direccion, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al modificar cliente' });
  }
});

// DELETE /clientes/:id - eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM clientes WHERE id = $1', [id]);
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;