import { useState, useEffect } from 'react'

const TIPOS_USO = [
  { value: 'gaming',       label: 'Gaming',       emoji: '🎮', desc: 'Juegos y alto rendimiento gráfico' },
  { value: 'diseño',       label: 'Diseño',        emoji: '🎨', desc: 'Edición gráfica y renderizado' },
  { value: 'oficina',      label: 'Oficina',       emoji: '💼', desc: 'Productividad y multitarea' },
  { value: 'estudiante',   label: 'Estudiante',    emoji: '📚', desc: 'Clases, tareas e investigación' },
  { value: 'programacion', label: 'Programación',  emoji: '💻', desc: 'Desarrollo, emuladores y código' },
  { value: 'multimedia',   label: 'Multimedia',    emoji: '🎬', desc: 'Streaming y entretenimiento' },
]

const TIPOS_EQUIPO = [
  { value: 'laptop',        label: 'Laptop',        emoji: '💻', desc: 'Portabilidad y trabajo en movimiento' },
  { value: 'pc_escritorio', label: 'PC Escritorio', emoji: '🖥️', desc: 'Máxima potencia y escalabilidad' },
  { value: 'ambos',         label: 'Ambos',          emoji: '🔄', desc: 'Ver las mejores ofertas de ambos' },
]

const ACCIONES_STEP3 = [
  {
    value: 'buscar',
    label: 'Buscar equipos',
    emoji: '🔍',
    desc: 'Explora ofertas en tiempo real y tiendas verificadas.',
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(99,102,241,0.10))',
    border: 'rgba(56,189,248,0.4)',
  },
  {
    value: 'comparar',
    label: 'Comparar características y tiendas',
    emoji: '⚖️',
    desc: 'Compara lado a lado precios, especificaciones y tiendas para elegir la mejor opción.',
    color: '#facc15',
    gradient: 'linear-gradient(135deg, rgba(250,204,21,0.15), rgba(251,146,60,0.10))',
    border: 'rgba(250,204,21,0.4)',
  },
]

const PRESUPUESTOS = [
  { label: '$500', value: 500 },
  { label: '$1,000', value: 1000 },
  { label: '$1,500', value: 1500 },
  { label: '$2,000', value: 2000 },
  { label: '$3,000', value: 3000 },
  { label: '$5,000+', value: 5000 },
]

const TOTAL_STEPS = 3

const STEPS_META = [
  {
    label: 'Tipo de uso',
    title: '¿Para qué usarás tu equipo?',
    subtitle: 'Elige tu perfil de uso para filtrar los mejores componentes.',
  },
  {
    label: 'Tipo de equipo',
    title: '¿Qué tipo de equipo buscas?',
    subtitle: 'Elige entre laptop portátil, PC de escritorio o explorar ambas opciones.',
  },
  {
    label: 'Acción y presupuesto',
    title: 'Configura tu búsqueda',
    subtitle: 'Selecciona cómo quieres buscar en las tiendas reales.',
  },
]

export default function WizardModal({ onClose, onSubmit, loading, initialStep = 0 }) {
  const [step, setStep] = useState(Math.min(initialStep, TOTAL_STEPS - 1))
  const [tipoUso, setTipoUso]       = useState('')
  const [tipoEquipo, setTipoEquipo] = useState('ambos')
  const [accion, setAccion]         = useState('buscar')
  const [presupuesto, setPresupuesto] = useState('1500')

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const canNext = () => {
    if (step === 0) return Boolean(tipoUso)
    if (step === 1) return Boolean(tipoEquipo)
    if (step === 2) return Boolean(accion) && Boolean(presupuesto && Number(presupuesto) > 0)
    return true
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    onSubmit({
      presupuesto: Number(presupuesto),
      tipo_uso: tipoUso,
      tipo_equipo: tipoEquipo,
      accion: accion,
    })
  }

  const meta = STEPS_META[step]

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Asistente de recomendación">

        {/* Cerrar */}
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

        {/* Barra de progreso */}
        <div className="modal-progress">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`modal-progress-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="modal-step-label">
          Paso {step + 1} de {TOTAL_STEPS} · {meta.label}
        </div>
        <h2 className="modal-title">{meta.title}</h2>
        <p className="modal-subtitle">{meta.subtitle}</p>

        {/* ── PASO 1: Tipo de uso ── */}
        {step === 0 && (
          <div className="option-chips">
            {TIPOS_USO.map((t) => (
              <div
                key={t.value}
                className={`option-chip ${tipoUso === t.value ? 'active' : ''}`}
                onClick={() => setTipoUso(t.value)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setTipoUso(t.value)}
              >
                <span className="chip-emoji">{t.emoji}</span>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.label}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{t.desc}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── PASO 2: Tipo de equipo ── */}
        {step === 1 && (
          <div className="option-chips" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {TIPOS_EQUIPO.map((t) => (
              <div
                key={t.value}
                className={`option-chip ${tipoEquipo === t.value ? 'active' : ''}`}
                onClick={() => setTipoEquipo(t.value)}
                role="button"
                tabIndex={0}
                style={{ padding: '24px 12px' }}
              >
                <span className="chip-emoji" style={{ fontSize: '2.4rem' }}>{t.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.label}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>{t.desc}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── PASO 3: Acciones y Presupuesto ── */}
        {step === 2 && (
          <div>
            <div className="wizard-acciones-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {ACCIONES_STEP3.map((a) => (
                <div
                  key={a.value}
                  className={`wizard-accion-card ${accion === a.value ? 'active' : ''}`}
                  onClick={() => setAccion(a.value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setAccion(a.value)}
                  style={{
                    '--accion-color': a.color,
                    '--accion-gradient': a.gradient,
                    '--accion-border': a.border,
                  }}
                >
                  <div className="wizard-accion-icon">{a.emoji}</div>
                  <div className="wizard-accion-label">{a.label}</div>
                  <div className="wizard-accion-desc">{a.desc}</div>
                  {accion === a.value && (
                    <div className="wizard-accion-check">✓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Presupuesto */}
            <div className="wizard-presupuesto-section" style={{ marginTop: '18px' }}>
              <div className="wizard-presupuesto-label">
                💰 Presupuesto máximo en Dólares (USD)
              </div>
              <div className="price-input-wrap" style={{ marginBottom: '12px' }}>
                <span className="price-prefix">$</span>
                <input
                  id="presupuesto-input"
                  type="number"
                  min="100"
                  step="100"
                  className="price-input"
                  placeholder="Ej: 3500"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="price-chips">
                {PRESUPUESTOS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={`price-chip ${Number(presupuesto) === p.value ? 'active' : ''}`}
                    onClick={() => setPresupuesto(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="modal-nav">
          {step > 0 ? (
            <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
              ← Anterior
            </button>
          ) : (
            <div />
          )}

          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canNext() || loading}
          >
            {loading ? (
              <><div className="spinner" /> Buscando en Google Shopping...</>
            ) : step === TOTAL_STEPS - 1 ? (
              accion === 'comparar'
                ? <>⚖️ Ver Comparación</>
                : <>🚀 Buscar Equipos</>
            ) : (
              <>Siguiente →</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
