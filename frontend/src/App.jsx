import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Clientes from './pages/Clientes'
import Vehiculos from './pages/Vehiculos'
import Empleados from './pages/Empleados'
import Ordenes from './pages/Ordenes'
import Articulos from './pages/Articulos'
import Facturas from './pages/Facturas'
import './App.css'

function App() {
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem('usuario')
    return u ? JSON.parse(u) : null
  })

  const handleLogin = (u) => {
    setUsuario(u)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<><Navbar usuario={usuario} onLogout={handleLogout} /><Inicio /></>} />

        {/* Login */}
        <Route path="/login" element={usuario ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />

        {/* Rutas privadas */}
        <Route path="/dashboard" element={usuario ? <><Navbar usuario={usuario} onLogout={handleLogout} /><h2 style={{padding:'2rem'}}>Bienvenido, {usuario.nombre}</h2></> : <Navigate to="/login" />} />
        <Route path="/clientes" element={usuario ? <><Navbar usuario={usuario} onLogout={handleLogout} /><Clientes /></> : <Navigate to="/login" />} />
        <Route path="/vehiculos" element={usuario ? <><Navbar usuario={usuario} onLogout={handleLogout} /><Vehiculos /></> : <Navigate to="/login" />} />
        <Route path="/empleados" element={usuario ? <><Navbar usuario={usuario} onLogout={handleLogout} /><Empleados /></> : <Navigate to="/login" />} />
        <Route path="/ordenes" element={usuario ? <><Navbar usuario={usuario} onLogout={handleLogout} /><Ordenes /></> : <Navigate to="/login" />} />
        <Route path="/articulos" element={usuario ? <><Navbar usuario={usuario} onLogout={handleLogout} /><Articulos /></> : <Navigate to="/login" />} />
        <Route path="/facturas" element={usuario ? <><Navbar usuario={usuario} onLogout={handleLogout} /><Facturas /></> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App