import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [formulario, setFormulario] = useState({
    nombre: '', telefono: '', email: '', ruc: '', direccion: ''
  })

  useEffect(() => {
    obtenerProveedores()
  }, [])

  const obtenerProveedores = async () => {
    const respuesta = await axios.get('http://192.168.100.66:3001/proveedores')
    setProveedores(respuesta.data)
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const agregarProveedor = async (e) => {
    e.preventDefault()
    await axios.post('http://192.168.100.66:3001/proveedores', formulario)
    setFormulario({ nombre: '', telefono: '', email: '', ruc: '', direccion: '' })
    obtenerProveedores()
  }

  const eliminarProveedor = async (id) => {
    await axios.delete(`http://192.168.100.66:3001/proveedores/${id}`)
    obtenerProveedores()
  }

  return (
    <div className="pagina">
      <h1>Proveedores</h1>

      <form className="formulario" onSubmit={agregarProveedor}>
        <h2>Agregar Proveedor</h2>
        <input type="text" name="nombre" placeholder="Nombre o razón social" value={formulario.nombre} onChange={manejarCambio} required />
        <input type="text" name="ruc" placeholder="RUC" value={formulario.ruc} onChange={manejarCambio} />
        <input type="text" name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={manejarCambio} />
        <input type="email" name="email" placeholder="Email" value={formulario.email} onChange={manejarCambio} />
        <input type="text" name="direccion" placeholder="Dirección" value={formulario.direccion} onChange={manejarCambio} />
        <button type="submit">Agregar Proveedor</button>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(proveedor => (
            <tr key={proveedor.id}>
              <td>{proveedor.id}</td>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.ruc}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.email}</td>
              <td>{proveedor.direccion}</td>
              <td>
                <button className="btn-eliminar" onClick={() => eliminarProveedor(proveedor.id)}>
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

export default Proveedores