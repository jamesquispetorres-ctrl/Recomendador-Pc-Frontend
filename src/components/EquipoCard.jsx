import StarRating from './StarRating'

export default function EquipoCard({ equipo, index }) {
  const formatPrecio = (precio) =>
    `S/. ${Number(precio).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  // Porcentaje de beneficio calculado por el motor (0-100%)
  const beneficio =
    equipo.porcentaje_beneficio ||
    Math.min(98, Math.max(65, Math.round((equipo.score_afinidad || 0.5) * 100)))

  const etiqueta =
    equipo.etiqueta_beneficio ||
    (beneficio >= 90
      ? 'Excelente opción · Máximo beneficio'
      : beneficio >= 80
      ? 'Muy beneficioso · Gran balance'
      : 'Buena alternativa · Precio accesible')

  const ahorro = equipo.ahorro ? Number(equipo.ahorro) : 0

  // Construir enlace 100% funcional y activo a los listados en vivo de Mercado Libre Perú
  const cleanMarca =
    equipo.marca?.toLowerCase().includes(equipo.modelo?.toLowerCase()) ||
    equipo.marca?.toLowerCase().includes('custom')
      ? ''
      : equipo.marca

  const slug = `${cleanMarca} ${equipo.modelo}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const enlaceML =
    equipo.enlace_compra &&
    equipo.enlace_compra.startsWith('http') &&
    !equipo.enlace_compra.includes('MPE-') &&
    !equipo.enlace_compra.includes('articulo.mercadolibre')
      ? equipo.enlace_compra
      : `https://listado.mercadolibre.com.pe/${slug}`

  const handleOpenML = (e) => {
    e.preventDefault()
    window.open(enlaceML, '_blank', 'noopener,noreferrer')
  }

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
            <span className="badge-mercadolibre" title="Catálogo sincronizado con Mercado Libre Perú">
              <span className="badge-ml-icon">🟡</span> Mercado Libre Perú
            </span>
          </div>

          <span className="equipo-tipo-badge">
            {equipo.tipo === 'laptop' ? '💻 Laptop' : '🖥️ PC'}
          </span>
        </div>

        <h3 className="equipo-nombre">{equipo.marca} {equipo.modelo}</h3>

        {/* ── BARRA DE BENEFICIO PARA TI ── */}
        <div className="benefit-container">
          <div className="benefit-header">
            <div className="benefit-title-wrap">
              <span className="benefit-icon">📈</span>
              <span className="benefit-title">Beneficio para ti</span>
            </div>
            <span className="benefit-val">{beneficio}%</span>
          </div>

          <div className="benefit-track" title={`Nivel de beneficio estimado: ${beneficio}%`}>
            <div
              className="benefit-fill"
              style={{ width: `${beneficio}%` }}
            />
          </div>

          <div className="benefit-footer">
            <span className="benefit-tag-status">
              ✨ {etiqueta}
            </span>
            {ahorro > 0 && (
              <span className="benefit-savings-pill">
                💰 Ahorras S/. {ahorro.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            )}
          </div>
        </div>

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

        {/* Precio en Soles */}
        <div className="precio-container">
          <div className="equipo-precio">{formatPrecio(equipo.precio)}</div>
          <div className="precio-sub">Precio verificado en Soles (S/.)</div>
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
            onClick={handleOpenML}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-mercadolibre"
            id={`btn-comprar-ml-${equipo.id || index}`}
            title="Abrir publicaciones activas en Mercado Libre Perú"
          >
            <span className="ml-cart-icon">🛒</span>
            <span>Comprar en Mercado Libre</span>
            <span className="ml-arrow">→</span>
          </a>

          <div className="equipo-card-subfooter">
            <div className="seller-trust">
              🛡️ Compra protegida con garantía Mercado Libre
            </div>
            <StarRating equipoId={equipo.id} equipoNombre={`${equipo.marca} ${equipo.modelo}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
