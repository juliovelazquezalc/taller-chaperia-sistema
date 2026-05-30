import './Inicio.css'

function Inicio() {
  const whatsappNumero = '595971661680'
  const whatsappMensaje = 'Hola, me gustaría solicitar un presupuesto para mi vehículo.'

  const enviarPresupuesto = (e) => {
    e.preventDefault()
    const nombre = e.target.nombre.value
    const telefono = e.target.telefono.value
    const vehiculo = e.target.vehiculo.value
    const descripcion = e.target.descripcion.value
    const mensaje = `Hola Taller JMV! Mi nombre es ${nombre}, mi teléfono es ${telefono}. Tengo un ${vehiculo} y necesito: ${descripcion}`
    const url = `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  return (
    <div className="inicio">

      <section className="hero">
        <div className="hero-contenido">
          <h1>🔧 Taller JMV</h1>
          <p>Especialistas en chapería, pintura y reparación de vehículos</p>
          <a href="#presupuesto" className="btn-hero">Solicitar Presupuesto</a>
        </div>
      </section>

      <section className="servicios">
        <h2>Nuestros Servicios</h2>
        <div className="servicios-grid">
          <div className="servicio-card">
            <span>🚗</span>
            <h3>Chapería</h3>
            <p>Reparación de abolladuras y daños en la carrocería</p>
          </div>
          <div className="servicio-card">
            <span>🎨</span>
            <h3>Pintura</h3>
            <p>Pintura completa o parcial con acabado profesional</p>
          </div>
          <div className="servicio-card">
            <span>🔩</span>
            <h3>Repuestos</h3>
            <p>Venta de artículos y repuestos para tu vehículo</p>
          </div>
          <div className="servicio-card">
            <span>📋</span>
            <h3>Presupuestos</h3>
            <p>Presupuestos sin cargo y entrega a tiempo</p>
          </div>
        </div>
      </section>

      <section className="seccion-presupuesto" id="presupuesto">
        <h2>Solicitar Presupuesto</h2>
        <p>Completá el formulario y te contactamos por WhatsApp</p>
        <form className="form-presupuesto" onSubmit={enviarPresupuesto}>
          <input type="text" name="nombre" placeholder="Tu nombre completo" required />
          <input type="text" name="telefono" placeholder="Tu teléfono" required />
          <input type="text" name="vehiculo" placeholder="Marca y modelo de tu vehículo" required />
          <textarea name="descripcion" placeholder="Describí qué necesitás reparar" rows={4} required />
          <button type="submit">📲 Enviar por WhatsApp</button>
        </form>
      </section>

      <section className="contacto">
        <h2>Contáctenos</h2>
        <div className="contacto-grid">
          <div className="contacto-info">
            <div className="contacto-item">
              <span>📱</span>
              <div>
                <h4>WhatsApp</h4>
                <a href={`https://wa.me/${whatsappNumero}?text=${encodeURIComponent(whatsappMensaje)}`} target="_blank">
                  +595 971 661 680
                </a>
              </div>
            </div>
            <div className="contacto-item">
              <span>✉️</span>
              <div>
                <h4>Email</h4>
                <a href="mailto:tallerjmvelazquez@gmail.com">tallerjmvelazquez@gmail.com</a>
              </div>
            </div>
            <div className="contacto-item">
              <span>📍</span>
              <div>
                <h4>Ubicación</h4>
                <p>Asunción, Paraguay</p>
              </div>
            </div>
          </div>
          <div className="mapa">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607!2d-57.5026141!3d-25.2682553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945daf185405d759%3A0x9a1f8c759afdd632!2sTaller+JMV+Chaperia+y+Pintura!5e0!3m2!1ses!2spy!4v1234567890"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
            />
          </div>
        </div>
      </section>
<a 
  href={`https://wa.me/${whatsappNumero}?text=${encodeURIComponent(whatsappMensaje)}`} 
  target="_blank" 
  style={{
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 1000,
    textDecoration: 'none'
  }}
  title="Chateá con nosotros"
>
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
    alt="WhatsApp" 
    style={{ width: '65px', height: '65px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(37,211,102,0.5)' }}
  />
</a>
    </div>
  )
}

export default Inicio