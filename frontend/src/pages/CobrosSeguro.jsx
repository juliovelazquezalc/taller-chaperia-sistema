import { useState, useEffect } from 'react'
import axios from 'axios'
import './CobrosSeguro.css'

function CobrosSeguro() {
  const [cobros, setCobros] = useState([])
  const [proximos, setProximos] = useState([])
  const [aseguradoras, setAseguradoras] = useState([])
  const [siniestros, setSiniestros] = useState([])
  const [tab, setTab] = useState('lista')
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [cobrosCalendario, setCobrosCalendario] = useState([])
  const [formulario, setFormulario] = useState({
    siniestro_id: '', aseguradora_id: '', tipo_cobro: 'cheque',
    numero_cheque: '', monto: '', fecha_vencimiento: '',
    es_diferido: false, observaciones: ''
  })

  useEffect(() => {
    obtenerTodo()
  }, [])

  useEffect(() => {
    obtenerCalendario()
  }, [mes, anio])

  const obtenerTodo = async () => {
    const [c, p, a, s] = await Promise.all([
      axios.get('http://localhost:3001/cobros-seguros'),
      axios.get('http://localhost:3001/cobros-seguros/proximos'),
      axios.get('http://localhost:3001/aseguradoras'),
      axios.get('http://localhost:3001/siniestros')
    ])
    setCobros(c.data)
    setProximos(p.data)
    setAseguradoras(a.data)
    setSiniestros(s.data)
  }

  const obtenerCalendario = async () => {
    const respuesta = await axios.get(`http://localhost:3001/cobros-seguros/calendario?mes=${mes}&anio=${anio}`)
    setCobrosCalendario(respuesta.data)
  }

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target
    setFormulario({ ...formulario, [name]: type === 'checkbox' ? checked : value })
  }

  const agregarCobro = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:3001/cobros-seguros', formulario)
    setFormulario({ siniestro_id: '', aseguradora_id: '', tipo_cobro: 'cheque', numero_cheque: '', monto: '', fecha_vencimiento: '', es_diferido: false, observaciones: '' })
    obtenerTodo()
  }

  const marcarCobrado = async (id) => {
    await axios.patch(`http://localhost:3001/cobros-seguros/${id}/cobrar`)
    obtenerTodo()
  }

  const colorEstado = (estado) => {
    if (estado === 'pendiente') return { color: '#854F0B', background: '#FAEEDA', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.85rem' }
    if (estado === 'cobrado') return { color: '#0F6E56', background: '#E1F5EE', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.85rem' }
    if (estado === 'rechazado') return { color: '#A32D2D', background: '#FCEBEB', padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', fontSize: '0.85rem' }
    return {}
  }

  const diasRestantes = (fecha) => {
    const hoy = new Date()
    const vencimiento = new Date(fecha)
    const diff = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))
    if (diff < 0) return <span style={{ color: 'red', fontWeight: 'bold' }}>Vencido</span>
    if (diff <= 7) return <span style={{ color: 'orange', fontWeight: 'bold' }}>{diff} días</span>
    return <span style={{ color: 'green' }}>{diff} días</span>
  }

  const diasEnMes = (mes, anio) => new Date(anio, mes, 0).getDate()
  const primerDia = (mes, anio) => new Date(anio, mes - 1, 1).getDay()

  const cobrosDelDia = (dia) => {
    return cobrosCalendario.filter(c => {
      const fecha = new Date(c.fecha_vencimiento)
      return fecha.getDate() === dia
    })
  }

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div className="pagina">
      <h1>Control de Cobros — Seguros</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['lista', 'proximos', 'nuevo', 'calendario'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.6rem 1.2rem',
            background: tab === t ? '#003087' : 'white',
            color: tab === t ? '#FFD700' : '#003087',
            border: '2px solid #003087',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}>
            {t === 'lista' ? 'Todos los cobros' : t === 'proximos' ? 'Próximos a vencer' : t === 'nuevo' ? 'Registrar cobro' : 'Calendario'}
          </button>
        ))}
      </div>

      {tab === 'nuevo' && (
        <form className="formulario" onSubmit={agregarCobro}>
          <h2>Registrar Cobro de Seguro</h2>
          <select name="siniestro_id" value={formulario.siniestro_id} onChange={manejarCambio}>
            <option value="">Seleccionar siniestro (opcional)</option>
            {siniestros.map(s => <option key={s.id} value={s.id}>#{s.numero_siniestro} — {s.nombre_cliente}</option>)}
          </select>
          <select name="aseguradora_id" value={formulario.aseguradora_id} onChange={manejarCambio} required>
            <option value="">Seleccionar aseguradora</option>
            {aseguradoras.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
          <select name="tipo_cobro" value={formulario.tipo_cobro} onChange={manejarCambio}>
            <option value="cheque">Cheque</option>
            <option value="transferencia">Transferencia</option>
            <option value="efectivo">Efectivo</option>
          </select>
          <input type="text" name="numero_cheque" placeholder="Número de cheque" value={formulario.numero_cheque} onChange={manejarCambio} />
          <input type="number" name="monto" placeholder="Monto" value={formulario.monto} onChange={manejarCambio} required />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="date" name="fecha_vencimiento" value={formulario.fecha_vencimiento} onChange={manejarCambio} required />
            Fecha de vencimiento
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="es_diferido" checked={formulario.es_diferido} onChange={manejarCambio} />
            Cheque diferido
          </label>
          <textarea name="observaciones" placeholder="Observaciones" value={formulario.observaciones} onChange={manejarCambio} rows={2} style={{ padding: '0.7rem', borderRadius: '5px', border: '1px solid #ddd' }} />
          <button type="submit">Registrar</button>
        </form>
      )}

      {tab === 'lista' && (
        <table className="tabla">
          <thead>
            <tr>
              <th>Aseguradora</th>
              <th>Siniestro</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>N° Cheque</th>
              <th>Monto</th>
              <th>Vencimiento</th>
              <th>Diferido</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cobros.map(c => (
              <tr key={c.id}>
                <td>{c.nombre_aseguradora}</td>
                <td>{c.numero_siniestro || '-'}</td>
                <td>{c.nombre_cliente || '-'}</td>
                <td>{c.tipo_cobro}</td>
                <td>{c.numero_cheque || '-'}</td>
                <td>Gs. {Number(c.monto).toLocaleString()}</td>
                <td>{new Date(c.fecha_vencimiento).toLocaleDateString()}</td>
                <td>{c.es_diferido ? '✓' : '-'}</td>
                <td><span style={colorEstado(c.estado)}>{c.estado}</span></td>
                <td>
                  {c.estado === 'pendiente' && (
                    <button className="btn-eliminar" style={{ background: '#0F6E56' }} onClick={() => marcarCobrado(c.id)}>
                      Cobrar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'proximos' && (
        <div>
          <h2 style={{ color: '#003087', marginBottom: '1rem' }}>Próximos cobros a vencer</h2>
          {proximos.length === 0 ? (
            <p style={{ color: '#666' }}>No hay cobros pendientes</p>
          ) : (
            proximos.map(c => (
              <div key={c.id} className="cobro-card">
                <div className="cobro-info">
                  <div className="cobro-aseguradora">{c.nombre_aseguradora}</div>
                  <div className="cobro-detalle">{c.tipo_cobro === 'cheque' ? `Cheque N° ${c.numero_cheque}` : c.tipo_cobro} {c.es_diferido ? '• Diferido' : ''}</div>
                  <div className="cobro-cliente">{c.nombre_cliente || '-'}</div>
                </div>
                <div className="cobro-monto">
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#003087' }}>Gs. {Number(c.monto).toLocaleString()}</div>
                  <div>{diasRestantes(c.fecha_vencimiento)}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(c.fecha_vencimiento).toLocaleDateString()}</div>
                </div>
                <button className="btn-eliminar" style={{ background: '#0F6E56' }} onClick={() => marcarCobrado(c.id)}>Cobrar</button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'calendario' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <button onClick={() => { if (mes === 1) { setMes(12); setAnio(anio - 1) } else setMes(mes - 1) }} style={{ padding: '0.4rem 1rem', background: '#003087', color: '#FFD700', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>◀</button>
            <h2 style={{ color: '#003087' }}>{meses[mes - 1]} {anio}</h2>
            <button onClick={() => { if (mes === 12) { setMes(1); setAnio(anio + 1) } else setMes(mes + 1) }} style={{ padding: '0.4rem 1rem', background: '#003087', color: '#FFD700', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>▶</button>
          </div>
          <div className="calendario">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
              <div key={d} className="cal-header">{d}</div>
            ))}
            {Array(primerDia(mes, anio)).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="cal-dia vacio" />
            ))}
            {Array(diasEnMes(mes, anio)).fill(null).map((_, i) => {
              const dia = i + 1
              const cobrosHoy = cobrosDelDia(dia)
              return (
                <div key={dia} className={`cal-dia ${cobrosHoy.length > 0 ? 'con-cobros' : ''}`}>
                  <div className="cal-num">{dia}</div>
                  {cobrosHoy.map(c => (
                    <div key={c.id} className="cal-cobro">
                      <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{c.nombre_aseguradora}</div>
                      <div style={{ fontSize: '0.7rem' }}>Gs. {Number(c.monto).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CobrosSeguro