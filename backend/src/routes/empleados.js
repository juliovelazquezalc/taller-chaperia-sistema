const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /empleados - traer todos los empleados
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM empleados ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /empleados - crear un empleado nuevo
router.post('/', async (req, res) => {
  try {
    const { nombre, rol, telefono, email, turno } = req.body;
    const resultado = await db.query(
      'INSERT INTO empleados (nombre, rol, telefono, email, turno) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, rol, telefono, email, turno]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /empleados/:id - traer un empleado por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query('SELECT * FROM empleados WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /empleados/:id - modificar un empleado
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rol, telefono, email, turno } = req.body;
    const resultado = await db.query(
      'UPDATE empleados SET nombre=$1, rol=$2, telefono=$3, email=$4, turno=$5 WHERE id=$6 RETURNING *',
      [nombre, rol, telefono, email, turno, id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /empleados/:id - eliminar un empleado
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM empleados WHERE id = $1', [id]);
    res.json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
