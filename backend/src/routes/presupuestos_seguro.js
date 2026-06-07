const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT ps.*,
        s.numero_siniestro,
        c.nombre as nombre_cliente,
        v.patente, v.marca, v.modelo,
        a.nombre as nombre_aseguradora
      FROM presupuestos_seguro ps
      LEFT JOIN siniestros s ON ps.siniestro_id = s.id
      LEFT JOIN clientes c ON ps.cliente_id = c.id
      LEFT JOIN vehiculos v ON ps.vehiculo_id = v.id
      LEFT JOIN aseguradoras a ON ps.aseguradora_id = a.id
      ORDER BY ps.id DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { siniestro_id, aseguradora_id, cliente_id, vehiculo_id, items, subtotal, iva, total, observaciones } = req.body;
    const numero = `PRES-${Date.now()}`;
    const resultado = await db.query(
      'INSERT INTO presupuestos_seguro (numero, siniestro_id, aseguradora_id, cliente_id, vehiculo_id, items, subtotal, iva, total, observaciones) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [numero, siniestro_id, aseguradora_id, cliente_id, vehiculo_id, JSON.stringify(items), subtotal, iva, total, observaciones]
    );
    if (siniestro_id) {
      await db.query('UPDATE siniestros SET estado=$1 WHERE id=$2', ['presupuestado', siniestro_id]);
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(`
      SELECT ps.*,
        s.numero_siniestro,
        c.nombre as nombre_cliente, c.telefono as telefono_cliente,
        v.patente, v.marca, v.modelo, v.color, v.anio,
        a.nombre as nombre_aseguradora, a.ruc as ruc_aseguradora,
        a.email as email_aseguradora, a.telefono as telefono_aseguradora
      FROM presupuestos_seguro ps
      LEFT JOIN siniestros s ON ps.siniestro_id = s.id
      LEFT JOIN clientes c ON ps.cliente_id = c.id
      LEFT JOIN vehiculos v ON ps.vehiculo_id = v.id
      LEFT JOIN aseguradoras a ON ps.aseguradora_id = a.id
      WHERE ps.id = $1
    `, [id]);
    if (resultado.rows.length === 0) return res.status(404).json({ error: 'Presupuesto no encontrado' });
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { items, subtotal, iva, total, estado, observaciones } = req.body;
    const resultado = await db.query(
      'UPDATE presupuestos_seguro SET items=$1, subtotal=$2, iva=$3, total=$4, estado=$5, observaciones=$6 WHERE id=$7 RETURNING *',
      [JSON.stringify(items), subtotal, iva, total, estado, observaciones, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, numero_siniestro, fecha_aprobacion } = req.body;
    const resultado = await db.query(
      'UPDATE presupuestos_seguro SET estado=$1, numero_siniestro=$2, fecha_aprobacion=$3 WHERE id=$4 RETURNING *',
      [estado, numero_siniestro, fecha_aprobacion, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM presupuestos_seguro WHERE id = $1', [id]);
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;