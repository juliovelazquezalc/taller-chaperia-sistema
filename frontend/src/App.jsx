import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Clientes from './pages/Clientes'
import Vehiculos from './pages/Vehiculos'
import Empleados from './pages/Empleados'
import Ordenes from './pages/Ordenes'
import Articulos from './pages/Articulos'
import Facturas from './pages/Facturas'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="contenido">
        <Routes>
          <Route path="/" element={<h2 style={{padding: '2rem'}}>Bienvenido al Sistema del Taller JMV</h2>} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/facturas" element={<Facturas />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App