import { useState, useEffect } from 'react'
import axios from 'axios'
import logo from '../assets/logo taller jmv.png'
import './PresupuestoSeguro.css'

function PresupuestoSeguro() {
  const [clientes, setClientes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [aseguradoras, setAseguradoras] = useState([])
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([])
  const [presupuestos, setPresupuestos] = useState([])
  const [vista, setVista] = useState('lista')
  const [formulario, setFormulario] = useState({
    cliente_id: '', vehiculo_id: '', aseguradora_id: ''
  })
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
  const [aseguradoraSeleccionada, setAseguradoraSeleccionada] = useState(null)
  const [items, setItems] = useState([
    { descripcion: '', cantidad: 1, precio_unitario: 0, total: 0 }
  ])
  const [observaciones, setObservaciones] = useState('')

  useEffect(() => {
    obtenerTodo()
  }, [])

  const obtenerTodo = async () => {
    const [c, v, a, p] = await Promise.all([
      axios.get('http://192.168.100.66:3001/clientes'),
      axios.get('http://192.168.100.66:3001/vehiculos'),
      axios.get('http://192.168.100.66:3001/aseguradoras'),
      axios.get('http://192.168.100.66:3001/presupuestos-seguro')
    ])
    setClientes(c.data)
    setVehiculos(v.data)
    setAseguradoras(a.data)
    setPresupuestos(p.data)
  }

  const seleccionarCliente = (id) => {
    const cliente = clientes.find(c => c.id === parseInt(id))
    setClienteSeleccionado(cliente)
    setFormulario(prev => ({ ...prev, cliente_id: id, vehiculo_id: '' }))
    const filtrados = vehiculos.filter(v => v.cliente_id === parseInt(id))
    setVehiculosFiltrados(filtrados)
    setVehiculoSeleccionado(null)
  }

  const seleccionarVehiculo = (id) => {
    const vehiculo = vehiculosFiltrados.find(v => v.id === parseInt(id))
    setVehiculoSeleccionado(vehiculo)
    setFormulario(prev => ({ ...prev, vehiculo_id: id }))
  }

  const seleccionarAseguradora = (id) => {
    const aseguradora = aseguradoras.find(a => a.id === parseInt(id))
    setAseguradoraSeleccionada(aseguradora)
    setFormulario(prev => ({ ...prev, aseguradora_id: id }))
  }

  const actualizarItem = (index, campo, valor) => {
    const nuevosItems = [...items]
    nuevosItems[index][campo] = valor
    if (campo === 'cantidad' || campo === 'precio_unitario') {
      nuevosItems[index].total = nuevosItems[index].cantidad * nuevosItems[index].precio_unitario
    }
    setItems(nuevosItems)
  }

  const agregarItem = () => {
    setItems([...items, { descripcion: '', cantidad: 1, precio_unitario: 0, total: 0 }])
  }

  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
  const iva = subtotal * 0.10
  const total = subtotal + iva

  const guardarPresupuesto = async () => {
    if (!formulario.cliente_id || !formulario.vehiculo_id || !formulario.aseguradora_id) {
      return alert('Completá cliente, vehículo y aseguradora')
    }
    await axios.post('http://192.168.100.66:3001/presupuestos-seguro', {
      cliente_id: formulario.cliente_id,
      vehiculo_id: formulario.vehiculo_id,
      aseguradora_id: formulario.aseguradora_id,
      items,
      subtotal,
      iva,
      total,
      observaciones
    })
    obtenerTodo()
    setVista('lista')
    alert('Presupuesto guardado correctamente')
  }

  const aprobarPresupuesto = async (id, numeroSiniestro) => {
    await axios.patch(`http://192.168.100.66:3001/presupuestos-seguro/${id}/estado`, { 
      estado: 'aprobado',
      numero_siniestro: numeroSiniestro,
      fecha_aprobacion: new Date()
    })
    obtenerTodo()
  }

  const enviarPorEmail = () => {
    if (!clienteSeleccionado || !aseguradoraSeleccionada) return
    const asunto = `Presupuesto de Reparación - ${clienteSeleccionado.nombre} - ${vehiculoSeleccionado?.patente}`
    const cuerpo = `Estimados ${aseguradoraSeleccionada.nombre},\n\nAdjuntamos el presupuesto de reparación solicitado.\n\nCliente: ${clienteSeleccionado.nombre}\nVehículo: ${vehiculoSeleccionado?.patente} - ${vehiculoSeleccionado?.marca} ${vehiculoSeleccionado?.modelo}\n\nTotal: Gs. ${total.toLocaleString()}\n\nQuedamos a disposición.\n\nTaller JMV\nTel: +595 971 661 680\ntallerjmvelazquez@gmail.com`
    window.open(`mailto:${aseguradoraSeleccionada.email || ''}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`)
  }

  const colorEstado = (estado) => {
    const colores = {
      'borrador': { color: '#666', background: '#f5f5f5' },
      'enviado': { color: '#185FA5', background: '#E6F1FB' },
      'aprobado': { color: '#0F6E56', background: '#E1F5EE' },
      'rechazado': { color: '#A32D2D', background: '#FCEBEB' }
    }
    return colores[estado] || {}
  }

  return (
    <div className="pagina">
      <h1>Presupuestos de Seguro</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['lista', 'nuevo'].map(t => (
          <button key={t} onClick={() => setVista(t)} style={{
            padding: '0.6rem 1.5rem',
            background: vista === t ? '#003087' : 'white',
            color: vista === t ? '#FFD700' : '#003087',
            border: '2px solid #003087',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            {t === 'lista' ? 'Lista de presupuestos' : '+ Nuevo presupuesto'}
          </button>
        ))}
      </div>

      {vista === 'lista' && (
        <table className="tabla">
          <thead>
            <tr>
              <th>N° Presupuesto</th>
              <th>Cliente</th>
              <th>Vehículo</th>
              <th>Aseguradora</th>
              <th>Total</th>
              <th>Estado</th>
              <th>N° Siniestro</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {presupuestos.map(p => (
              <tr key={p.id}>
                <td>{p.numero}</td>
                <td>{p.nombre_cliente}</td>
                <td>{p.patente} - {p.marca}</td>
                <td>{p.nombre_aseguradora}</td>
                <td>Gs. {Number(p.total).toLocaleString()}</td>
                <td><span style={{ ...colorEstado(p.estado), padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.85rem' }}>{p.estado}</span></td>
                <td>{p.numero_siniestro || '-'}</td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  {p.estado === 'borrador' && (
                    <button
                      className="btn-eliminar"
                      style={{ background: '#185FA5', marginRight: '5px' }}
                      onClick={() => {
                        const num = prompt('Ingresá el número de siniestro asignado por la aseguradora:')
                        if (num) aprobarPresupuesto(p.id, num)
                      }}
                    >
                      Aprobar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {vista === 'nuevo' && (
        <div>
          <div className="formulario" style={{ maxWidth: '100%' }}>
            <h2>Datos del presupuesto</h2>
            <select onChange={(e) => seleccionarCliente(e.target.value)} style={{ padding: '0.7rem', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }}>
              <option value="">Seleccionar cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <select onChange={(e) => seleccionarVehiculo(e.target.value)} style={{ padding: '0.7rem', borderRadius: '5px', border: '1px solid #ddd', width: '100%', marginTop: '0.5rem' }} disabled={!formulario.cliente_id}>
              <option value="">Seleccionar vehículo</option>
              {vehiculosFiltrados.map(v => <option key={v.id} value={v.id}>{v.patente} - {v.marca} {v.modelo}</option>)}
            </select>
            <select onChange={(e) => seleccionarAseguradora(e.target.value)} style={{ padding: '0.7rem', borderRadius: '5px', border: '1px solid #ddd', width: '100%', marginTop: '0.5rem' }}>
              <option value="">Seleccionar aseguradora</option>
              {aseguradoras.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>

          {formulario.cliente_id && formulario.vehiculo_id && formulario.aseguradora_id && (
            <div className="presupuesto-doc">
              <div className="pres-header">
                <div className="pres-logo">
                  <img src={logo} alt="Taller JMV" />
                  <div>
                    <h2>Taller JMV</h2>
                    <p>Chapería y Pintura</p>
                    <p>Tel: +595 971 661 680</p>
                    <p>tallerjmvelazquez@gmail.com</p>
                  </div>
                </div>
                <div className="pres-titulo">
                  <h1>PRESUPUESTO</h1>
                  <p>Fecha: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pres-datos">
                <div className="pres-datos-col">
                  <h3>Aseguradora</h3>
                  <p><strong>{aseguradoraSeleccionada?.nombre}</strong></p>
                  <p>{aseguradoraSeleccionada?.telefono}</p>
                </div>
                <div className="pres-datos-col">
                  <h3>Cliente</h3>
                  <p><strong>{clienteSeleccionado?.nombre}</strong></p>
                  <p>Tel: {clienteSeleccionado?.telefono}</p>
                </div>
                <div className="pres-datos-col">
                  <h3>Vehículo</h3>
                  <p><strong>{vehiculoSeleccionado?.marca} {vehiculoSeleccionado?.modelo}</strong></p>
                  <p>Patente: {vehiculoSeleccionado?.patente}</p>
                  <p>Color: {vehiculoSeleccionado?.color}</p>
                </div>
              </div>

              <table className="pres-tabla">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cant.</th>
                    <th>Precio unit.</th>
                    <th>Total</th>
                    <th className="no-print">-</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input type="text" value={item.descripcion} onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)} placeholder="Descripción" className="pres-input" />
                      </td>
                      <td>
                        <input type="number" value={item.cantidad} onChange={(e) => actualizarItem(index, 'cantidad', parseFloat(e.target.value))} className="pres-input pres-input-sm" />
                      </td>
                      <td>
                        <input type="number" value={item.precio_unitario} onChange={(e) => actualizarItem(index, 'precio_unitario', parseFloat(e.target.value))} className="pres-input" />
                      </td>
                      <td>Gs. {Number(item.total).toLocaleString()}</td>
                      <td className="no-print">
                        <button onClick={() => eliminarItem(index)} style={{ background: '#e94560', color: 'white', border: 'none', borderRadius: '4px', padding: '3px 8px', cursor: 'pointer' }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="no-print" style={{ marginTop: '0.5rem' }}>
                <button onClick={agregarItem} style={{ background: '#003087', color: '#FFD700', border: 'none', borderRadius: '5px', padding: '0.5rem 1rem', cursor: 'pointer' }}>+ Agregar ítem</button>
              </div>

              <div className="pres-totales">
                <div className="pres-total-row"><span>Subtotal:</span><span>Gs. {subtotal.toLocaleString()}</span></div>
                <div className="pres-total-row"><span>IVA (10%):</span><span>Gs. {iva.toLocaleString()}</span></div>
                <div className="pres-total-row pres-total-final"><span>TOTAL:</span><span>Gs. {total.toLocaleString()}</span></div>
              </div>

              <div className="pres-obs">
                <h3>Observaciones</h3>
                <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Observaciones adicionales..." rows={3} className="pres-input" style={{ width: '100%' }} />
              </div>

              <div className="pres-firma">
                <div className="firma-box">
                  <div className="firma-linea"></div>
                  <p>Firma del cliente</p>
                  <p>Conformidad</p>
                </div>
                <div className="firma-box">
                  <div className="firma-linea"></div>
                  <p>Taller JMV</p>
                  <p>Firma y sello</p>
                </div>
              </div>

              <div className="no-print pres-acciones">
                <button onClick={guardarPresupuesto} style={{ background: '#003087', color: '#FFD700', border: 'none', borderRadius: '8px', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  💾 Guardar
                </button>
                <button onClick={enviarPorEmail} style={{ background: '#0F6E56', color: 'white', border: 'none', borderRadius: '8px', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  ✉️ Enviar por email
                </button>
                <button onClick={() => window.print()} style={{ background: '#854F0B', color: 'white', border: 'none', borderRadius: '8px', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  🖨️ Imprimir / PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PresupuestoSeguro