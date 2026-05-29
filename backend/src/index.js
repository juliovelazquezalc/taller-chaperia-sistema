const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const vehiculosRoutes = require('./routes/vehiculos');
const empleadosRoutes = require('./routes/empleados');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Usar rutas
app.use('/clientes', clientesRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/empleados', empleadosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'Servidor del Taller funcionando ✓',
    version: '1.0.0'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
