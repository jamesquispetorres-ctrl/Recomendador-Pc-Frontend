import StarRating from './StarRating'

export default function EquipoCard({ equipo, index }) {
  const formatPrecio = (precio) =>
    `S/. ${Number(precio).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  const scorePercent = Math.min(100, Math.round((equipo.score_afinidad || 0) * 100))

  return (
    <div
      className="equipo-card"
      style={{ '--delay': `${index * 0.07}s` }}
    >
      <div className="equipo-card-img" />
      <div className="equipo-card-body">
        <div className="equipo-header">
          <div className="equipo-brand">{equipo.marca}</div>
          <span className="equipo-tipo-badge">
            {equipo.tipo === 'laptop' ? '💻 Laptop' : '🖥️ PC'}
          </span>
        </div>

        <h3 className="equipo-nombre">{equipo.marca} {equipo.modelo}</h3>

        <div className="specs-grid">
          <div className="spec">
            <span className="spec-icon">⚡</span>
            <span>{equipo.procesador?.split(' ').slice(0, 4).join(' ') || 'N/D'}</span>
          </div>
          <div className="spec">
            <span className="spec-icon">🧠</span>
            <span>{equipo.memoria_ram} GB RAM</span>
          </div>
          <div className="spec">
            <span className="spec-icon">💾</span>
            <span>{equipo.almacenamiento}</span>
          </div>
          <div className="spec">
            <span className="spec-icon">🎮</span>
            <span>{equipo.tarjeta_grafica || 'Integrada'}</span>
          </div>
          {equipo.tamanio_pantalla && (
            <div className="spec">
              <span className="spec-icon">🖥️</span>
              <span>{equipo.tamanio_pantalla}"</span>
            </div>
          )}
          <div className="spec">
            <span className="spec-icon">📍</span>
            <span>{equipo.ciudad}</span>
          </div>
        </div>

        {scorePercent > 0 && (
          <div className="score-wrap">
            <div className="score-label">
              <span>Afinidad con tu perfil</span>
              <span className="score-val">{scorePercent}%</span>
            </div>
            <div className="score-track">
              <div className="score-fill" style={{ width: `${scorePercent}%` }} />
            </div>
          </div>
        )}

        <div className="equipo-precio">{formatPrecio(equipo.precio)}</div>
        <div className="equipo-tienda">🏪 {equipo.tienda} · {equipo.ciudad}, {equipo.departamento}</div>

        {equipo.explicacion && (
          <div className="equipo-explicacion">
            💡 {equipo.explicacion}
          </div>
        )}

        <div className="equipo-footer">
          <a
            href={equipo.enlace_compra || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-comprar"
          >
            🛒 Ver oferta
          </a>
          <StarRating equipoId={equipo.id} equipoNombre={`${equipo.marca} ${equipo.modelo}`} />
        </div>
      </div>
    </div>
  )
}
