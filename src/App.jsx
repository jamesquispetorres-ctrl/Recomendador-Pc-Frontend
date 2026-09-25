import './index.css'
import { useState, useEffect } from 'react'
import { getRecomendaciones } from './services/equiposService'
import WizardModal from './components/WizardModal'
import EquipoCard from './components/EquipoCard'
import LaptopCarousel from './components/LaptopCarousel'

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
  { num: 1, icon: '🎯', title: 'Tipo de uso',     desc: 'Dinos para qué usarás el equipo' },
  { num: 2, icon: '🖥️', title: 'Tipo de equipo',  desc: 'Laptop, PC o ambas opciones' },
  { num: 3, icon: '💰', title: 'Tu presupuesto',   desc: 'Define cuánto quieres invertir' },
  { num: 4, icon: '📍', title: 'Tu ubicación',     desc: 'Opcional — filtra por ciudad' },
]

export default function App() {
  const [showModal, setShowModal]     = useState(false)
  const [loading, setLoading]         = useState(false)
  const [resultados, setResultados]   = useState(null)
  const [error, setError]             = useState(null)
  const [activeStep, setActiveStep]   = useState(null)
  const [scrolled, setScrolled]       = useState(false)

  // Navbar transparente sobre el video, sólida al bajar
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
    setLoading(true)
    setError(null)
    try {
      const data = await getRecomendaciones(params)
      setResultados(data)
      setShowModal(false)
      // Scroll suave a resultados
      setTimeout(() => {
        document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      setError(
        err?.response?.data?.errores
          ? Object.values(err.response.data.errores).join(' · ')
          : 'No se pudo conectar con el servidor. ¿Está corriendo el backend?'
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
            <div>
              <div>LaptopAI <span className="text-gradient">Recomendador</span></div>
              <div className="navbar-tagline">Powered by scikit-learn + Gemini</div>
            </div>
          </a>
          <button
            id="btn-abrir-buscador"
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenModal()}
          >
            ✨ Buscar laptop
          </button>
        </div>
      </nav>

      {/* ══ HERO con VIDEO FULL-SCREEN ══════════════════════════════════ */}
      <section className="hero">

        {/* ── Fondo animado Ken Burns (simula video) ── */}
        <div className="hero-video hero-bg-kenburns" />


        {/* ── Overlay oscuro degradado ── */}
        <div className="hero-video-overlay" />

        {/* ── Partículas decorativas sobre el video ── */}
        <div className="hero-particles" style={{ zIndex: 2 }}>
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{ top: p.top, left: p.left, '--dur': p.dur, '--delay': p.delay }}
            />
          ))}
        </div>

        {/* ── Contenido centrado ── */}
        <div className="hero-content">
          <div className="container">

            <div className="hero-eyebrow">
              🤖 Inteligencia Artificial · scikit-learn · Google Gemini
            </div>

            <h1>
              <AnimatedTitle text="Encuentra tu laptop con IA" />
            </h1>

            <p className="hero-subtitle">
              Responde 4 preguntas rápidas y nuestro motor de IA analiza
              cientos de equipos para encontrar los mejores dentro de tu presupuesto en <strong>soles peruanos</strong>.
            </p>

            <div className="hero-cta" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                id="btn-hero-buscar"
                className="btn btn-primary btn-lg"
                onClick={() => handleOpenModal()}
              >
                ✨ Comenzar búsqueda
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

            {/* Indicador de scroll */}
            <div style={{ marginTop: '40px', animation: 'bounce 2s ease infinite', color: 'rgba(255,255,255,0.4)', fontSize: '1.4rem' }}>
              ↓
            </div>
          </div>
        </div>

      </section>

      {/* ══ CARRUSEL ══════════════════════════════════ */}
      <LaptopCarousel />

      {/* ══ PASOS (preview) ═══════════════════════════ */}
      <section className="steps-section">
        <div className="container">
          <div className="steps-header">
            <h2>¿Cómo funciona? <span className="text-gradient">4 pasos simples</span></h2>
            <p>Nuestro asistente te guía paso a paso para encontrar el equipo ideal</p>
          </div>

          <div className="steps-grid">
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

      {/* ══ RESULTADOS ════════════════════════════════ */}
      {resultados && (
        <section className="results-section" id="resultados">
          <div className="container">
            <div className="results-header">
              <h2>
                🎯 Recomendaciones <span className="text-gradient">para ti</span>
              </h2>
              <p>
                {resultados.total > 0
                  ? `${resultados.total} equipo${resultados.total !== 1 ? 's' : ''} encontrado${resultados.total !== 1 ? 's' : ''} · Presupuesto S/. ${Number(resultados.presupuesto).toLocaleString('es-PE')}`
                  : 'Sin resultados — intenta ampliar el presupuesto o cambiar el tipo de equipo'}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
                <button
                  id="btn-nueva-busqueda"
                  className="btn btn-primary"
                  onClick={() => handleOpenModal()}
                >
                  ✨ Nueva búsqueda
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setResultados(null); setError(null) }}
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
                <p>No encontramos equipos con esos criterios. Aumenta el presupuesto o elige "Ambos" en tipo de equipo.</p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => handleOpenModal()}>
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
          <p>Precios en <strong>Soles Peruanos (S/.)</strong> · Motor ML con scikit-learn · Explicaciones con Google Gemini</p>
          <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>
            API: <a href="http://localhost:8000/api/" target="_blank" rel="noopener noreferrer">localhost:8000/api/</a>
          </p>
        </div>
      </footer>

      {/* ══ MODAL WIZARD ══════════════════════════════ */}
      {showModal && (
        <WizardModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </>
  )
}
