import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import logo from '../assets/logo taller jmv.png'
import './PresupuestoSeguro.css'

function PresupuestoSeguro() {
  const [siniestros, setSiniestros] = useState([])
  const [presupuestos, setPresupuestos] = useState([])
  const [vista, setVista] = useState('lista')
  const [siniestroSeleccionado, setSiniestroSeleccionado] = useState(null)
  const [items, setItems] = useState([
    { descripcion: '', cantidad: 1, precio_unitario: 0, total: 0 }
  ])
  const [observaciones, setObservaciones] = useState('')
  const printRef = useRef()

  useEffect(() => {
    obtenerTodo()
  }, [])

  const obtenerTodo = async () => {
    const [s, p] = await Promise.all([
      axios.get('http://192.168.100.12:3001/siniestros'),
      axios.get('http://192.168.100.12:3001/presupuestos-seguro')
    ])
    setSiniestros(s.data)
    setPresupuestos(p.data)
  }

  const seleccionarSiniestro = (id) => {
    const s = siniestros.find(s => s.id === parseInt(id))
    setSiniestroSeleccionado(s)
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
    if (!siniestroSeleccionado) return alert('Seleccioná un siniestro')
    await axios.post('http://192.168.100.12:3001/presupuestos-seguro', {
      siniestro_id: siniestroSeleccionado.id,
      aseguradora_id: siniestroSeleccionado.aseguradora_id,
      cliente_id: siniestroSeleccionado.cliente_id,
      vehiculo_id: siniestroSeleccionado.vehiculo_id,
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

  const enviarPorEmail = () => {
    if (!siniestroSeleccionado) return
    const asunto = `Presupuesto de Siniestro - ${siniestroSeleccionado.numero_siniestro} - ${siniestroSeleccionado.nombre_cliente}`
    const cuerpo = `Estimados,\n\nAdjuntamos el presupuesto correspondiente al siniestro N° ${siniestroSeleccionado.numero_siniestro}.\n\nCliente: ${siniestroSeleccionado.nombre_cliente}\nVehículo: ${siniestroSeleccionado.patente} - ${siniestroSeleccionado.marca} ${siniestroSeleccionado.modelo}\n\nTotal: Gs. ${total.toLocaleString()}\n\nQuedamos a disposición.\n\nTaller JMV\nTel: +595 971 661 680\ntallerjmvelazquez@gmail.com`
    window.open(`mailto:tallerjmvelazquez@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`)
  }

  const imprimir = () => {
    window.print()
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
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
              <th>Siniestro</th>
              <th>Cliente</th>
              <th>Vehículo</th>
              <th>Aseguradora</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {presupuestos.map(p => (
              <tr key={p.id}>
                <td>{p.numero}</td>
                <td>{p.numero_siniestro || '-'}</td>
                <td>{p.nombre_cliente}</td>
                <td>{p.patente} - {p.marca} {p.modelo}</td>
                <td>{p.nombre_aseguradora}</td>
                <td>Gs. {Number(p.total).toLocaleString()}</td>
                <td><span style={{ ...colorEstado(p.estado), padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.85rem' }}>{p.estado}</span></td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {vista === 'nuevo' && (
        <div>
          <div className="formulario" style={{ maxWidth: '100%' }}>
            <h2>Seleccionar Siniestro</h2>
            <select onChange={(e) => seleccionarSiniestro(e.target.value)} style={{ padding: '0.7rem', borderRadius: '5px', border: '1px solid #ddd', width: '100%' }}>
              <option value="">Seleccionar siniestro</option>
              {siniestros.map(s => (
                <option key={s.id} value={s.id}>
                  #{s.numero_siniestro} — {s.nombre_cliente} — {s.patente} {s.marca} — {s.nombre_aseguradora}
                </option>
              ))}
            </select>
          </div>

          {siniestroSeleccionado && (
            <div ref={printRef} className="presupuesto-doc">
              {/* ENCABEZADO */}
              <div className="pres-header">
                <div className="pres-logo">
                  <img src={logo} alt="Taller JMV" style={{ height: '80px' }} />
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

              {/* DATOS */}
              <div className="pres-datos">
                <div className="pres-datos-col">
                  <h3>Aseguradora</h3>
                  <p><strong>{siniestroSeleccionado.nombre_aseguradora}</strong></p>
                  <p>Siniestro N°: {siniestroSeleccionado.numero_siniestro}</p>
                </div>
                <div className="pres-datos-col">
                  <h3>Cliente</h3>
                  <p><strong>{siniestroSeleccionado.nombre_cliente}</strong></p>
                  <p>Tel: {siniestroSeleccionado.telefono_cliente}</p>
                </div>
                <div className="pres-datos-col">
                  <h3>Vehículo</h3>
                  <p><strong>{siniestroSeleccionado.marca} {siniestroSeleccionado.modelo}</strong></p>
                  <p>Patente: {siniestroSeleccionado.patente}</p>
                  <p>Color: {siniestroSeleccionado.color}</p>
                </div>
              </div>

              {/* ITEMS */}
              <table className="pres-tabla">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Total</th>
                    <th className="no-print">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                          placeholder="Descripción del trabajo"
                          className="pres-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => actualizarItem(index, 'cantidad', parseFloat(e.target.value))}
                          className="pres-input pres-input-sm"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.precio_unitario}
                          onChange={(e) => actualizarItem(index, 'precio_unitario', parseFloat(e.target.value))}
                          className="pres-input"
                        />
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

              {/* TOTALES */}
              <div className="pres-totales">
                <div className="pres-total-row">
                  <span>Subtotal:</span>
                  <span>Gs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="pres-total-row">
                  <span>IVA (10%):</span>
                  <span>Gs. {iva.toLocaleString()}</span>
                </div>
                <div className="pres-total-row pres-total-final">
                  <span>TOTAL:</span>
                  <span>Gs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* OBSERVACIONES */}
              <div className="pres-obs">
                <h3>Observaciones</h3>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                  className="pres-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* FIRMA */}
              <div className="pres-firma">
                <div className="firma-box">
                  <div className="firma-linea"></div>
                  <p>Firma del cliente</p>
                  <p>Conformidad de entrega</p>
                </div>
                <div className="firma-box">
                  <div className="firma-linea"></div>
                  <p>Taller JMV</p>
                  <p>Firma y sello</p>
                </div>
              </div>
            </div>
          )}

          {siniestroSeleccionado && (
            <div className="no-print pres-acciones">
              <button onClick={guardarPresupuesto} style={{ background: '#003087', color: '#FFD700', border: 'none', borderRadius: '8px', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                💾 Guardar presupuesto
              </button>
              <button onClick={enviarPorEmail} style={{ background: '#0F6E56', color: 'white', border: 'none', borderRadius: '8px', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                ✉️ Enviar por email
              </button>
              <button onClick={imprimir} style={{ background: '#854F0B', color: 'white', border: 'none', borderRadius: '8px', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                🖨️ Imprimir / PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PresupuestoSeguro