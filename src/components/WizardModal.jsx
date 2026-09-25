import { useState, useEffect } from 'react'
import { useGeolocalizacion } from './GeolocalizacionProvider'
import { CIUDADES_POPULARES } from '../store/ubicacionStore'

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
  { label: 'Ubicación',      title: '¿Dónde estás ubicado?',            subtitle: 'Detecta tu ubicación por GPS o ingrésala manualmente.' },
]

export default function WizardModal({ onClose, onSubmit, loading, initialStep = 0 }) {
  const [step, setStep] = useState(initialStep)
  const [tipoUso, setTipoUso]       = useState('')
  const [tipoEquipo, setTipoEquipo] = useState('ambos')
  const [presupuesto, setPresupuesto] = useState('')
  const [conExplicacion, setConExplicacion] = useState(false)

  // Estado del paso de ubicación
  const [modoUbicacion, setModoUbicacion] = useState('auto') // 'auto' | 'manual'
  const [ciudadInput, setCiudadInput]     = useState('')
  const [depInput, setDepInput]           = useState('')

  const {
    solicitarAutomatica,
    establecerManual,
    limpiarUbicacion,
    ubicacion,
    origen,
    cargando: geoCargando,
    error: geoError,
    tieneUbicacion,
  } = useGeolocalizacion()

  // Sincronizar inputs si ya existe ubicación guardada
  useEffect(() => {
    if (ubicacion.ciudad) setCiudadInput(ubicacion.ciudad)
    if (ubicacion.departamento) setDepInput(ubicacion.departamento)
    if (origen === 'manual') setModoUbicacion('manual')
  }, [ubicacion, origen])

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
    return true // paso 4 (ubicación) es opcional
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSeleccionarCiudadRapida = (item) => {
    setCiudadInput(item.ciudad)
    setDepInput(item.departamento)
    establecerManual(item.ciudad, item.departamento)
  }

  const handleGuardarManual = (e) => {
    e?.preventDefault()
    if (ciudadInput.trim()) {
      establecerManual(ciudadInput, depInput || ciudadInput)
    }
  }

  const handleSubmit = () => {
    // Si el usuario escribió en el input manual pero no hizo clic en guardar, guardarlo
    if (modoUbicacion === 'manual' && ciudadInput.trim() && !tieneUbicacion) {
      establecerManual(ciudadInput, depInput || ciudadInput)
    }

    const payloadUbicacion = tieneUbicacion
      ? { ciudad: ubicacion.ciudad, departamento: ubicacion.departamento }
      : ciudadInput.trim()
        ? { ciudad: ciudadInput.trim(), departamento: depInput.trim() || ciudadInput.trim() }
        : null

    onSubmit({
      presupuesto: Number(presupuesto),
      tipo_uso: tipoUso,
      tipo_equipo: tipoEquipo,
      ubicacion: payloadUbicacion,
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
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{t.desc}</span>
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
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  Genera una justificación técnica personalizada en lenguaje simple
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PASO 4: Ubicación (Automática o Manual) ── */}
        {step === 3 && (
          <div className="geo-step-container">
            {/* Pestañas de modo */}
            <div className="geo-tabs">
              <button
                type="button"
                className={`geo-tab ${modoUbicacion === 'auto' ? 'active' : ''}`}
                onClick={() => setModoUbicacion('auto')}
              >
                🛰️ Detectar automática (GPS)
              </button>
              <button
                type="button"
                className={`geo-tab ${modoUbicacion === 'manual' ? 'active' : ''}`}
                onClick={() => setModoUbicacion('manual')}
              >
                ✍️ Insertar ubicación manual
              </button>
            </div>

            {/* OPCIÓN 1: Automática */}
            {modoUbicacion === 'auto' && (
              <div className="geo-box-content fade-in">
                <button
                  type="button"
                  className="geo-btn-cta"
                  onClick={solicitarAutomatica}
                  disabled={geoCargando}
                >
                  {geoCargando ? (
                    <>
                      <div className="spinner" style={{ width: 18, height: 18 }} />
                      Consultando satélite / GPS...
                    </>
                  ) : (
                    <>📍 Detectar mi ubicación por GPS</>
                  )}
                </button>
                <p className="geo-help-text">
                  Usamos la geolocalización segura de tu navegador y OpenStreetMap para ubicar tu ciudad.
                </p>
              </div>
            )}

            {/* OPCIÓN 2: Manual */}
            {modoUbicacion === 'manual' && (
              <div className="geo-box-content fade-in">
                <form onSubmit={handleGuardarManual} className="geo-manual-form">
                  <div className="geo-inputs-grid">
                    <div>
                      <label className="geo-label" htmlFor="geo-ciudad-input">Ciudad *</label>
                      <input
                        id="geo-ciudad-input"
                        type="text"
                        className="geo-input"
                        placeholder="Ej: Lima, Arequipa, Cusco"
                        value={ciudadInput}
                        onChange={(e) => {
                          setCiudadInput(e.target.value)
                          if (e.target.value.trim()) {
                            establecerManual(e.target.value, depInput || e.target.value)
                          }
                        }}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="geo-label" htmlFor="geo-dep-input">Departamento / Región</label>
                      <input
                        id="geo-dep-input"
                        type="text"
                        className="geo-input"
                        placeholder="Ej: Lima, Arequipa, La Libertad"
                        value={depInput}
                        onChange={(e) => {
                          setDepInput(e.target.value)
                          if (ciudadInput.trim()) {
                            establecerManual(ciudadInput, e.target.value || ciudadInput)
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Ciudades frecuentes para selección rápida con 1 clic */}
                  <div className="quick-cities-wrap">
                    <span className="quick-cities-title">Ciudades frecuentes:</span>
                    <div className="quick-cities-chips">
                      {CIUDADES_POPULARES.map((item) => (
                        <button
                          key={item.ciudad}
                          type="button"
                          className={`quick-city-chip ${ciudadInput.toLowerCase() === item.ciudad.toLowerCase() ? 'active' : ''}`}
                          onClick={() => handleSeleccionarCiudadRapida(item)}
                        >
                          {item.ciudad}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Card de ubicación actualmente activa */}
            {tieneUbicacion && (
              <div className="geo-active-card fade-up">
                <div className="geo-active-icon">📍</div>
                <div className="geo-active-info">
                  <div className="geo-active-title">
                    {ubicacion.ciudad}{ubicacion.departamento ? `, ${ubicacion.departamento}` : ''}
                  </div>
                  <span className={`geo-badge ${origen === 'automatica' ? 'badge-auto' : 'badge-manual'}`}>
                    {origen === 'automatica' ? '🛰️ Detectada por GPS' : '✍️ Ingresada manualmente'}
                  </span>
                </div>
                <button
                  type="button"
                  className="geo-active-clear"
                  onClick={() => {
                    limpiarUbicacion()
                    setCiudadInput('')
                    setDepInput('')
                  }}
                  title="Quitar ubicación"
                >
                  ✕ Quitar
                </button>
              </div>
            )}

            {/* Alerta de error si ocurrió */}
            {geoError && (
              <div className="geo-error-box">
                ⚠️ {geoError}
              </div>
            )}

            <p className="geo-footnote">
              💡 La ubicación es <strong>opcional</strong>. Si la configuras, priorizamos tiendas físicas y tiempos de entrega en tu localidad.
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
