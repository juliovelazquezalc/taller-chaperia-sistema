const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT s.*, 
        c.nombre as nombre_cliente,
        c.telefono as telefono_cliente,
        v.patente, v.marca, v.modelo, v.color,
        a.nombre as nombre_aseguradora
      FROM siniestros s
      JOIN clientes c ON s.cliente_id = c.id
      JOIN vehiculos v ON s.vehiculo_id = v.id
      JOIN aseguradoras a ON s.aseguradora_id = a.id
      ORDER BY s.id DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { numero_siniestro, cliente_id, vehiculo_id, aseguradora_id, descripcion, estado, fecha_ingreso } = req.body;
    const resultado = await db.query(
      'INSERT INTO siniestros (numero_siniestro, cliente_id, vehiculo_id, aseguradora_id, descripcion, estado, fecha_ingreso) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [numero_siniestro, cliente_id, vehiculo_id, aseguradora_id, descripcion, estado || 'ingresado', fecha_ingreso || new Date()]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(`
      SELECT s.*, 
        c.nombre as nombre_cliente,
        c.telefono as telefono_cliente,
        v.patente, v.marca, v.modelo, v.color,
        a.nombre as nombre_aseguradora
      FROM siniestros s
      JOIN clientes c ON s.cliente_id = c.id
      JOIN vehiculos v ON s.vehiculo_id = v.id
      JOIN aseguradoras a ON s.aseguradora_id = a.id
      WHERE s.id = $1
    `, [id]);
    if (resultado.rows.length === 0) return res.status(404).json({ error: 'Siniestro no encontrado' });
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_siniestro, cliente_id, vehiculo_id, aseguradora_id, descripcion, estado, fecha_ingreso } = req.body;
    const resultado = await db.query(
      'UPDATE siniestros SET numero_siniestro=$1, cliente_id=$2, vehiculo_id=$3, aseguradora_id=$4, descripcion=$5, estado=$6, fecha_ingreso=$7 WHERE id=$8 RETURNING *',
      [numero_siniestro, cliente_id, vehiculo_id, aseguradora_id, descripcion, estado, fecha_ingreso, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const resultado = await db.query(
      'UPDATE siniestros SET estado=$1 WHERE id=$2 RETURNING *',
      [estado, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM siniestros WHERE id = $1', [id]);
    res.json({ mensaje: 'Siniestro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;