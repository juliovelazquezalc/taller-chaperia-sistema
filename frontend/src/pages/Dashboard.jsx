import { useState, useEffect } from 'react'
import axios from 'axios'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    clientes: 0,
    vehiculos: 0,
    empleados: 0,
    ordenes_pendientes: 0,
    ordenes_en_proceso: 0,
    ordenes_terminadas: 0,
    articulos_bajo_stock: 0,
    caja_hoy: 0,
    ingresos_hoy: 0,
    egresos_hoy: 0,
    cobros_pendientes: 0
  })
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerDatos()
  }, [])

  const obtenerDatos = async () => {
    try {
      const [clientes, vehiculos, empleados, ordenesData, articulos, caja] = await Promise.all([
        axios.get('http://localhost:3001/clientes'),
        axios.get('http://localhost:3001/vehiculos'),
        axios.get('http://localhost:3001/empleados'),
        axios.get('http://localhost:3001/ordenes'),
        axios.get('http://localhost:3001/articulos'),
        axios.get('http://localhost:3001/caja/resumen')
      ])

      const pendientes = ordenesData.data.filter(o => o.estado === 'pendiente').length
      const enProceso = ordenesData.data.filter(o => o.estado === 'en proceso').length
      const terminadas = ordenesData.data.filter(o => o.estado === 'terminada').length
      const bajoStock = articulos.data.filter(a => a.stock <= 5).length

      setStats({
        clientes: clientes.data.length,
        vehiculos: vehiculos.data.length,
        empleados: empleados.data.length,
        ordenes_pendientes: pendientes,
        ordenes_en_proceso: enProceso,
        ordenes_terminadas: terminadas,
        articulos_bajo_stock: bajoStock,
        caja_hoy: caja.data.caja_hoy,
        ingresos_hoy: caja.data.ingresos_hoy,
        egresos_hoy: caja.data.egresos_hoy,
        cobros_pendientes: caja.data.cobros_pendientes
      })

      setOrdenes(ordenesData.data.filter(o => o.estado !== 'entregado').slice(0, 5))
    } catch (error) {
      console.log(error)
    } finally {
      setCargando(false)
    }
  }

  const colorEstado = (estado) => {
    if (estado === 'pendiente') return '#854F0B'
    if (estado === 'en proceso') return '#185FA5'
    if (estado === 'terminada') return '#0F6E56'
    return '#666'
  }

  const bgEstado = (estado) => {
    if (estado === 'pendiente') return '#FAEEDA'
    if (estado === 'en proceso') return '#E6F1FB'
    if (estado === 'terminada') return '#E1F5EE'
    return '#f5f5f5'
  }

  if (cargando) return <div className="pagina">Cargando dashboard...</div>

  return (
    <div className="pagina">
      <h1>Dashboard</h1>

      <div className="dash-grid-4">
        <div className="dash-card azul">
          <div className="dash-label">Clientes</div>
          <div className="dash-val">{stats.clientes}</div>
        </div>
        <div className="dash-card verde">
          <div className="dash-label">Vehículos</div>
          <div className="dash-val">{stats.vehiculos}</div>
        </div>
        <div className="dash-card dorado">
          <div className="dash-label">Empleados</div>
          <div className="dash-val">{stats.empleados}</div>
        </div>
        <div className="dash-card rojo">
          <div className="dash-label">Stock bajo</div>
          <div className="dash-val">{stats.articulos_bajo_stock}</div>
        </div>
      </div>

      <div className="dash-grid-2">
        <div className="dash-seccion">
          <h2>Estado de órdenes</h2>
          <div className="dash-ordenes-stats">
            <div className="orden-stat" style={{ background: '#FAEEDA' }}>
              <div className="orden-stat-num" style={{ color: '#854F0B' }}>{stats.ordenes_pendientes}</div>
              <div className="orden-stat-label" style={{ color: '#854F0B' }}>Pendientes</div>
            </div>
            <div className="orden-stat" style={{ background: '#E6F1FB' }}>
              <div className="orden-stat-num" style={{ color: '#185FA5' }}>{stats.ordenes_en_proceso}</div>
              <div className="orden-stat-label" style={{ color: '#185FA5' }}>En proceso</div>
            </div>
            <div className="orden-stat" style={{ background: '#E1F5EE' }}>
              <div className="orden-stat-num" style={{ color: '#0F6E56' }}>{stats.ordenes_terminadas}</div>
              <div className="orden-stat-label" style={{ color: '#0F6E56' }}>Terminadas</div>
            </div>
          </div>

          <h2 style={{ marginTop: '1.5rem' }}>Últimas órdenes</h2>
          {ordenes.length === 0 ? (
            <p style={{ color: '#666' }}>No hay órdenes activas</p>
          ) : (
            ordenes.map(orden => (
              <div key={orden.id} className="dash-orden-item">
                <div className="dash-orden-info">
                  <div className="dash-orden-cliente">{orden.nombre_cliente}</div>
                  <div className="dash-orden-detalle">{orden.patente} — {orden.marca} {orden.modelo}</div>
                  <div className="dash-orden-desc">{orden.descripcion.substring(0, 50)}...</div>
                </div>
                <span className="dash-badge" style={{ color: colorEstado(orden.estado), background: bgEstado(orden.estado) }}>
                  {orden.estado}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="dash-seccion">
          <h2>Caja de hoy</h2>
          <div className="dash-caja">
            <div className="dash-caja-item verde">
              <div className="dash-label">Ingresos</div>
              <div className="dash-caja-val">Gs. {Number(stats.ingresos_hoy).toLocaleString()}</div>
            </div>
            <div className="dash-caja-item rojo">
              <div className="dash-label">Egresos</div>
              <div className="dash-caja-val">Gs. {Number(stats.egresos_hoy).toLocaleString()}</div>
            </div>
            <div className="dash-caja-item azul">
              <div className="dash-label">Total en caja</div>
              <div className="dash-caja-val">Gs. {Number(stats.caja_hoy).toLocaleString()}</div>
            </div>
            <div className="dash-caja-item naranja">
              <div className="dash-label">Cobros pendientes</div>
              <div className="dash-caja-val">Gs. {Number(stats.cobros_pendientes).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard