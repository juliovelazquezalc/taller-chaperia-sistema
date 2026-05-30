import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Facturas() {
  const [facturas, setFacturas] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [formulario, setFormulario] = useState({
    orden_id: '', total: ''
  })

  useEffect(() => {
    obtenerFacturas()
    obtenerOrdenes()
  }, [])

  const obtenerFacturas = async () => {
    const respuesta = await axios.get('http://localhost:3001/facturas')
    setFacturas(respuesta.data)
  }

  const obtenerOrdenes = async () => {
    const respuesta = await axios.get('http://localhost:3001/ordenes')
    setOrdenes(respuesta.data.filter(o => o.estado !== 'terminada'))
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const agregarFactura = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:3001/facturas', formulario)
    setFormulario({ orden_id: '', total: '' })
    obtenerFacturas()
    obtenerOrdenes()
  }

  const eliminarFactura = async (id) => {
    await axios.delete(`http://localhost:3001/facturas/${id}`)
    obtenerFacturas()
  }

  const colorEstado = (estado) => {
    if (estado === 'pendiente') return { color: 'orange', fontWeight: 'bold' }
    if (estado === 'pagada') return { color: 'green', fontWeight: 'bold' }
    return {}
  }

  return (
    <div className="pagina">
      <h1>Facturas</h1>

      <form className="formulario" onSubmit={agregarFactura}>
        <h2>Nueva Factura</h2>
        <select name="orden_id" value={formulario.orden_id} onChange={manejarCambio} required>
          <option value="">Seleccionar orden</option>
          {ordenes.map(o => (
            <option key={o.id} value={o.id}>
              #{o.id} - {o.nombre_cliente} - {o.patente} - {o.descripcion.substring(0, 30)}...
            </option>
          ))}
        </select>
        <input type="number" name="total" placeholder="Total a cobrar" value={formulario.total} onChange={manejarCambio} required />
        <button type="submit">Generar Factura</button>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Descripción</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map(factura => (
            <tr key={factura.id}>
              <td>{factura.id}</td>
              <td>{factura.nombre_cliente}</td>
              <td>{factura.patente} - {factura.marca}</td>
              <td>{factura.descripcion_orden}</td>
              <td>Gs. {Number(factura.total).toLocaleString()}</td>
              <td style={colorEstado(factura.estado)}>{factura.estado}</td>
              <td>{new Date(factura.created_at).toLocaleDateString()}</td>
              <td>
                <button className="btn-eliminar" onClick={() => eliminarFactura(factura.id)}>
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

export default Facturas