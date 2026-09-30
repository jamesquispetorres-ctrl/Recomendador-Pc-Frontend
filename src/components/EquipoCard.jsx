import React from 'react'

export default function EquipoCard({ equipo, index }) {
  const formatPrecio = (precio) =>
    `$${Number(precio).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const enlaceReal = equipo.enlace_compra && equipo.enlace_compra.startsWith('http')
    ? equipo.enlace_compra
    : `https://www.google.com/search?q=${encodeURIComponent((equipo.marca || '') + ' ' + (equipo.modelo || ''))}`

  const nombreProducto = equipo.modelo?.toLowerCase().startsWith((equipo.marca || '').toLowerCase())
    ? equipo.modelo
    : `${equipo.marca || ''} ${equipo.modelo || ''}`.trim()

  return (
    <div
      className="equipo-card fade-up"
      style={{ '--delay': `${index * 0.05}s` }}
    >
      {/* ── IMAGEN / THUMBNAIL ── */}
      <div className="equipo-card-image-wrap">
        {equipo.imagen_url ? (
          <img
            src={equipo.imagen_url}
            alt={nombreProducto}
            className="equipo-card-img-src"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null
              e.target.style.display = 'none'
              e.target.parentElement.classList.add('img-fallback')
            }}
          />
        ) : (
          <div className="equipo-card-img-fallback">
            {equipo.tipo === 'laptop' ? '💻' : '🖥️'}
          </div>
        )}
        <span className="equipo-tipo-badge-floating">
          {equipo.tipo === 'laptop' ? '💻 Laptop' : '🖥️ PC Escritorio'}
        </span>
      </div>

      <div className="equipo-card-body">
        {/* ── CABECERA: TIENDA Y UBICACIÓN ── */}
        <div className="equipo-header">
          <div className="badge-tienda" title={`Vendido por ${equipo.tienda}`}>
            <span className="store-icon">🏬</span>
            <span className="store-name">{equipo.tienda || 'Google Shopping'}</span>
          </div>
          <span className="equipo-location">📍 {equipo.ciudad || 'Online'}</span>
        </div>

        {/* ── TÍTULO / NOMBRE DEL PRODUCTO ── */}
        <h3 className="equipo-nombre" title={nombreProducto}>
          {nombreProducto}
        </h3>

        {/* ── ESPECIFICACIONES TÉCNICAS ── */}
        <div className="specs-grid">
          <div className="spec-pill" title="Procesador">
            <span className="spec-icon">⚡</span>
            <span>{equipo.procesador?.split(' ').slice(0, 4).join(' ') || 'Intel / AMD'}</span>
          </div>
          <div className="spec-pill" title="Memoria RAM">
            <span className="spec-icon">🧠</span>
            <span>{equipo.memoria_ram} GB RAM</span>
          </div>
          <div className="spec-pill" title="Almacenamiento">
            <span className="spec-icon">💾</span>
            <span>{equipo.almacenamiento}</span>
          </div>
          <div className="spec-pill" title="Tarjeta Gráfica">
            <span className="spec-icon">🎮</span>
            <span>{equipo.tarjeta_grafica || 'Integrada'}</span>
          </div>
          {equipo.tamanio_pantalla && (
            <div className="spec-pill" title="Pantalla">
              <span className="spec-icon">🖥️</span>
              <span>{equipo.tamanio_pantalla}"</span>
            </div>
          )}
        </div>

        {/* ── DESCRIPCIÓN IA (Gemini) ── */}
        {equipo.explicacion && (
          <div className="gemini-desc-card">
            <div className="gemini-desc-header">
              <span className="gemini-desc-icon">✨</span>
              <span className="gemini-desc-label">Análisis IA</span>
            </div>
            <p className="gemini-desc-text">{equipo.explicacion}</p>
          </div>
        )}

        {/* ── PRECIO Y BOTÓN VER EN TIENDA ── */}
        <div className="equipo-card-footer">
          <div className="precio-wrap">
            <span className="precio-label">Precio USD</span>
            <div className="equipo-precio">{formatPrecio(equipo.precio)}</div>
          </div>

          <a
            href={enlaceReal}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ver-tienda"
            id={`btn-tienda-${equipo.id || index}`}
            title={`Abrir ${nombreProducto} en ${equipo.tienda || 'la tienda'}`}
          >
            <span>Ver en tienda</span>
            <span className="btn-arrow">↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}
