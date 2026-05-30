import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Clientes from './pages/Clientes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="contenido">
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/" element={<h2>Bienvenido al Sistema del Taller</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App