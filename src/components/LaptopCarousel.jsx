import { useState, useEffect, useRef } from 'react'

const SLIDES = [
  { img: '/assets/laptop_gaming.jpg',    label: 'Gaming de Alto Rendimiento', sub: 'RTX 4070 · 32GB RAM · 144Hz' },
  { img: '/assets/laptop_ultrabook.jpg', label: 'Ultrabooks Premium',          sub: 'Diseño delgado · Batería larga' },
  { img: '/assets/laptop_design.jpg',    label: 'Para Creativos',              sub: 'Pantalla calibrada · Color preciso' },
  { img: '/assets/laptop_student.jpg',   label: 'Ideal para Estudiar',         sub: 'Ligero · Económico · Duradero' },
]

export default function LaptopCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)

  const visible = 3
  const total = SLIDES.length

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total)
    }, 3500)
    return () => clearInterval(intervalRef.current)
  }, [paused, total])

  const goTo = (i) => { setCurrent(i); setPaused(true); setTimeout(() => setPaused(false), 5000) }
  const prev = () => goTo((current - 1 + total) % total)
  const next = () => goTo((current + 1) % total)

  // crear lista infinita rotada
  const rotated = [...SLIDES, ...SLIDES].slice(current, current + visible)

  return (
    <section className="carousel-section">
      <div className="container">
        <h2 className="carousel-title">
          🔥 Laptops <span className="text-gradient">Destacadas</span>
        </h2>

        <div
          className="carousel-track-wrap"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="carousel-track" style={{ transform: 'translateX(0)' }}>
            {rotated.map((slide, i) => (
              <div key={`${slide.label}-${i}`} className="carousel-slide">
                <img src={slide.img} alt={slide.label} loading="lazy" />
                <div className="carousel-slide-overlay">
                  <div className="carousel-slide-label">{slide.label}</div>
                  <div className="carousel-slide-sub">{slide.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="carousel-controls">
          <button className="carousel-btn" onClick={prev} aria-label="Anterior">‹</button>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
          <button className="carousel-btn" onClick={next} aria-label="Siguiente">›</button>
        </div>
      </div>
    </section>
  )
}
