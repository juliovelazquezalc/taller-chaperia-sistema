const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /caja - todos los movimientos
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM caja ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /caja/resumen - resumen del dia
router.get('/resumen', async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    const ingresos = await db.query(`
      SELECT COALESCE(SUM(monto), 0) as total
      FROM caja WHERE tipo = 'ingreso' AND DATE(created_at) = $1
    `, [hoy]);

    const egresos = await db.query(`
      SELECT COALESCE(SUM(monto), 0) as total
      FROM caja WHERE tipo = 'egreso' AND DATE(created_at) = $1
    `, [hoy]);

    const pendientes = await db.query(`
      SELECT COALESCE(SUM(saldo_pendiente), 0) as total
      FROM facturas WHERE estado = 'pendiente'
    `);

    const porMetodo = await db.query(`
      SELECT metodo_pago, COALESCE(SUM(monto), 0) as total
      FROM caja WHERE tipo = 'ingreso' AND DATE(created_at) = $1
      GROUP BY metodo_pago
    `, [hoy]);

    const movimientosHoy = await db.query(`
      SELECT * FROM caja WHERE DATE(created_at) = $1 ORDER BY id DESC
    `, [hoy]);

    res.json({
      ingresos_hoy: ingresos.rows[0].total,
      egresos_hoy: egresos.rows[0].total,
      caja_hoy: ingresos.rows[0].total - egresos.rows[0].total,
      cobros_pendientes: pendientes.rows[0].total,
      por_metodo: porMetodo.rows,
      movimientos_hoy: movimientosHoy.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /caja - registrar movimiento manual
router.post('/', async (req, res) => {
  try {
    const { tipo, categoria, descripcion, monto, metodo_pago } = req.body;
    const resultado = await db.query(
      'INSERT INTO caja (tipo, categoria, descripcion, monto, metodo_pago) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tipo, categoria, descripcion, monto, metodo_pago || 'efectivo']
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /caja/mes - resumen del mes
router.get('/mes', async (req, res) => {
  try {
    const mes = new Date().getMonth() + 1;
    const anio = new Date().getFullYear();

    const resultado = await db.query(`
      SELECT 
        tipo,
        categoria,
        COALESCE(SUM(monto), 0) as total,
        COUNT(*) as cantidad
      FROM caja
      WHERE EXTRACT(MONTH FROM created_at) = $1
      AND EXTRACT(YEAR FROM created_at) = $2
      GROUP BY tipo, categoria
      ORDER BY tipo, total DESC
    `, [mes, anio]);

    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;