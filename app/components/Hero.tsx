'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { C } from './constants'
import { MoleculeCanvas, WhatsAppIcon } from './ui'
import { useBreakpoint } from '@/lib/hooks'

const slides = [
  {
    bg: '/hero-1.jpg',
    eyebrow: 'Distribuidora mayorista · Tucumán, Argentina',
    line1: 'Especialistas en',
    line2: 'CONCENTRADOS',
    line3: 'MATERIAS PRIMAS',
    connector: true,
    sub: <>
      <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
        Emprendé tu negocio de limpieza con nosotros.
      </span>
      {' '}Te proveemos productos listos y concentrados de calidad para tu propio negocio.
    </>,
  },
  {
    bg: '/hero-2.jpg',
    eyebrow: 'Envíos a todo el país · Tucumán, Argentina',
    line1: 'Llegamos a',
    line2: 'TODO EL',
    line3: 'PAÍS',
    connector: false,
    sub: <>
      <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
        Despacho inmediato a cualquier provincia.
      </span>
      {' '}Trabajamos con transportistas de confianza o coordinamos
      con el tuyo.
    </>,
  },
  {
    bg: '/hero-3.jpg',
    eyebrow: 'Para fabricantes · Tucumán, Argentina',
    line1: 'Materia prima',
    line2: 'DE CALIDAD',
    line3: 'INDUSTRIAL',
    connector: false,
    sub: <>
      <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
        Todo lo que necesitás para fabricar.
      </span>
      {' '}precios mayoristas y asesoramiento técnico incluido.
    </>,
  },
]

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState<'left' | 'right'>('left')
  const [animating, setAnimating] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { isMobile } = useBreakpoint()

  const goTo = (next: number, direction: 'left' | 'right' = 'left') => {
    if (animating) return
    setDir(direction)
    setAnimating(true)
    setTimeout(() => { setCurrent(next); setAnimating(false) }, 480)
  }

  const next = () => goTo((current + 1) % slides.length, 'left')
  const prev = () => goTo((current - 1 + slides.length) % slides.length, 'right')

  useEffect(() => {
    timeoutRef.current = setInterval(next, 5000)
    return () => { if (timeoutRef.current) clearInterval(timeoutRef.current) }
  }, [current, animating])

  const sl = slides[current]

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(80px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-80px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-80px); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(80px); }
        }
        @keyframes bgFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .hero-arrow-btn { transition: transform 0.2s ease, background 0.2s ease; }
        .hero-arrow-btn:hover { transform: translateY(-50%) scale(1.1) !important; background: ${C.goldDark} !important; }
      `}</style>

      <section style={{
        height: '600px', paddingTop: '68px',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Fondo */}
        <div key={`bg-${current}`} style={{ position: 'absolute', inset: 0, zIndex: 0, animation: 'bgFade 0.6s ease forwards' }}>
          <Image src={sl.bg} alt="" aria-hidden="true" fill priority style={{ objectFit: 'cover', objectPosition: 'center', }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(105deg, rgba(4,20,55,0.95) 0%, rgba(5,25,65,0.82) 55%, rgba(5,20,50,0.60) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}><MoleculeCanvas /></div>

        {/* Contenido animado */}
        <div
          key={`content-${current}`}
          style={{
            maxWidth: '1200px', margin: '0 auto', width: '100%',
            padding: '0 48px', position: 'relative', zIndex: 3,
            display: 'flex', flexDirection: 'column', gap: '22px',
            animation: animating
              ? (dir === 'left' ? 'slideOutLeft 0.48s ease forwards' : 'slideOutRight 0.48s ease forwards')
              : (dir === 'left' ? 'slideInLeft 0.48s ease forwards' : 'slideInRight 0.48s ease forwards'),
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '2px', background: C.gold }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: C.gold }}>
              {sl.eyebrow}
            </span>
          </div>

          {/* Título */}
          <div>
            <div style={{ fontSize: 'clamp(20px, 2.8vw, 32px)', fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.02em', marginBottom: '8px' }}>
              {sl.line1}
            </div>
            <div style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 0.95, marginBottom: '4px' }}>
              {sl.line2}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
              {sl.connector && (
                <span style={{ fontSize: 'clamp(20px, 2.8vw, 32px)', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>y</span>
              )}
              <span style={{
                fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 900,
                letterSpacing: '-0.03em', lineHeight: 0.95,
                ...(isMobile
                  ? { color: C.gold }
                  : { WebkitTextStroke: `2px ${C.gold}`, color: 'transparent' }
                ),
              }}>
                {sl.line3}
              </span>
            </div>
          </div>

          {/* Subtítulo */}
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '460px', margin: 0 }}>
            {sl.sub}
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#productos" style={{ textDecoration: 'none' }}>
              <button style={{
                background: C.gold, color: 'white', border: 'none',
                padding: '12px 28px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 4px 20px rgba(231,167,63,0.4)',
              }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.goldDark; b.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.gold; b.style.transform = 'translateY(0)' }}
              >Ver catálogo →</button>
            </a>
            <a href="https://wa.me/543813046228" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent', color: 'white',
                border: '1.5px solid rgba(255,255,255,0.28)',
                padding: '11px 24px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.25s',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'rgba(255,255,255,0.5)'; b.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'rgba(255,255,255,0.28)'; b.style.background = 'transparent' }}
              >
                <WhatsAppIcon size={16} color="white" />
                WhatsApp
              </button>
            </a>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => goTo(i, i > current ? 'left' : 'right')} style={{
                width: current === i ? '24px' : '8px', height: '8px', borderRadius: '4px',
                background: current === i ? C.gold : 'rgba(255,255,255,0.3)',
                cursor: 'pointer', transition: 'all 0.35s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Flecha derecha */}
        <button onClick={next} className="hero-arrow-btn" style={{
          position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 4, background: C.gold, border: 'none', borderRadius: '50%',
          width: '56px', height: '56px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(231,167,63,0.45)',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Flecha izquierda */}
        <button onClick={prev} className="hero-arrow-btn" style={{
          position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 4, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)',
          borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Flecha abajo */}
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
          <a href="#productos" style={{ textDecoration: 'none', display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'arrowBounce 2s ease-in-out infinite' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>

      </section>
    </>
  )
}