import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-marca">
        🔧 Taller JMV
      </div>
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/vehiculos">Vehículos</Link>
        <Link to="/empleados">Empleados</Link>
        <Link to="/ordenes">Órdenes</Link>
        <Link to="/articulos">Artículos</Link>
        <Link to="/facturas">Facturas</Link>
      </div>
    </nav>
  )
}

export default Navbar