import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Clientes from './pages/Clientes'
import Vehiculos from './pages/Vehiculos'
import Empleados from './pages/Empleados'
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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App