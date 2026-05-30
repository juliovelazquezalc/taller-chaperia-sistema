import { Link } from 'react-router-dom'
import logo from '../assets/logo taller jmv.png'
import './Navbar.css'

function Navbar({ usuario, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-marca">
        <img src={logo} alt="Taller JMV" style={{ height: '55px', marginRight: '10px' }} />
        Taller JMV
      </div>
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        {usuario ? (
          <>
            <Link to="/clientes">Clientes</Link>
            <Link to="/vehiculos">Vehículos</Link>
            <Link to="/empleados">Empleados</Link>
            <Link to="/ordenes">Órdenes</Link>
            <Link to="/articulos">Artículos</Link>
            <Link to="/facturas">Facturas</Link>
            <span style={{ color: '#FFD700' }}>| {usuario.nombre}</span>
            <button onClick={onLogout} style={{
              background: 'transparent',
              border: '1px solid #FFD700',
              color: '#FFD700',
              padding: '0.3rem 0.8rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}>
              Salir
            </button>
          </>
        ) : (
          <Link to="/login">Ingresar al Sistema</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar 