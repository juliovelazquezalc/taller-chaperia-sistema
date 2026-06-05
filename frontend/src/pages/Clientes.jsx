import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [formulario, setFormulario] = useState({
    nombre: '', telefono: '', email: '', direccion: ''
  })

  // Traer clientes del servidor
  useEffect(() => {
    obtenerClientes()
  }, [])

  const obtenerClientes = async () => {
    const respuesta = await axios.get('http://192.168.100.12:3001/clientes')
    setClientes(respuesta.data)
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const agregarCliente = async (e) => {
    e.preventDefault()
    await axios.post('http://192.168.100.12:3001/clientes', formulario)
    setFormulario({ nombre: '', telefono: '', email: '', direccion: '' })
    obtenerClientes()
  }

  const eliminarCliente = async (id) => {
    await axios.delete(`http://192.168.100.12:3001/clientes/${id}`)
    obtenerClientes()
  }

  return (
    <div className="pagina">
      <h1>Clientes</h1>

      <form className="formulario" onSubmit={agregarCliente}>
        <h2>Agregar Cliente</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formulario.telefono}
          onChange={manejarCambio}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formulario.email}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formulario.direccion}
          onChange={manejarCambio}
        />
        <button type="submit">Agregar Cliente</button>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.email}</td>
              <td>{cliente.direccion}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarCliente(cliente.id)}
                >
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

export default Clientes