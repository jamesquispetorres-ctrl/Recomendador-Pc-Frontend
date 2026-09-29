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
  { value: 'laptop',        label: 'Laptop',       emoji: '💻', desc: 'Portabilidad y trabajo en movimiento' },
  { value: 'pc_escritorio', label: 'PC Escritorio', emoji: '🖥️', desc: 'Máxima potencia y escalabilidad' },
  { value: 'ambos',         label: 'Ambos',         emoji: '🔄', desc: 'Ver las mejores ofertas de ambos' },
]

const PRESUPUESTOS = [
  { label: 'S/. 1,500', value: 1500 },
  { label: 'S/. 2,500', value: 2500 },
  { label: 'S/. 3,500', value: 3500 },
  { label: 'S/. 4,500', value: 4500 },
  { label: 'S/. 6,000', value: 6000 },
  { label: 'S/. 8,000+', value: 8000 },
]

const TOTAL_STEPS = 3

const STEPS_META = [
  {
    label: 'Tipo de uso',
    title: '¿Para qué usarás tu equipo?',
    subtitle: 'Elige tu perfil de uso para calcular la afinidad y balance de hardware ideal.',
  },
  {
    label: 'Tipo de equipo',
    title: '¿Qué tipo de equipo buscas?',
    subtitle: 'Elige entre laptop portátil, PC de escritorio o explorar ambas opciones.',
  },
  {
    label: 'Presupuesto',
    title: '¿Cuál es tu presupuesto en Soles?',
    subtitle: 'Búsqueda directa en Mercado Libre Perú con análisis automático de Gemini AI.',
  },
]

export default function WizardModal({ onClose, onSubmit, loading, initialStep = 0 }) {
  const [step, setStep] = useState(Math.min(initialStep, TOTAL_STEPS - 1))
  const [tipoUso, setTipoUso]       = useState('')
  const [tipoEquipo, setTipoEquipo] = useState('ambos')
  const [presupuesto, setPresupuesto] = useState('')

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const canNext = () => {
    if (step === 0) return Boolean(tipoUso)
    if (step === 1) return Boolean(tipoEquipo)
    if (step === 2) return Boolean(presupuesto && Number(presupuesto) > 0)
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
      con_explicacion: true, // Gemini AI activado por defecto
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

        {/* ── PASO 3: Presupuesto ── */}
        {step === 2 && (
          <div>
            <div className="price-input-wrap" style={{ marginBottom: '14px' }}>
              <span className="price-prefix">S/.</span>
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

            {/* Tarjeta de Garantía: Mercado Libre + Gemini AI Automático */}
            <div className="wizard-integrations-card">
              <div className="wizard-ai-banner">
                <div className="wizard-ai-icon-pulse">🤖</div>
                <div className="wizard-ai-text">
                  <div className="wizard-ai-badge">Google Gemini AI Activo</div>
                  <div className="wizard-ai-heading">Explicaciones generadas por defecto</div>
                  <div className="wizard-ai-caption">
                    Cada equipo incluirá una justificación técnica inteligente explicando por qué es la mejor opción para tu uso.
                  </div>
                </div>
              </div>

              <div className="wizard-ml-banner">
                <div className="ml-logo-pill">
                  <span className="ml-badge-circle">🟡</span>
                  <strong>Mercado Libre Perú (MPE)</strong>
                </div>
                <span className="ml-banner-desc">Catálogo, precios en soles y enlaces directos de compra sincronizados.</span>
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
              <><div className="spinner" /> Consultando Mercado Libre e IA...</>
            ) : step === TOTAL_STEPS - 1 ? (
              <>🚀 Buscar en Mercado Libre</>
            ) : (
              <>Siguiente →</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
