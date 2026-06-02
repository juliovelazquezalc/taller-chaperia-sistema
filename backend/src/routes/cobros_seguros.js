const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT cs.*, 
        a.nombre as nombre_aseguradora,
        s.numero_siniestro,
        c.nombre as nombre_cliente
      FROM cobros_seguros cs
      JOIN aseguradoras a ON cs.aseguradora_id = a.id
      LEFT JOIN siniestros s ON cs.siniestro_id = s.id
      LEFT JOIN clientes c ON s.cliente_id = c.id
      ORDER BY cs.fecha_vencimiento ASC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/proximos', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT cs.*, 
        a.nombre as nombre_aseguradora,
        s.numero_siniestro,
        c.nombre as nombre_cliente
      FROM cobros_seguros cs
      JOIN aseguradoras a ON cs.aseguradora_id = a.id
      LEFT JOIN siniestros s ON cs.siniestro_id = s.id
      LEFT JOIN clientes c ON s.cliente_id = c.id
      WHERE cs.estado = 'pendiente'
      AND cs.fecha_vencimiento >= CURRENT_DATE
      ORDER BY cs.fecha_vencimiento ASC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/calendario', async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const resultado = await db.query(`
      SELECT cs.*, 
        a.nombre as nombre_aseguradora,
        s.numero_siniestro,
        c.nombre as nombre_cliente
      FROM cobros_seguros cs
      JOIN aseguradoras a ON cs.aseguradora_id = a.id
      LEFT JOIN siniestros s ON cs.siniestro_id = s.id
      LEFT JOIN clientes c ON s.cliente_id = c.id
      WHERE EXTRACT(MONTH FROM cs.fecha_vencimiento) = $1
      AND EXTRACT(YEAR FROM cs.fecha_vencimiento) = $2
      ORDER BY cs.fecha_vencimiento ASC
    `, [mes, anio]);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { presupuesto_id, siniestro_id, aseguradora_id, tipo_cobro, numero_cheque, monto, fecha_vencimiento, es_diferido, observaciones } = req.body;
    const resultado = await db.query(
      'INSERT INTO cobros_seguros (presupuesto_id, siniestro_id, aseguradora_id, tipo_cobro, numero_cheque, monto, fecha_vencimiento, es_diferido, observaciones) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [presupuesto_id, siniestro_id, aseguradora_id, tipo_cobro || 'cheque', numero_cheque, monto, fecha_vencimiento, es_diferido || false, observaciones]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/cobrar', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(
      'UPDATE cobros_seguros SET estado=$1, fecha_cobro=$2 WHERE id=$3 RETURNING *',
      ['cobrado', new Date(), id]
    );
    await db.query(
      'INSERT INTO caja (tipo, categoria, descripcion, monto, metodo_pago) VALUES ($1,$2,$3,$4,$5)',
      ['ingreso', 'seguro', `Cobro de seguro - cheque ${resultado.rows[0].numero_cheque}`, resultado.rows[0].monto, 'cheque']
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_cobro, numero_cheque, monto, fecha_vencimiento, es_diferido, estado, observaciones } = req.body;
    const resultado = await db.query(
      'UPDATE cobros_seguros SET tipo_cobro=$1, numero_cheque=$2, monto=$3, fecha_vencimiento=$4, es_diferido=$5, estado=$6, observaciones=$7 WHERE id=$8 RETURNING *',
      [tipo_cobro, numero_cheque, monto, fecha_vencimiento, es_diferido, estado, observaciones, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM cobros_seguros WHERE id = $1', [id]);
    res.json({ mensaje: 'Cobro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;