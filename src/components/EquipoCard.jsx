import StarRating from './StarRating'

export default function EquipoCard({ equipo, index }) {
  const formatPrecio = (precio) =>
    `S/. ${Number(precio).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  const scorePercent = Math.min(100, Math.round((equipo.score_afinidad || 0) * 100))

  const enlaceML =
    equipo.enlace_compra && equipo.enlace_compra.startsWith('http')
      ? equipo.enlace_compra
      : `https://listado.mercadolibre.com.pe/${encodeURIComponent(`${equipo.marca} ${equipo.modelo}`)}`

  return (
    <div
      className="equipo-card"
      style={{ '--delay': `${index * 0.07}s` }}
    >
      {/* Barra superior con gradiente de Mercado Libre y Tech */}
      <div className="equipo-card-img" />

      <div className="equipo-card-body">
        {/* Cabecera: Marca, Badge de Mercado Libre y Tipo */}
        <div className="equipo-header">
          <div className="equipo-brand-wrap">
            <span className="equipo-brand">{equipo.marca}</span>
            <span className="badge-mercadolibre" title="Producto sincronizado con Mercado Libre Perú">
              <span className="badge-ml-icon">🟡</span> Mercado Libre Perú
            </span>
          </div>

          <span className="equipo-tipo-badge">
            {equipo.tipo === 'laptop' ? '💻 Laptop' : '🖥️ PC'}
          </span>
        </div>

        <h3 className="equipo-nombre">{equipo.marca} {equipo.modelo}</h3>

        {/* Especificaciones técnicas */}
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
            <span className="spec-icon">📦</span>
            <span>Envío a todo el Perú</span>
          </div>
        </div>

        {/* Barra de afinidad del motor ML */}
        {scorePercent > 0 && (
          <div className="score-wrap">
            <div className="score-label">
              <span>Afinidad técnica con tu perfil</span>
              <span className="score-val">{scorePercent}%</span>
            </div>
            <div className="score-track">
              <div className="score-fill" style={{ width: `${scorePercent}%` }} />
            </div>
          </div>
        )}

        {/* Precio en Soles */}
        <div className="precio-container">
          <div className="equipo-precio">{formatPrecio(equipo.precio)}</div>
          <div className="precio-sub">Precio oficial en Soles (S/.)</div>
        </div>

        {/* Tarjeta de Explicación de Gemini AI */}
        {equipo.explicacion && (
          <div className="gemini-ia-card">
            <div className="gemini-ia-header">
              <div className="gemini-ia-badge">
                <span className="gemini-pulse-icon">🤖</span>
                <span>Análisis Google Gemini AI</span>
              </div>
              <span className="gemini-tag">Verificado</span>
            </div>
            <p className="gemini-ia-text">"{equipo.explicacion}"</p>
          </div>
        )}

        {/* Footer con botón directo a Mercado Libre */}
        <div className="equipo-footer">
          <a
            href={enlaceML}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-mercadolibre"
            id={`btn-comprar-ml-${equipo.id || index}`}
          >
            <span className="ml-cart-icon">🛒</span>
            <span>Comprar en Mercado Libre</span>
            <span className="ml-arrow">→</span>
          </a>

          <div className="equipo-card-subfooter">
            <div className="seller-trust">
              🛡️ Compra protegida por Mercado Pago
            </div>
            <StarRating equipoId={equipo.id} equipoNombre={`${equipo.marca} ${equipo.modelo}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
