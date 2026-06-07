import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Pagos() {
  const [pagosProveedores, setPagosProveedores] = useState([])
  const [pagosEmpleados, setPagosEmpleados] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [tab, setTab] = useState('proveedores')
  const [formularioProveedor, setFormularioProveedor] = useState({
    proveedor_id: '', descripcion: '', monto: '', metodo_pago: 'efectivo', estado: 'pagado'
  })
  const [formularioEmpleado, setFormularioEmpleado] = useState({
    empleado_id: '', concepto: 'sueldo', monto: '', metodo_pago: 'efectivo', periodo: '', estado: 'pagado'
  })

  useEffect(() => {
    obtenerTodo()
  }, [])

  const obtenerTodo = async () => {
    const [pp, pe, prov, emp] = await Promise.all([
      axios.get('http://192.168.100.66:3001/pagos/proveedores'),
      axios.get('http://192.168.100.66:3001/pagos/empleados'),
      axios.get('http://192.168.100.66:3001/proveedores'),
      axios.get('http://192.168.100.66:3001/empleados')
    ])
    setPagosProveedores(pp.data)
    setPagosEmpleados(pe.data)
    setProveedores(prov.data)
    setEmpleados(emp.data)
  }

  const pagarProveedor = async (e) => {
    e.preventDefault()
    await axios.post('http://192.168.100.66:3001/pagos/proveedores', formularioProveedor)
    setFormularioProveedor({ proveedor_id: '', descripcion: '', monto: '', metodo_pago: 'efectivo', estado: 'pagado' })
    obtenerTodo()
  }

  const pagarEmpleado = async (e) => {
    e.preventDefault()
    await axios.post('http://192.168.100.66:3001/pagos/empleados', formularioEmpleado)
    setFormularioEmpleado({ empleado_id: '', concepto: 'sueldo', monto: '', metodo_pago: 'efectivo', periodo: '', estado: 'pagado' })
    obtenerTodo()
  }

  const colorEstado = (estado) => {
    if (estado === 'pagado') return { color: 'green', fontWeight: 'bold' }
    if (estado === 'pendiente') return { color: 'orange', fontWeight: 'bold' }
    return {}
  }

  return (
    <div className="pagina">
      <h1>Pagos</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setTab('proveedores')}
          style={{
            padding: '0.6rem 1.5rem',
            background: tab === 'proveedores' ? '#003087' : 'white',
            color: tab === 'proveedores' ? '#FFD700' : '#003087',
            border: '2px solid #003087',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
          Proveedores
        </button>
        <button
          onClick={() => setTab('empleados')}
          style={{
            padding: '0.6rem 1.5rem',
            background: tab === 'empleados' ? '#003087' : 'white',
            color: tab === 'empleados' ? '#FFD700' : '#003087',
            border: '2px solid #003087',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
          Empleados
        </button>
      </div>

      {tab === 'proveedores' && (
        <>
          <form className="formulario" onSubmit={pagarProveedor}>
            <h2>Registrar Pago a Proveedor</h2>
            <select name="proveedor_id" value={formularioProveedor.proveedor_id} onChange={e => setFormularioProveedor({ ...formularioProveedor, proveedor_id: e.target.value })} required>
              <option value="">Seleccionar proveedor</option>
              {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
            <input type="text" placeholder="Descripción" value={formularioProveedor.descripcion} onChange={e => setFormularioProveedor({ ...formularioProveedor, descripcion: e.target.value })} required />
            <input type="number" placeholder="Monto" value={formularioProveedor.monto} onChange={e => setFormularioProveedor({ ...formularioProveedor, monto: e.target.value })} required />
            <select value={formularioProveedor.metodo_pago} onChange={e => setFormularioProveedor({ ...formularioProveedor, metodo_pago: e.target.value })}>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
            </select>
            <button type="submit">Registrar Pago</button>
          </form>

          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pagosProveedores.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre_proveedor}</td>
                  <td>{p.descripcion}</td>
                  <td>Gs. {Number(p.monto).toLocaleString()}</td>
                  <td>{p.metodo_pago}</td>
                  <td style={colorEstado(p.estado)}>{p.estado}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'empleados' && (
        <>
          <form className="formulario" onSubmit={pagarEmpleado}>
            <h2>Registrar Pago a Empleado</h2>
            <select value={formularioEmpleado.empleado_id} onChange={e => setFormularioEmpleado({ ...formularioEmpleado, empleado_id: e.target.value })} required>
              <option value="">Seleccionar empleado</option>
              {empleados.map(e => <option key={e.id} value={e.id}>{e.nombre} - {e.rol}</option>)}
            </select>
            <select value={formularioEmpleado.concepto} onChange={e => setFormularioEmpleado({ ...formularioEmpleado, concepto: e.target.value })}>
              <option value="sueldo">Sueldo</option>
              <option value="anticipo">Anticipo</option>
              <option value="bonificacion">Bonificación</option>
              <option value="horas_extra">Horas extra</option>
            </select>
            <input type="text" placeholder="Período (ej: Mayo 2026)" value={formularioEmpleado.periodo} onChange={e => setFormularioEmpleado({ ...formularioEmpleado, periodo: e.target.value })} required />
            <input type="number" placeholder="Monto" value={formularioEmpleado.monto} onChange={e => setFormularioEmpleado({ ...formularioEmpleado, monto: e.target.value })} required />
            <select value={formularioEmpleado.metodo_pago} onChange={e => setFormularioEmpleado({ ...formularioEmpleado, metodo_pago: e.target.value })}>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>
            <button type="submit">Registrar Pago</button>
          </form>

          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Empleado</th>
                <th>Concepto</th>
                <th>Período</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pagosEmpleados.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre_empleado}</td>
                  <td>{p.concepto}</td>
                  <td>{p.periodo}</td>
                  <td>Gs. {Number(p.monto).toLocaleString()}</td>
                  <td>{p.metodo_pago}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default Pagos