import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo taller jmv.png'
import './Navbar.css'

function Navbar({ usuario, onLogout }) {
  const [menuAbierto, setMenuAbierto] = useState(null)

  const toggleMenu = (menu) => {
    setMenuAbierto(menuAbierto === menu ? null : menu)
  }

  const cerrarMenus = () => setMenuAbierto(null)

  return (
    <nav className="navbar">
      <div className="navbar-marca">
        <img src={logo} alt="Taller JMV" style={{ height: '55px', marginRight: '10px' }} />
        Taller JMV
      </div>

      {usuario ? (
        <div className="navbar-links">
          <Link to="/dashboard" onClick={cerrarMenus}>Dashboard</Link>

          <div className="nav-grupo">
            <button className="nav-btn" onClick={() => toggleMenu('clientes')}>Clientes ▾</button>
            {menuAbierto === 'clientes' && (
              <div className="nav-dropdown">
                <Link to="/clientes" onClick={cerrarMenus}>Clientes</Link>
                <Link to="/vehiculos" onClick={cerrarMenus}>Vehículos</Link>
              </div>
            )}
          </div>

          <div className="nav-grupo">
            <button className="nav-btn" onClick={() => toggleMenu('taller')}>Taller ▾</button>
            {menuAbierto === 'taller' && (
              <div className="nav-dropdown">
                <Link to="/ordenes" onClick={cerrarMenus}>Órdenes de trabajo</Link>
              </div>
            )}
          </div>

          <div className="nav-grupo">
            <button className="nav-btn" onClick={() => toggleMenu('inventario')}>Inventario ▾</button>
            {menuAbierto === 'inventario' && (
              <div className="nav-dropdown">
                <Link to="/articulos" onClick={cerrarMenus}>Artículos</Link>
                <Link to="/marcas" onClick={cerrarMenus}>Marcas de vehículos</Link>
                <Link to="/pinturas" onClick={cerrarMenus}>Códigos de pintura</Link>
              </div>
            )}
          </div>

          <div className="nav-grupo">
            <button className="nav-btn" onClick={() => toggleMenu('facturacion')}>Facturación ▾</button>
            {menuAbierto === 'facturacion' && (
              <div className="nav-dropdown">
                <Link to="/facturas" onClick={cerrarMenus}>Facturas</Link>
                <Link to="/notas-credito" onClick={cerrarMenus}>Notas de crédito</Link>
                <Link to="/recibos" onClick={cerrarMenus}>Recibos</Link>
                <Link to="/comprobantes" onClick={cerrarMenus}>Comprobantes de compra</Link>
              </div>
            )}
          </div>

          <div className="nav-grupo">
            <button className="nav-btn" onClick={() => toggleMenu('finanzas')}>Finanzas ▾</button>
            {menuAbierto === 'finanzas' && (
              <div className="nav-dropdown">
                <Link to="/caja" onClick={cerrarMenus}>Caja</Link>
                <Link to="/pagos" onClick={cerrarMenus}>Pagos a empleados</Link>
                <Link to="/proveedores" onClick={cerrarMenus}>Proveedores</Link>
              </div>
            )}
          </div>

          <div className="nav-grupo">
            <button className="nav-btn" onClick={() => toggleMenu('seguros')}>Seguros ▾</button>
            {menuAbierto === 'seguros' && (
              <div className="nav-dropdown">
                <Link to="/aseguradoras" onClick={cerrarMenus}>Aseguradoras</Link>
                <Link to="/siniestros" onClick={cerrarMenus}>Siniestros</Link>
                <Link to="/presupuestos-seguro" onClick={cerrarMenus}>Presupuestos</Link>
                <Link to="/cobros-seguro" onClick={cerrarMenus}>Control de cobros</Link>
              </div>
            )}
          </div>

          <div className="nav-grupo">
            <button className="nav-btn" onClick={() => toggleMenu('contabilidad')}>Contabilidad ▾</button>
            {menuAbierto === 'contabilidad' && (
              <div className="nav-dropdown">
                <Link to="/ire" onClick={cerrarMenus}>Libro IRE simple</Link>
                <Link to="/reportes" onClick={cerrarMenus}>Reportes</Link>
              </div>
            )}
          </div>

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
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/">Inicio</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar