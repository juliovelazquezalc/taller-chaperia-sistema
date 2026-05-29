const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /ordenes - traer todas las órdenes
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT o.*, 
        v.patente, v.marca, v.modelo, v.color,
        c.nombre as nombre_cliente,
        e.nombre as nombre_empleado
      FROM ordenes o
      JOIN vehiculos v ON o.vehiculo_id = v.id
      JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN empleados e ON o.empleado_id = e.id
      ORDER BY o.id DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /ordenes - crear una orden nueva
router.post('/', async (req, res) => {
  try {
    const { vehiculo_id, empleado_id, descripcion, estado, total } = req.body;
    const resultado = await db.query(
      'INSERT INTO ordenes (vehiculo_id, empleado_id, descripcion, estado, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [vehiculo_id, empleado_id, descripcion, estado || 'pendiente', total || 0]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /ordenes/:id - traer una orden por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(`
      SELECT o.*, 
        v.patente, v.marca, v.modelo, v.color,
        c.nombre as nombre_cliente,
        e.nombre as nombre_empleado
      FROM ordenes o
      JOIN vehiculos v ON o.vehiculo_id = v.id
      JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN empleados e ON o.empleado_id = e.id
      WHERE o.id = $1
    `, [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /ordenes/:id - modificar una orden
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { vehiculo_id, empleado_id, descripcion, estado, total } = req.body;
    const resultado = await db.query(
      'UPDATE ordenes SET vehiculo_id=$1, empleado_id=$2, descripcion=$3, estado=$4, total=$5 WHERE id=$6 RETURNING *',
      [vehiculo_id, empleado_id, descripcion, estado, total, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /ordenes/:id/estado - cambiar solo el estado
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const resultado = await db.query(
      'UPDATE ordenes SET estado=$1 WHERE id=$2 RETURNING *',
      [estado, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /ordenes/:id - eliminar una orden
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM ordenes WHERE id = $1', [id]);
    res.json({ mensaje: 'Orden eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
