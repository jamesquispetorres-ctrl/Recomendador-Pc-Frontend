import { useState } from 'react'

const LABELS = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', '¡Excelente!']

export default function StarRating({ equipoId, equipoNombre }) {
  const [hover, setHover] = useState(0)
  const [rating, setRating] = useState(0)
  const [sent, setSent] = useState(false)

  const handleRate = (val) => {
    setRating(val)
    setTimeout(() => setSent(true), 400)
  }

  if (sent) {
    return (
      <div className="rating-panel">
        <span style={{ fontSize: '1.1rem' }}>
          {rating >= 4 ? '🎉' : rating >= 3 ? '😊' : '🙏'}
        </span>
        <span className="rating-thanks">
          ¡Gracias por tu valoración de {rating} estrella{rating !== 1 ? 's' : ''}!
        </span>
      </div>
    )
  }

  return (
    <div className="rating-panel">
      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Valorar:</span>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((val) => (
          <span
            key={val}
            className={`star ${val <= (hover || rating) ? 'active' : ''}`}
            onMouseEnter={() => setHover(val)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(val)}
            role="button"
            aria-label={`${val} estrella${val !== 1 ? 's' : ''}`}
            title={LABELS[val]}
          >
            ⭐
          </span>
        ))}
      </div>
      {(hover || rating) > 0 && (
        <span className="rating-label">{LABELS[hover || rating]}</span>
      )}
    </div>
  )
}
