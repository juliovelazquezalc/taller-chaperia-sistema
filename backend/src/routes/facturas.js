const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /facturas - traer todas las facturas
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT f.*, 
        o.descripcion as descripcion_orden,
        o.estado as estado_orden,
        v.patente, v.marca, v.modelo,
        c.nombre as nombre_cliente
      FROM facturas f
      JOIN ordenes o ON f.orden_id = o.id
      JOIN vehiculos v ON o.vehiculo_id = v.id
      JOIN clientes c ON v.cliente_id = c.id
      ORDER BY f.id DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /facturas - crear una factura nueva
router.post('/', async (req, res) => {
  try {
    const { orden_id, total } = req.body;
    const resultado = await db.query(
      'INSERT INTO facturas (orden_id, total) VALUES ($1, $2) RETURNING *',
      [orden_id, total]
    );
    // Actualizar estado de la orden a terminada
    await db.query(
      'UPDATE ordenes SET estado=$1 WHERE id=$2',
      ['terminada', orden_id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /facturas/:id - traer una factura por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(`
      SELECT f.*, 
        o.descripcion as descripcion_orden,
        o.estado as estado_orden,
        v.patente, v.marca, v.modelo,
        c.nombre as nombre_cliente,
        c.telefono as telefono_cliente
      FROM facturas f
      JOIN ordenes o ON f.orden_id = o.id
      JOIN vehiculos v ON o.vehiculo_id = v.id
      JOIN clientes c ON v.cliente_id = c.id
      WHERE f.id = $1
    `, [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /facturas/:id/estado - cambiar estado de la factura
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const resultado = await db.query(
      'UPDATE facturas SET estado=$1 WHERE id=$2 RETURNING *',
      [estado, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /facturas/:id - eliminar una factura
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM facturas WHERE id = $1', [id]);
    res.json({ mensaje: 'Factura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;