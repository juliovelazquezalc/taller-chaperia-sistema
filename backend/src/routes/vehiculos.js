const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /vehiculos - traer todos los vehículos
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(
      'SELECT v.*, c.nombre as nombre_cliente FROM vehiculos v JOIN clientes c ON v.cliente_id = c.id ORDER BY v.id DESC'
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /vehiculos - crear un vehículo nuevo
router.post('/', async (req, res) => {
  try {
    const { cliente_id, patente, marca, modelo, anio, color } = req.body;
    const resultado = await db.query(
      'INSERT INTO vehiculos (cliente_id, patente, marca, modelo, anio, color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cliente_id, patente, marca, modelo, anio, color]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear vehículo' });
  }
});

// GET /vehiculos/:id - traer un vehículo por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(
      'SELECT v.*, c.nombre as nombre_cliente FROM vehiculos v JOIN clientes c ON v.cliente_id = c.id WHERE v.id = $1',
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener vehículo' });
  }
});

// GET /vehiculos/cliente/:cliente_id - traer vehículos de un cliente
router.get('/cliente/:cliente_id', async (req, res) => {
  try {
    const { cliente_id } = req.params;
    const resultado = await db.query(
      'SELECT * FROM vehiculos WHERE cliente_id = $1 ORDER BY id DESC',
      [cliente_id]
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener vehículos del cliente' });
  }
});

// PUT /vehiculos/:id - modificar un vehículo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, patente, marca, modelo, anio, color } = req.body;
    const resultado = await db.query(
      'UPDATE vehiculos SET cliente_id=$1, patente=$2, marca=$3, modelo=$4, anio=$5, color=$6 WHERE id=$7 RETURNING *',
      [cliente_id, patente, marca, modelo, anio, color, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al modificar vehículo' });
  }
});

// DELETE /vehiculos/:id - eliminar un vehículo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM vehiculos WHERE id = $1', [id]);
    res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
});

module.exports = router;