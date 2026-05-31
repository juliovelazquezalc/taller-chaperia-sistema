import { useState, useEffect } from 'react'
import axios from 'axios'
import './Caja.css'

function Caja() {
  const [resumen, setResumen] = useState({
    ingresos_hoy: 0,
    egresos_hoy: 0,
    caja_hoy: 0,
    cobros_pendientes: 0,
    por_metodo: [],
    movimientos_hoy: []
  })
  const [formulario, setFormulario] = useState({
    tipo: 'egreso', categoria: 'gasto_general', descripcion: '', monto: '', metodo_pago: 'efectivo'
  })

  useEffect(() => {
    obtenerResumen()
  }, [])

  const obtenerResumen = async () => {
    const respuesta = await axios.get('http://localhost:3001/caja/resumen')
    setResumen(respuesta.data)
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const registrarMovimiento = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:3001/caja', formulario)
    setFormulario({ tipo: 'egreso', categoria: 'gasto_general', descripcion: '', monto: '', metodo_pago: 'efectivo' })
    obtenerResumen()
  }

  const colorMonto = (tipo) => {
    return tipo === 'ingreso' ? { color: 'green', fontWeight: 'bold' } : { color: 'red', fontWeight: 'bold' }
  }

  const signo = (tipo) => tipo === 'ingreso' ? '+' : '-'

  return (
    <div className="pagina">
      <h1>Control de Caja</h1>

      <div className="caja-resumen">
        <div className="caja-card verde">
          <div className="caja-card-label">Caja del día</div>
          <div className="caja-card-val">Gs. {Number(resumen.caja_hoy).toLocaleString()}</div>
        </div>
        <div className="caja-card azul">
          <div className="caja-card-label">Ingresos hoy</div>
          <div className="caja-card-val">Gs. {Number(resumen.ingresos_hoy).toLocaleString()}</div>
        </div>
        <div className="caja-card rojo">
          <div className="caja-card-label">Egresos hoy</div>
          <div className="caja-card-val">Gs. {Number(resumen.egresos_hoy).toLocaleString()}</div>
        </div>
        <div className="caja-card naranja">
          <div className="caja-card-label">Cobros pendientes</div>
          <div className="caja-card-val">Gs. {Number(resumen.cobros_pendientes).toLocaleString()}</div>
        </div>
      </div>

      <div className="caja-grid">
        <div>
          <form className="formulario" onSubmit={registrarMovimiento}>
            <h2>Registrar Movimiento</h2>
            <select name="tipo" value={formulario.tipo} onChange={manejarCambio}>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
            <select name="categoria" value={formulario.categoria} onChange={manejarCambio}>
              <option value="gasto_general">Gasto general</option>
              <option value="materiales">Materiales</option>
              <option value="servicios">Servicios</option>
              <option value="alquiler">Alquiler</option>
              <option value="otros">Otros</option>
            </select>
            <input type="text" name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={manejarCambio} required />
            <input type="number" name="monto" placeholder="Monto" value={formulario.monto} onChange={manejarCambio} required />
            <select name="metodo_pago" value={formulario.metodo_pago} onChange={manejarCambio}>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
            <button type="submit">Registrar</button>
          </form>

          <div className="metodos-pago">
            <h2>Ingresos por método</h2>
            {resumen.por_metodo.length === 0 ? (
              <p style={{ color: '#666' }}>Sin ingresos hoy</p>
            ) : (
              resumen.por_metodo.map(m => (
                <div key={m.metodo_pago} className="metodo-item">
                  <span>{m.metodo_pago}</span>
                  <span>Gs. {Number(m.total).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2>Movimientos de hoy</h2>
          {resumen.movimientos_hoy.length === 0 ? (
            <p style={{ color: '#666' }}>Sin movimientos hoy</p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Método</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {resumen.movimientos_hoy.map(m => (
                  <tr key={m.id}>
                    <td>{m.categoria}</td>
                    <td>{m.descripcion}</td>
                    <td>{m.metodo_pago}</td>
                    <td style={colorMonto(m.tipo)}>
                      {signo(m.tipo)} Gs. {Number(m.monto).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Caja