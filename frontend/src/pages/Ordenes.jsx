import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Ordenes() {
  const [ordenes, setOrdenes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [formulario, setFormulario] = useState({
    vehiculo_id: '', empleado_id: '', descripcion: '', estado: 'pendiente', total: ''
  })

  useEffect(() => {
    obtenerOrdenes()
    obtenerVehiculos()
    obtenerEmpleados()
  }, [])

  const obtenerOrdenes = async () => {
    const respuesta = await axios.get('http://localhost:3001/ordenes')
    setOrdenes(respuesta.data)
  }

  const obtenerVehiculos = async () => {
    const respuesta = await axios.get('http://localhost:3001/vehiculos')
    setVehiculos(respuesta.data)
  }

  const obtenerEmpleados = async () => {
    const respuesta = await axios.get('http://localhost:3001/empleados')
    setEmpleados(respuesta.data)
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const agregarOrden = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:3001/ordenes', formulario)
    setFormulario({ vehiculo_id: '', empleado_id: '', descripcion: '', estado: 'pendiente', total: '' })
    obtenerOrdenes()
  }

const cambiarEstado = async (id, estado) => {
    // Buscar la orden ANTES de actualizar
    const orden = ordenes.find(o => o.id === id)
    
    await axios.patch(`http://localhost:3001/ordenes/${id}/estado`, { estado })
    
    // Mensaje cuando el trabajo está terminado
    if (estado === 'terminada' && orden) {
      const mensaje = `Hola ${orden.nombre_cliente}! 🔧 Te informamos que tu ${orden.marca} ${orden.modelo} (${orden.patente}) ya está listo para retirar en el Taller JMV. Cualquier consulta escribinos al +595 971 661 680. ¡Gracias por elegirnos!`
      const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
      window.open(url, '_blank')
    }

    // Mensaje post entrega - 1 hora después
    if (estado === 'entregado' && orden) {
      const mensaje = `Hola ${orden.nombre_cliente}! 😊 Esperamos que estés satisfecho con el trabajo realizado en tu ${orden.marca} ${orden.modelo} en el Taller JMV. ¿Cómo quedó el vehículo? Tu opinión es muy importante para nosotros. ¡Gracias por tu confianza!`
      alert('✅ El mensaje post entrega se enviará automáticamente en 1 hora.')
      setTimeout(() => {
        const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
        window.open(url, '_blank')
      }, 3600000)
    }

    obtenerOrdenes()
  }

  const eliminarOrden = async (id) => {
    await axios.delete(`http://localhost:3001/ordenes/${id}`)
    obtenerOrdenes()
  }

  const colorEstado = (estado) => {
    if (estado === 'pendiente') return { color: 'orange', fontWeight: 'bold' }
    if (estado === 'en proceso') return { color: 'blue', fontWeight: 'bold' }
    if (estado === 'terminada') return { color: 'green', fontWeight: 'bold' }
    return {}
  }

  return (
    <div className="pagina">
      <h1>Órdenes de Trabajo</h1>

      <form className="formulario" onSubmit={agregarOrden}>
        <h2>Nueva Orden</h2>
        <select name="vehiculo_id" value={formulario.vehiculo_id} onChange={manejarCambio} required>
          <option value="">Seleccionar vehículo</option>
          {vehiculos.map(v => (
            <option key={v.id} value={v.id}>{v.patente} - {v.marca} {v.modelo} ({v.nombre_cliente})</option>
          ))}
        </select>
        <select name="empleado_id" value={formulario.empleado_id} onChange={manejarCambio}>
          <option value="">Seleccionar empleado</option>
          {empleados.map(e => (
            <option key={e.id} value={e.id}>{e.nombre} - {e.rol}</option>
          ))}
        </select>
        <textarea
          name="descripcion"
          placeholder="Descripción del trabajo"
          value={formulario.descripcion}
          onChange={manejarCambio}
          required
          rows={3}
          style={{ padding: '0.7rem', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <input type="number" name="total" placeholder="Total estimado" value={formulario.total} onChange={manejarCambio} />
        <button type="submit">Crear Orden</button>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Empleado</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(orden => (
            <tr key={orden.id}>
              <td>{orden.id}</td>
              <td>{orden.nombre_cliente}</td>
              <td>{orden.patente} - {orden.marca}</td>
              <td>{orden.nombre_empleado}</td>
              <td>{orden.descripcion}</td>
              <td style={colorEstado(orden.estado)}>{orden.estado}</td>
              <td>{orden.total}</td>
              <td>
                <select onChange={(e) => cambiarEstado(orden.id, e.target.value)} value={orden.estado}>
                  <option value="pendiente">Pendiente</option>
                  <option value="en proceso">En proceso</option>
                  <option value="terminada">Terminada</option>
                </select>
                <button className="btn-eliminar" onClick={() => eliminarOrden(orden.id)} style={{ marginLeft: '5px' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Ordenes