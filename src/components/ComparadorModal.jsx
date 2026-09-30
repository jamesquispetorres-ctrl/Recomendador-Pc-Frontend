import StarRating from './StarRating'

export default function ComparadorModal({ equipos, onClose }) {
  const formatPrecio = (precio) =>
    `$${Number(precio).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const getBeneficio = (eq) =>
    eq.porcentaje_beneficio ||
    Math.min(98, Math.max(65, Math.round((eq.score_afinidad || 0.5) * 100)))

  const specs = [
    { label: 'Precio',        icon: '💰', get: (eq) => formatPrecio(eq.precio) },
    { label: 'Procesador',    icon: '⚡', get: (eq) => eq.procesador?.split(' ').slice(0, 5).join(' ') || 'N/D' },
    { label: 'RAM',           icon: '🧠', get: (eq) => `${eq.memoria_ram} GB` },
    { label: 'Almacenamiento',icon: '💾', get: (eq) => eq.almacenamiento || 'N/D' },
    { label: 'Tarjeta Gráfica',icon: '🎮',get: (eq) => eq.tarjeta_grafica || 'Integrada' },
    { label: 'Pantalla',      icon: '🖥️', get: (eq) => eq.tamanio_pantalla ? `${eq.tamanio_pantalla}"` : 'N/D' },
    { label: 'Beneficio',     icon: '📈', get: (eq) => `${getBeneficio(eq)}%` },
    { label: 'Tienda',        icon: '🏪', get: (eq) => eq.tienda || 'Mercado Libre Perú' },
  ]

  // Colores para destacar el mejor valor
  const getBestIndex = (specKey) => {
    if (specKey === 'Precio') {
      // Menor precio gana
      const precios = equipos.map((eq) => Number(eq.precio))
      const min = Math.min(...precios)
      return precios.indexOf(min)
    }
    if (specKey === 'RAM') {
      const rams = equipos.map((eq) => Number(eq.memoria_ram))
      const max = Math.max(...rams)
      return rams.indexOf(max)
    }
    if (specKey === 'Beneficio') {
      const bens = equipos.map((eq) => getBeneficio(eq))
      const max = Math.max(...bens)
      return bens.indexOf(max)
    }
    return -1
  }

  const visibleEquipos = equipos.slice(0, 3) // Max 3 columnas

  const getEnlaceML = (eq) => {
    const cleanMarca = eq.marca?.toLowerCase().includes(eq.modelo?.toLowerCase()) ? '' : eq.marca
    const slug = `${cleanMarca} ${eq.modelo}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return eq.enlace_compra?.startsWith('http') ? eq.enlace_compra : `https://listado.mercadolibre.com.pe/${slug}`
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="comparador-panel">

        {/* Header */}
        <div className="comparador-header">
          <div>
            <h2 className="comparador-title">⚖️ Comparar Laptops</h2>
            <p className="comparador-subtitle">
              {visibleEquipos.length} equipos · Mercado Libre Perú
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar comparador">✕</button>
        </div>

        <div className="comparador-scroll">
          <table className="comparador-table">
            <thead>
              <tr>
                <th className="comparador-th-spec">Especificación</th>
                {visibleEquipos.map((eq, i) => (
                  <th key={i} className="comparador-th-equipo">
                    <div className="comparador-equipo-header">
                      <div className="comparador-equipo-rank">#{i + 1}</div>
                      <div className="comparador-equipo-nombre">
                        {eq.marca} {eq.modelo?.split(' ').slice(0, 3).join(' ')}
                      </div>
                      <span className="badge-mercadolibre" style={{ fontSize: '0.65rem' }}>
                        🟡 ML Perú
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec) => {
                const bestIdx = getBestIndex(spec.label)
                return (
                  <tr key={spec.label} className="comparador-row">
                    <td className="comparador-td-spec">
                      <span>{spec.icon}</span>
                      <span>{spec.label}</span>
                    </td>
                    {visibleEquipos.map((eq, i) => (
                      <td
                        key={i}
                        className={`comparador-td-val ${bestIdx === i ? 'comparador-td-best' : ''}`}
                      >
                        {bestIdx === i && <span className="comparador-best-badge">✓ Mejor</span>}
                        {spec.get(eq)}
                      </td>
                    ))}
                  </tr>
                )
              })}

              {/* Fila explicación Gemini */}
              <tr className="comparador-row">
                <td className="comparador-td-spec"><span>🤖</span><span>Análisis IA</span></td>
                {visibleEquipos.map((eq, i) => (
                  <td key={i} className="comparador-td-val comparador-td-ia">
                    {eq.explicacion
                      ? <span className="comparador-ia-text">"{eq.explicacion.slice(0, 100)}..."</span>
                      : <span style={{ color: '#475569', fontSize: '0.75rem' }}>Sin análisis IA</span>
                    }
                  </td>
                ))}
              </tr>

              {/* Fila Valoración */}
              <tr className="comparador-row">
                <td className="comparador-td-spec"><span>⭐</span><span>Tu valoración</span></td>
                {visibleEquipos.map((eq, i) => (
                  <td key={i} className="comparador-td-val">
                    <StarRating equipoId={eq.id} equipoNombre={`${eq.marca} ${eq.modelo}`} />
                  </td>
                ))}
              </tr>

              {/* Fila botón compra */}
              <tr className="comparador-row">
                <td className="comparador-td-spec"><span>🛒</span><span>Comprar</span></td>
                {visibleEquipos.map((eq, i) => (
                  <td key={i} className="comparador-td-val">
                    <a
                      href={getEnlaceML(eq)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-mercadolibre comparador-btn-ml"
                    >
                      Ver en ML →
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
