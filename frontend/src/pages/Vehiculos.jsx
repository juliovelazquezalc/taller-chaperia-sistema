import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [clientes, setClientes] = useState([])
  const [formulario, setFormulario] = useState({
    cliente_id: '', patente: '', marca: '', modelo: '', anio: '', color: ''
  })

  useEffect(() => {
    obtenerVehiculos()
    obtenerClientes()
  }, [])

  const obtenerVehiculos = async () => {
    const respuesta = await axios.get('http://localhost:3001/vehiculos')
    setVehiculos(respuesta.data)
  }

  const obtenerClientes = async () => {
    const respuesta = await axios.get('http://localhost:3001/clientes')
    setClientes(respuesta.data)
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const agregarVehiculo = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:3001/vehiculos', formulario)
    setFormulario({ cliente_id: '', patente: '', marca: '', modelo: '', anio: '', color: '' })
    obtenerVehiculos()
  }

  const eliminarVehiculo = async (id) => {
    await axios.delete(`http://localhost:3001/vehiculos/${id}`)
    obtenerVehiculos()
  }

  return (
    <div className="pagina">
      <h1>Vehículos</h1>

      <form className="formulario" onSubmit={agregarVehiculo}>
        <h2>Agregar Vehículo</h2>
        <select name="cliente_id" value={formulario.cliente_id} onChange={manejarCambio} required>
          <option value="">Seleccionar cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
          ))}
        </select>
        <input type="text" name="patente" placeholder="Patente" value={formulario.patente} onChange={manejarCambio} required />
        <input type="text" name="marca" placeholder="Marca" value={formulario.marca} onChange={manejarCambio} />
        <input type="text" name="modelo" placeholder="Modelo" value={formulario.modelo} onChange={manejarCambio} />
        <input type="number" name="anio" placeholder="Año" value={formulario.anio} onChange={manejarCambio} />
        <input type="text" name="color" placeholder="Color" value={formulario.color} onChange={manejarCambio} />
        <button type="submit">Agregar Vehículo</button>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Patente</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map(vehiculo => (
            <tr key={vehiculo.id}>
              <td>{vehiculo.id}</td>
              <td>{vehiculo.nombre_cliente}</td>
              <td>{vehiculo.patente}</td>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.anio}</td>
              <td>{vehiculo.color}</td>
              <td>
                <button className="btn-eliminar" onClick={() => eliminarVehiculo(vehiculo.id)}>
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

export default Vehiculos
