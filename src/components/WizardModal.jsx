import { useState, useEffect } from 'react'
import { useGeolocalizacion } from './GeolocalizacionProvider'

const TIPOS_USO = [
  { value: 'gaming',       label: 'Gaming',       emoji: '🎮', desc: 'Juegos y alto rendimiento' },
  { value: 'diseño',       label: 'Diseño',        emoji: '🎨', desc: 'Edición y creatividad' },
  { value: 'oficina',      label: 'Oficina',       emoji: '💼', desc: 'Trabajo y productividad' },
  { value: 'estudiante',   label: 'Estudiante',    emoji: '📚', desc: 'Universidad y tareas' },
  { value: 'programacion', label: 'Programación',  emoji: '💻', desc: 'Desarrollo y código' },
  { value: 'multimedia',   label: 'Multimedia',    emoji: '🎬', desc: 'Entretenimiento' },
]

const TIPOS_EQUIPO = [
  { value: 'laptop',        label: 'Laptop',       emoji: '💻' },
  { value: 'pc_escritorio', label: 'PC Escritorio', emoji: '🖥️' },
  { value: 'ambos',         label: 'Ambos',         emoji: '🔄' },
]

const PRESUPUESTOS = [
  { label: 'S/. 1,500', value: 1500 },
  { label: 'S/. 2,500', value: 2500 },
  { label: 'S/. 4,000', value: 4000 },
  { label: 'S/. 6,000', value: 6000 },
  { label: 'S/. 10,000', value: 10000 },
]

const TOTAL_STEPS = 4

const STEPS_META = [
  { label: 'Tipo de uso',    title: '¿Para qué usarás tu laptop?',     subtitle: 'Elige el perfil que mejor describe tu uso principal.' },
  { label: 'Tipo de equipo', title: '¿Qué tipo de equipo prefieres?',   subtitle: 'Selecciona si buscas laptop, PC de escritorio o ambos.' },
  { label: 'Presupuesto',    title: '¿Cuál es tu presupuesto?',         subtitle: 'Ingresa o elige un monto en soles peruanos (S/.).' },
  { label: 'Ubicación',      title: '¿Dónde estás ubicado?',            subtitle: 'Opcional — te ayudamos a encontrar equipos en tu zona.' },
]

export default function WizardModal({ onClose, onSubmit, loading }) {
  const [step, setStep] = useState(0)
  const [tipoUso, setTipoUso]       = useState('')
  const [tipoEquipo, setTipoEquipo] = useState('ambos')
  const [presupuesto, setPresupuesto] = useState('')
  const [conExplicacion, setConExplicacion] = useState(false)

  const { solicitar, ubicacion, cargando: geoCargando, error: geoError, tieneUbicacion } = useGeolocalizacion()

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const canNext = () => {
    if (step === 0) return !!tipoUso
    if (step === 1) return !!tipoEquipo
    if (step === 2) return !!presupuesto && Number(presupuesto) > 0
    return true // paso 4 (ubicación) es opcional
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1)
    else handleSubmit()
  }

  const handleSubmit = () => {
    onSubmit({
      presupuesto: Number(presupuesto),
      tipo_uso: tipoUso,
      tipo_equipo: tipoEquipo,
      ubicacion: tieneUbicacion ? { ciudad: ubicacion.ciudad, departamento: ubicacion.departamento } : null,
      con_explicacion: conExplicacion,
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
        <div className="modal-step-label">Paso {step + 1} de {TOTAL_STEPS} · {meta.label}</div>
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
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.label}</span>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>{t.desc}</span>
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
              >
                <span className="chip-emoji" style={{ fontSize: '2rem' }}>{t.emoji}</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── PASO 3: Presupuesto ── */}
        {step === 2 && (
          <div>
            <div className="price-input-wrap" style={{ marginBottom: '12px' }}>
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

            {/* Explicaciones Gemini */}
            <div
              style={{
                marginTop: '20px',
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 'var(--r-md)',
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                transition: 'var(--t)',
              }}
              onClick={() => setConExplicacion(!conExplicacion)}
              role="checkbox"
              aria-checked={conExplicacion}
              tabIndex={0}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0,
                background: conExplicacion ? 'var(--indigo)' : 'transparent',
                border: `2px solid ${conExplicacion ? 'var(--indigo)' : '#475569'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.7rem', transition: 'var(--t)',
              }}>
                {conExplicacion ? '✓' : ''}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                  🤖 Explicaciones con Gemini AI
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                  Genera una explicación personalizada por cada equipo recomendado
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PASO 4: Ubicación ── */}
        {step === 3 && (
          <div>
            <button className="geo-btn" onClick={solicitar} disabled={geoCargando}>
              {geoCargando ? '⏳ Detectando...' : '📍 Detectar mi ubicación automáticamente'}
            </button>

            {tieneUbicacion && (
              <div className="geo-result">
                ✅ {ubicacion.ciudad}, {ubicacion.departamento}
              </div>
            )}
            {geoError && (
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#fca5a5' }}>
                ⚠️ {geoError}
              </div>
            )}
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '12px', lineHeight: 1.5 }}>
              Usamos la API gratuita de OpenStreetMap. Puedes saltar este paso — la ubicación es opcional.
            </p>
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
              <><div className="spinner" /> Buscando...</>
            ) : step === TOTAL_STEPS - 1 ? (
              <>✨ Buscar recomendaciones</>
            ) : (
              <>Siguiente →</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
