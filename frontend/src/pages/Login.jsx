import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login({ onLogin }) {
  const [formulario, setFormulario] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const iniciarSesion = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const respuesta = await axios.post('http://192.168.100.66:3001/auth/login', formulario)
      localStorage.setItem('token', respuesta.data.token)
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario))
      onLogin(respuesta.data.usuario)
    } catch (error) {
      setError('Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src="/logo.png" alt="Taller JMV" />
        </div>
        <h1>Taller JMV</h1>
        <p>Sistema de Gestión</p>
        <form onSubmit={iniciarSesion}>
          {error && <div className="login-error">{error}</div>}
          <div className="login-campo">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formulario.email}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="login-campo">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formulario.password}
              onChange={manejarCambio}
              required
            />
          </div>
          <button type="submit" disabled={cargando}>
            {cargando ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login