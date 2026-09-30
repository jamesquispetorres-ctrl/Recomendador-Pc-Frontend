import './index.css'
import { useState, useEffect } from 'react'
import { getRecomendaciones, getCatalogo } from './services/equiposService'
import WizardModal from './components/WizardModal'
import EquipoCard from './components/EquipoCard'
import LaptopCarousel from './components/LaptopCarousel'
import ComparadorModal from './components/ComparadorModal'

// Letras animadas para el título
function AnimatedTitle({ text }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="hero-letter"
          style={{ '--d': `${i * 0.04}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}

// Partículas de fondo
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  top:   `${Math.random() * 100}%`,
  left:  `${Math.random() * 100}%`,
  dur:   `${5 + Math.random() * 6}s`,
  delay: `${Math.random() * 4}s`,
}))

const STEPS_PREVIEW = [
  { num: 1, icon: '🎯', title: 'Tipo de uso',    desc: 'Gaming, trabajo, desarrollo o estudio' },
  { num: 2, icon: '🖥️', title: 'Tipo de equipo', desc: 'Laptop portátil, PC de escritorio o ambos' },
  { num: 3, icon: '🛒', title: 'Buscar & Comparar', desc: 'Precios reales y tiendas verificadas' },
]

export default function App() {
  const [showModal, setShowModal]     = useState(false)
  const [loading, setLoading]         = useState(false)
  const [resultados, setResultados]   = useState(null)
  const [error, setError]             = useState(null)
  const [activeStep, setActiveStep]   = useState(null)
  const [scrolled, setScrolled]       = useState(false)
  const [modo, setModo]               = useState('ninguno') // 'buscar' | 'comparar' | 'ninguno'
  const [showComparador, setShowComparador] = useState(false)

  // Navbar transparente sobre el hero, sólida al bajar
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  const handleOpenModal = (step = 0) => {
    setActiveStep(step)
    setShowModal(true)
    setError(null)
  }

  const handleSubmit = async (params) => {
    const { accion, tipo_uso, tipo_equipo, presupuesto } = params
    setLoading(true)
    setError(null)

    try {
      const data = await getRecomendaciones({
        presupuesto,
        tipo_uso,
        tipo_equipo,
      })
      setResultados(data)
      setModo(accion === 'comparar' ? 'comparar' : 'buscar')
      setShowModal(false)

      if (accion === 'comparar' && data.recomendaciones?.length > 0) {
        setShowComparador(true)
      }

      setTimeout(() => {
        document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      setError(
        err?.response?.data?.errores
          ? Object.values(err.response.data.errores).join(' · ')
          : 'No se pudo conectar con el servidor de equipos. Por favor verifica que el backend esté activo.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ══ NAVBAR ═══════════════════════════════════ */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <a href="/" className="navbar-brand">
            <img src="/assets/panda_logo.jpg" alt="LaptopAI Logo" className="navbar-logo" />
            <div className="navbar-brand-text">
              <div>LaptopAI <span className="text-gradient">Recomendador</span></div>
              <div className="navbar-tagline">Google Shopping API · Tiendas Verificadas</div>
            </div>
          </a>

          <div className="navbar-actions">
            <div className="navbar-status-badge" title="Conectado a la API de Google Shopping">
              <span className="navbar-dot-ping" />
              <span>🛍️ Google Shopping API</span>
            </div>

            <button
              id="btn-abrir-buscador"
              className="btn btn-primary btn-sm"
              onClick={() => handleOpenModal(0)}
            >
              ✨ Buscar Equipos
            </button>
          </div>
        </div>
      </nav>

      {/* ══ HERO CON FONDO Y EFECTOS ══════════════════════════════════ */}
      <section className="hero">
        <div className="hero-video hero-bg-kenburns" />
        <div className="hero-video-overlay" />

        <div className="hero-particles" style={{ zIndex: 2 }}>
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{ top: p.top, left: p.left, '--dur': p.dur, '--delay': p.delay }}
            />
          ))}
        </div>

        <div className="hero-content">
          <div className="container">
            <div className="hero-eyebrow">
              ⚡ Google Shopping API · Gemini IA · Tiendas Oficiales
            </div>

            <h1>
              <AnimatedTitle text="Encuentra tu laptop o PC ideal" />
            </h1>

            <p className="hero-subtitle">
              Busca y compara laptops y PCs de escritorio en tiempo real desde diferentes tiendas con precios transparentes y reales con enlaces directos de compra.
            </p>

            <div className="hero-cta" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                id="btn-hero-buscar"
                className="btn btn-primary btn-lg"
                onClick={() => handleOpenModal(0)}
              >
                🚀 Comenzar búsqueda
              </button>
              {resultados && (
                <button
                  className="btn btn-ghost btn-lg"
                  onClick={() => document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver resultados ↓
                </button>
              )}
            </div>

            <div style={{ marginTop: '36px', animation: 'bounce 2s ease infinite', color: 'rgba(255,255,255,0.4)', fontSize: '1.4rem' }}>
              ↓
            </div>
          </div>
        </div>
      </section>

      {/* ══ CARRUSEL DE LAPTOS ════════════════════════ */}
      <LaptopCarousel />

      {/* ══ PASOS DE BÚSQUEDA ═════════════════════════ */}
      <section className="steps-section">
        <div className="container">
          <div className="steps-header">
            <h2>¿Cómo funciona? <span className="text-gradient">3 pasos simples</span></h2>
            <p>Búsqueda directa en tiendas a través de Google Shopping API</p>
          </div>

          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {STEPS_PREVIEW.map((s) => (
              <div
                key={s.num}
                className="step-card fade-up"
                style={{ animationDelay: `${s.num * 0.1}s` }}
                onClick={() => handleOpenModal(s.num - 1)}
              >
                <div className="step-number">{s.num}</div>
                <span className="step-icon">{s.icon}</span>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
                <div className="step-active-badge">Clic para comenzar →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RESULTADOS DE BÚSQUEDA ════════════════════ */}
      {resultados && (
        <section className="results-section" id="resultados">
          <div className="container">
            <div className="results-header">
              <h2>
                {modo === 'comparar'
                  ? <>⚖️ Comparativa de <span className="text-gradient">Precios y Tiendas</span></>
                  : <>🎯 Catálogo de <span className="text-gradient">Equipos Recomendados</span></>
                }
              </h2>
              <p>
                {resultados.total > 0
                  ? `${resultados.total} equipo${resultados.total !== 1 ? 's' : ''} encontrado${resultados.total !== 1 ? 's' : ''}${resultados.presupuesto ? ` · Presupuesto $${Number(resultados.presupuesto).toLocaleString('en-US')} USD` : ''}`
                  : 'Sin resultados — intenta ampliar el presupuesto o cambiar el tipo de equipo'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <div className="results-banner">
                  <span className="dot-ping" />
                  <span>
                    🛍️ Datos en tiempo real · Enlaces directos a la tienda de compra
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                <button
                  id="btn-nueva-busqueda"
                  className="btn btn-primary"
                  onClick={() => handleOpenModal(0)}
                >
                  ✨ Nueva búsqueda
                </button>

                {resultados.recomendaciones?.length > 1 && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowComparador(true)}
                    title="Comparar resultados lado a lado"
                  >
                    ⚖️ Comparar equipos
                  </button>
                )}

                <button
                  className="btn btn-ghost"
                  onClick={() => { setResultados(null); setError(null); setModo('ninguno') }}
                >
                  🗑️ Limpiar
                </button>
              </div>
            </div>

            {error && (
              <div className="error-banner">⚠️ {error}</div>
            )}

            {resultados.total === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Sin resultados</h3>
                <p>No encontramos equipos dentro de ese rango exacto. Intenta ajustar el presupuesto.</p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => handleOpenModal(0)}>
                  Intentar de nuevo
                </button>
              </div>
            ) : (
              <div className="results-grid">
                {resultados.recomendaciones.map((equipo, i) => (
                  <EquipoCard key={equipo.id || i} equipo={equipo} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ FOOTER ════════════════════════════════════ */}
      <footer className="footer">
        <div className="container">
          <img src="/assets/panda_logo.jpg" alt="Logo" className="footer-logo" />
          <div>
            <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              LaptopAI Recomendador
            </span>
          </div>
          <p>
            Catálogo y precios en <strong>Dólares (USD)</strong> obtenidos en tiempo real vía <strong>Google Shopping API</strong>
          </p>
          <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>
            API Backend: <a href="http://localhost:8000/api/" target="_blank" rel="noopener noreferrer">localhost:8000/api/</a>
          </p>
        </div>
      </footer>

      {/* ══ MODAL WIZARD ══════════════════════════════ */}
      {showModal && (
        <WizardModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          loading={loading}
          initialStep={activeStep ?? 0}
        />
      )}

      {/* ══ COMPARADOR MODAL ══════════════════════════ */}
      {showComparador && resultados?.recomendaciones?.length > 0 && (
        <ComparadorModal
          equipos={resultados.recomendaciones}
          onClose={() => setShowComparador(false)}
        />
      )}
    </>
  )
}
