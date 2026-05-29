const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /articulos - traer todos los artículos
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM articulos ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /articulos - crear un artículo nuevo
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    const resultado = await db.query(
      'INSERT INTO articulos (nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, precio, stock || 0]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /articulos/:id - traer un artículo por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query('SELECT * FROM articulos WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /articulos/:id - modificar un artículo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    const resultado = await db.query(
      'UPDATE articulos SET nombre=$1, descripcion=$2, precio=$3, stock=$4 WHERE id=$5 RETURNING *',
      [nombre, descripcion, precio, stock, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /articulos/:id/stock - actualizar solo el stock
router.patch('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const resultado = await db.query(
      'UPDATE articulos SET stock=$1 WHERE id=$2 RETURNING *',
      [stock, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /articulos/:id - eliminar un artículo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM articulos WHERE id = $1', [id]);
    res.json({ mensaje: 'Artículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;