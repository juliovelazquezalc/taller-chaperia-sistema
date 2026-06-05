import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Aseguradoras() {
  const [aseguradoras, setAseguradoras] = useState([])
  const [formulario, setFormulario] = useState({
    nombre: '', ruc: '', telefono: '', email: '', direccion: '',
    contacto_nombre: '', contacto_telefono: '', contacto_email: ''
  })
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    obtenerAseguradoras()
  }, [])

  const obtenerAseguradoras = async () => {
    const respuesta = await axios.get('http://192.168.100.12:3001/aseguradoras')
    setAseguradoras(respuesta.data)
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const guardar = async (e) => {
    e.preventDefault()
    if (editando) {
      await axios.put(`http://192.168.100.12:3001/aseguradoras/${editando}`, formulario)
      setEditando(null)
    } else {
      await axios.post('http://192.168.100.12:3001/aseguradoras', formulario)
    }
    setFormulario({ nombre: '', ruc: '', telefono: '', email: '', direccion: '', contacto_nombre: '', contacto_telefono: '', contacto_email: '' })
    obtenerAseguradoras()
  }

  const editar = (a) => {
    setEditando(a.id)
    setFormulario({
      nombre: a.nombre || '', ruc: a.ruc || '', telefono: a.telefono || '',
      email: a.email || '', direccion: a.direccion || '',
      contacto_nombre: a.contacto_nombre || '', contacto_telefono: a.contacto_telefono || '',
      contacto_email: a.contacto_email || ''
    })
  }

  const eliminar = async (id) => {
    await axios.delete(`http://192.168.100.12:3001/aseguradoras/${id}`)
    obtenerAseguradoras()
  }

  return (
    <div className="pagina">
      <h1>Aseguradoras</h1>

      <form className="formulario" onSubmit={guardar}>
        <h2>{editando ? 'Editar Aseguradora' : 'Agregar Aseguradora'}</h2>
        <input type="text" name="nombre" placeholder="Nombre de la aseguradora" value={formulario.nombre} onChange={manejarCambio} required />
        <input type="text" name="ruc" placeholder="RUC" value={formulario.ruc} onChange={manejarCambio} />
        <input type="text" name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={manejarCambio} />
        <input type="email" name="email" placeholder="Email" value={formulario.email} onChange={manejarCambio} />
        <input type="text" name="direccion" placeholder="Dirección" value={formulario.direccion} onChange={manejarCambio} />
        <h2 style={{fontSize: '1rem', color: '#003087'}}>Contacto</h2>
        <input type="text" name="contacto_nombre" placeholder="Nombre del contacto" value={formulario.contacto_nombre} onChange={manejarCambio} />
        <input type="text" name="contacto_telefono" placeholder="Teléfono del contacto" value={formulario.contacto_telefono} onChange={manejarCambio} />
        <input type="email" name="contacto_email" placeholder="Email del contacto" value={formulario.contacto_email} onChange={manejarCambio} />
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button type="submit">{editando ? 'Guardar cambios' : 'Agregar'}</button>
          {editando && <button type="button" onClick={() => { setEditando(null); setFormulario({ nombre: '', ruc: '', telefono: '', email: '', direccion: '', contacto_nombre: '', contacto_telefono: '', contacto_email: '' }) }} style={{background: '#666'}}>Cancelar</button>}
        </div>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Contacto</th>
            <th>Tel. Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aseguradoras.map(a => (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td>{a.ruc}</td>
              <td>{a.telefono}</td>
              <td>{a.email}</td>
              <td>{a.contacto_nombre}</td>
              <td>{a.contacto_telefono}</td>
              <td>
                <button className="btn-eliminar" style={{background: '#003087', marginRight: '5px'}} onClick={() => editar(a)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminar(a.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Aseguradoras