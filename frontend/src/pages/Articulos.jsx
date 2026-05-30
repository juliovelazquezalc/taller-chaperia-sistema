import { useState, useEffect } from 'react'
import axios from 'axios'
import './Clientes.css'

function Articulos() {
  const [articulos, setArticulos] = useState([])
  const [formulario, setFormulario] = useState({
    nombre: '', descripcion: '', precio: '', stock: ''
  })

  useEffect(() => {
    obtenerArticulos()
  }, [])

  const obtenerArticulos = async () => {
    const respuesta = await axios.get('http://localhost:3001/articulos')
    setArticulos(respuesta.data)
  }

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const agregarArticulo = async (e) => {
    e.preventDefault()
    await axios.post('http://localhost:3001/articulos', formulario)
    setFormulario({ nombre: '', descripcion: '', precio: '', stock: '' })
    obtenerArticulos()
  }

  const eliminarArticulo = async (id) => {
    await axios.delete(`http://localhost:3001/articulos/${id}`)
    obtenerArticulos()
  }

  const colorStock = (stock) => {
    if (stock === 0) return { color: 'red', fontWeight: 'bold' }
    if (stock <= 5) return { color: 'orange', fontWeight: 'bold' }
    return { color: 'green', fontWeight: 'bold' }
  }

  return (
    <div className="pagina">
      <h1>Artículos</h1>

      <form className="formulario" onSubmit={agregarArticulo}>
        <h2>Agregar Artículo</h2>
        <input type="text" name="nombre" placeholder="Nombre del artículo" value={formulario.nombre} onChange={manejarCambio} required />
        <input type="text" name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={manejarCambio} />
        <input type="number" name="precio" placeholder="Precio" value={formulario.precio} onChange={manejarCambio} required />
        <input type="number" name="stock" placeholder="Stock inicial" value={formulario.stock} onChange={manejarCambio} required />
        <button type="submit">Agregar Artículo</button>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map(articulo => (
            <tr key={articulo.id}>
              <td>{articulo.id}</td>
              <td>{articulo.nombre}</td>
              <td>{articulo.descripcion}</td>
              <td>Gs. {Number(articulo.precio).toLocaleString()}</td>
              <td style={colorStock(articulo.stock)}>{articulo.stock}</td>
              <td>
                <button className="btn-eliminar" onClick={() => eliminarArticulo(articulo.id)}>
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

export default Articulos