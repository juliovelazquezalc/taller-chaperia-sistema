const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /pagos/proveedores
router.get('/proveedores', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT pp.*, p.nombre as nombre_proveedor
      FROM pagos_proveedores pp
      JOIN proveedores p ON pp.proveedor_id = p.id
      ORDER BY pp.id DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /pagos/proveedores
router.post('/proveedores', async (req, res) => {
  try {
    const { proveedor_id, descripcion, monto, metodo_pago, estado } = req.body;
    const resultado = await db.query(
      'INSERT INTO pagos_proveedores (proveedor_id, descripcion, monto, metodo_pago, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [proveedor_id, descripcion, monto, metodo_pago || 'efectivo', estado || 'pagado']
    );
    await db.query(
      'INSERT INTO caja (tipo, categoria, descripcion, monto, metodo_pago, referencia_id, referencia_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['egreso', 'proveedor', descripcion, monto, metodo_pago || 'efectivo', resultado.rows[0].id, 'pago_proveedor']
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /pagos/empleados
router.get('/empleados', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT pe.*, e.nombre as nombre_empleado, e.rol
      FROM pagos_empleados pe
      JOIN empleados e ON pe.empleado_id = e.id
      ORDER BY pe.id DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /pagos/empleados
router.post('/empleados', async (req, res) => {
  try {
    const { empleado_id, concepto, monto, metodo_pago, periodo, estado } = req.body;
    const resultado = await db.query(
      'INSERT INTO pagos_empleados (empleado_id, concepto, monto, metodo_pago, periodo, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [empleado_id, concepto || 'sueldo', monto, metodo_pago || 'efectivo', periodo, estado || 'pagado']
    );
    await db.query(
      'INSERT INTO caja (tipo, categoria, descripcion, monto, metodo_pago, referencia_id, referencia_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['egreso', 'empleado', `${concepto || 'sueldo'} - periodo ${periodo}`, monto, metodo_pago || 'efectivo', resultado.rows[0].id, 'pago_empleado']
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;