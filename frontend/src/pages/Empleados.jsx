import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [formulario, setFormulario] = useState({
  nombre: '', rol: '', telefono: '', email: '', turno: '', cedula: ''
  })

  useEffect(() => {
    obtenerEmpleados()
  }, [])

  const obtenerEmpleados = async () => {
    const respuesta = await axios.get('http://localhost:3001/empleados')
    setEmpleados(respuesta.data)
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const agregarEmpleado = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:3001/empleados', formulario)
    setFormulario({ nombre: '', rol: '', telefono: '', email: '', turno: '', cedula: '' })
    obtenerEmpleados()
  }

  const eliminarEmpleado = async (id) => {
    await axios.delete(`http://localhost:3001/empleados/${id}`)
    obtenerEmpleados()
  }

  return (
    <div className="pagina">
      <h1>Empleados</h1>

      <form className="formulario" onSubmit={agregarEmpleado}>
        <h2>Agregar Empleado</h2>
        <input type="text" name="nombre" placeholder="Nombre completo" value={formulario.nombre} onChange={manejarCambio} required />
        <select name="rol" value={formulario.rol} onChange={manejarCambio} required>
          <option value="">Seleccionar rol</option>
          <option value="Chapero">Chapista</option>
          <option value="Pintor">Pintor</option>
          <option value="Mecánico">Mecánico</option>
          <option value="Administrativo">Administrativo</option>
          <option value="Gerente">Gerente</option>
        </select>
        <input type="text" name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={manejarCambio} />
        <input type="email" name="email" placeholder="Email" value={formulario.email} onChange={manejarCambio} />
        <input type="number" name="cedula" placeholder="Cedula de Identidad" value={formulario.cedula} onChange={manejarCambio} />
        <button type="submit">Agregar Empleado</button>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Cedula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(empleado => (
            <tr key={empleado.id}>
              <td>{empleado.id}</td>
              <td>{empleado.nombre}</td>
              <td>{empleado.rol}</td>
              <td>{empleado.telefono}</td>
              <td>{empleado.email}</td>
              <td>{empleado.cedula}</td>
              <td>
                <button className="btn-eliminar" onClick={() => eliminarEmpleado(empleado.id)}>
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

export default Empleados
