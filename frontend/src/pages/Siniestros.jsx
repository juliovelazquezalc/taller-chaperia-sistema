import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Siniestros() {
  const [siniestros, setSiniestros] = useState([])
  const [clientes, setClientes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [aseguradoras, setAseguradoras] = useState([])
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([])
  const [formulario, setFormulario] = useState({
    numero_siniestro: '', cliente_id: '', vehiculo_id: '',
    aseguradora_id: '', descripcion: '', estado: 'ingresado', fecha_ingreso: ''
  })

  useEffect(() => {
    obtenerTodo()
  }, [])

  const obtenerTodo = async () => {
    const [s, c, v, a] = await Promise.all([
      axios.get('http://192.168.100.12:3001/siniestros'),
      axios.get('http://192.168.100.12:3001/clientes'),
      axios.get('http://192.168.100.12:3001/vehiculos'),
      axios.get('http://192.168.100.12:3001/aseguradoras')
    ])
    setSiniestros(s.data)
    setClientes(c.data)
    setVehiculos(v.data)
    setAseguradoras(a.data)
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
    if (name === 'cliente_id') {
      const filtrados = vehiculos.filter(v => v.cliente_id === parseInt(value))
      setVehiculosFiltrados(filtrados)
      setFormulario(prev => ({ ...prev, cliente_id: value, vehiculo_id: '' }))
    }
  }

  const agregarSiniestro = async (e) => {
    e.preventDefault()
    await axios.post('http://192.168.100.12:3001/siniestros', formulario)
    setFormulario({ numero_siniestro: '', cliente_id: '', vehiculo_id: '', aseguradora_id: '', descripcion: '', estado: 'ingresado', fecha_ingreso: '' })
    setVehiculosFiltrados([])
    obtenerTodo()
  }
  const cambiarEstado = async (id, estado) => {
    await axios.patch(`http://192.168.100.12:3001/siniestros/${id}/estado`, { estado }) 
    if (estado === 'aprobado') {
      const siniestro = siniestros.find(s => s.id === id)
      const confirmar = window.confirm(`El siniestro de ${siniestro.nombre_cliente} fue aprobado. ¿Querés registrar el cobro ahora?`)
      if (confirmar) {
        window.location.href = '/cobros-seguro'
      }
    }

    obtenerTodo()
  }

  const colorEstado = (estado) => {
    const colores = {
      'ingresado': { color: '#185FA5', background: '#E6F1FB' },
      'presupuestado': { color: '#854F0B', background: '#FAEEDA' },
      'aprobado': { color: '#0F6E56', background: '#E1F5EE' },
      'en proceso': { color: '#534AB7', background: '#EEEDFE' },
      'cobrado': { color: '#0F6E56', background: '#E1F5EE' },
      'rechazado': { color: '#A32D2D', background: '#FCEBEB' }
    }
    return colores[estado] || {}
  }

  return (
    <div className="pagina">
      <h1>Siniestros</h1>

      <form className="formulario" onSubmit={agregarSiniestro}>
        <h2>Nuevo Siniestro</h2>
        <input type="text" name="numero_siniestro" placeholder="Número de siniestro" value={formulario.numero_siniestro} onChange={manejarCambio} required />
        <select name="cliente_id" value={formulario.cliente_id} onChange={manejarCambio} required>
          <option value="">Seleccionar cliente</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <select name="vehiculo_id" value={formulario.vehiculo_id} onChange={manejarCambio} required>
          <option value="">Seleccionar vehículo</option>
          {vehiculosFiltrados.map(v => <option key={v.id} value={v.id}>{v.patente} - {v.marca} {v.modelo}</option>)}
        </select>
        <select name="aseguradora_id" value={formulario.aseguradora_id} onChange={manejarCambio} required>
          <option value="">Seleccionar aseguradora</option>
          {aseguradoras.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
        <textarea name="descripcion" placeholder="Descripción del siniestro" value={formulario.descripcion} onChange={manejarCambio} rows={3} style={{padding: '0.7rem', borderRadius: '5px', border: '1px solid #ddd'}} />
        <input type="date" name="fecha_ingreso" value={formulario.fecha_ingreso} onChange={manejarCambio} />
        <button type="submit">Registrar Siniestro</button>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>N° Siniestro</th>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Aseguradora</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {siniestros.map(s => (
            <tr key={s.id}>
              <td>{s.numero_siniestro}</td>
              <td>{s.nombre_cliente}</td>
              <td>{s.patente} - {s.marca} {s.modelo}</td>
              <td>{s.nombre_aseguradora}</td>
              <td>{s.descripcion}</td>
              <td>
                <select
                  value={s.estado}
                  onChange={(e) => cambiarEstado(s.id, e.target.value)}
                  style={{ ...colorEstado(s.estado), border: 'none', borderRadius: '5px', padding: '0.3rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <option value="ingresado">Ingresado</option>
                  <option value="presupuestado">Presupuestado</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="en proceso">En proceso</option>
                  <option value="cobrado">Cobrado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </td>
              <td>{new Date(s.fecha_ingreso).toLocaleDateString()}</td>
              <td>
                <button className="btn-eliminar" onClick={() => eliminar(s.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Siniestros