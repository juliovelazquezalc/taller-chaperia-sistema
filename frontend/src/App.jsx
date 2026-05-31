import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Vehiculos from './pages/Vehiculos'
import Empleados from './pages/Empleados'
import Ordenes from './pages/Ordenes'
import Articulos from './pages/Articulos'
import Facturas from './pages/Facturas'
import Caja from './pages/Caja'
import Proveedores from './pages/Proveedores'
import Pagos from './pages/Pagos'
import './App.css'

function App() {
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem('usuario')
    return u ? JSON.parse(u) : null
  })

  const handleLogin = (u) => setUsuario(u)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  const PrivateRoute = ({ elemento }) => {
    return usuario ? (
      <><Navbar usuario={usuario} onLogout={handleLogout} />{elemento}</>
    ) : (
      <Navigate to="/login" />
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar usuario={usuario} onLogout={handleLogout} /><Inicio /></>} />
        <Route path="/login" element={usuario ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<PrivateRoute elemento={<Dashboard />} />} />
        <Route path="/clientes" element={<PrivateRoute elemento={<Clientes />} />} />
        <Route path="/vehiculos" element={<PrivateRoute elemento={<Vehiculos />} />} />
        <Route path="/empleados" element={<PrivateRoute elemento={<Empleados />} />} />
        <Route path="/ordenes" element={<PrivateRoute elemento={<Ordenes />} />} />
        <Route path="/articulos" element={<PrivateRoute elemento={<Articulos />} />} />
        <Route path="/facturas" element={<PrivateRoute elemento={<Facturas />} />} />
        <Route path="/caja" element={<PrivateRoute elemento={<Caja />} />} />
        <Route path="/proveedores" element={<PrivateRoute elemento={<Proveedores />} />} />
        <Route path="/pagos" element={<PrivateRoute elemento={<Pagos />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App