'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { C } from './constants'
import { MoleculeCanvas, WhatsAppIcon } from './ui'
import { useBreakpoint } from '@/lib/hooks'

type Slide = {
  bg: string
  bgPosition?: string
  bgPositionMobile?: string
  bgInsetMobile?: number
  eyebrow: string
  line1: string
  line2: string
  line3: string
  connector: boolean
  sub: ReactNode
}

const slides: Slide[] = [
  {
    bg: '/hero-1.jpg',
    bgPositionMobile: 'center',
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
    bgPositionMobile: '40% center',
    bgInsetMobile: 68,
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
    bgPosition: 'center 8%',
    bgPositionMobile: 'center',
    bgInsetMobile: 68,
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

  const goTo = (target: number, direction: 'left' | 'right' = 'left') => {
    if (animating) return
    setDir(direction)
    setAnimating(true)
    setTimeout(() => { setCurrent(target); setAnimating(false) }, 480)
  }

  const next = () => goTo((current + 1) % slides.length, 'left')
  const prev = () => goTo((current - 1 + slides.length) % slides.length, 'right')

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(prevAnim => {
        if (prevAnim) return prevAnim
        setDir('left')
        setTimeout(() => {
          setCurrent(c => (c + 1) % slides.length)
          setAnimating(false)
        }, 480)
        return true
      })
    }, 5000)
    timeoutRef.current = id
    return () => clearInterval(id)
  }, [])

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
        .hero-arrow-btn { transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease; }
        .hero-arrow-btn:hover { transform: translateY(-50%) scale(1.08) !important; }
        .hero-arrow-right:hover { background: ${C.goldDark} !important; box-shadow: 0 8px 28px rgba(231,167,63,0.55) !important; }
        .hero-arrow-left:hover { background: rgba(231,167,63,0.28) !important; border-color: ${C.gold} !important; }
      `}</style>

      <section style={{
        height: isMobile ? '520px' : '600px', paddingTop: '68px',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: '#0a1a3a',
      }}>

        {/* Fondo */}
        <div key={`bg-${current}`} style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0a1a3a', animation: 'bgFade 0.6s ease forwards' }}>
          <div style={{
            position: 'absolute',
            inset: isMobile && sl.bgInsetMobile ? `${sl.bgInsetMobile}px 0 0 0` : 0,
          }}>
            <Image
              src={sl.bg}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: isMobile
                  ? (sl.bgPositionMobile ?? 'center')
                  : (sl.bgPosition ?? 'center'),
              }}
            />
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(105deg, rgba(4,20,55,0.95) 0%, rgba(5,25,65,0.82) 55%, rgba(5,20,50,0.60) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}><MoleculeCanvas /></div>

        {/* Contenido animado */}
        <div
          key={`content-${current}`}
          style={{
            maxWidth: '1200px', margin: '0 auto', width: '100%',
            padding: isMobile ? '0 20px' : '0 48px',
            position: 'relative', zIndex: 3,
            display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '22px',
            animation: animating
              ? (dir === 'left' ? 'slideOutLeft 0.48s ease forwards' : 'slideOutRight 0.48s ease forwards')
              : (dir === 'left' ? 'slideInLeft 0.48s ease forwards' : 'slideInRight 0.48s ease forwards'),
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap' }}>
            <div style={{ width: isMobile ? '20px' : '40px', height: '2px', background: C.gold, flexShrink: 0 }} />
            <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 700, letterSpacing: isMobile ? '0.1em' : '0.16em', textTransform: 'uppercase' as const, color: C.gold }}>
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
              <button className="qc-btn-gold" style={{
                padding: '12px 28px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                boxShadow: '0 4px 20px rgba(231,167,63,0.4)',
              }}>Ver catálogo →</button>
            </a>
            <a href="https://wa.me/543813046228" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button className="qc-btn-ghost" style={{
                padding: '11px 24px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '14px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}>
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
                cursor: 'pointer', transition: 'width 0.35s ease, background 0.35s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Flecha derecha */}
        <button
          onClick={next}
          type="button"
          aria-label="Siguiente slide"
          className="hero-arrow-btn hero-arrow-right"
          style={{
            position: 'absolute',
            right: isMobile ? '16px' : '32px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 4, background: C.gold, border: 'none', borderRadius: '50%',
            width: isMobile ? '42px' : '48px', height: isMobile ? '42px' : '48px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(231,167,63,0.45)',
          }}
        >
          <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Flecha izquierda */}
        <button
          onClick={prev}
          type="button"
          aria-label="Slide anterior"
          className="hero-arrow-btn hero-arrow-left"
          style={{
            position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 4,
            background: 'rgba(231,167,63,0.18)',
            border: `1.5px solid rgba(231,167,63,0.55)`,
            borderRadius: '50%',
            width: '48px', height: '48px', cursor: 'pointer',
            display: isMobile ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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