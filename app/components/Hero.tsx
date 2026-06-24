'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { C } from './constants'
import { MoleculeCanvas } from './ui'
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
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const { isMobile } = useBreakpoint()

  const goTo = (target: number, direction: 'left' | 'right' = 'left') => {
    if (animating || target === current) return
    setDir(direction)
    setAnimating(true)
    setTimeout(() => { setCurrent(target); setAnimating(false) }, 480)
  }

  const next = () => goTo((current + 1) % slides.length, 'left')
  const prev = () => goTo((current - 1 + slides.length) % slides.length, 'right')

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Autoplay (paused on hover/focus, on user toggle, on reduce-motion)
  useEffect(() => {
    if (paused || reduceMotion) return
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
    return () => clearInterval(id)
  }, [paused, reduceMotion])

  // Touch swipe (mobile)
  const touchStartX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 50) return
    if (dx < 0) next(); else prev()
  }

  const sl = slides[current]
  const animState = animating
    ? `out-${dir}`
    : `in-${dir}`

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Slides destacados"
      style={{
        height: isMobile ? '520px' : '600px',
        paddingTop: isMobile ? '60px' : '68px',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: '#0a1a3a',
      }}>

      {/* Fondos apilados (sin unmount, opacity-cross-fade) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0a1a3a' }}>
        {slides.map((s, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: isMobile && s.bgInsetMobile ? `${s.bgInsetMobile}px 0 0 0` : 0,
              opacity: current === i ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            <Image
              src={s.bg}
              alt=""
              aria-hidden="true"
              fill
              priority={i === 0}
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: isMobile
                  ? (s.bgPositionMobile ?? 'center')
                  : (s.bgPosition ?? 'center'),
              }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(105deg, rgba(4,20,55,0.95) 0%, rgba(5,25,65,0.82) 55%, rgba(5,20,50,0.60) 100%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2 }}><MoleculeCanvas /></div>

      {/* Contenido animado (sin key cycle, anima por data-attribute) */}
      <div
        className="hero-content"
        data-anim={reduceMotion ? undefined : animState}
        aria-live="polite"
        aria-atomic="true"
        style={{
          maxWidth: '1200px', margin: '0 auto', width: '100%',
          padding: isMobile ? '0 76px 0 20px' : '0 48px',
          position: 'relative', zIndex: 3,
          display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '22px',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap' }}>
          <div aria-hidden="true" style={{ width: isMobile ? '20px' : '40px', height: '2px', background: C.gold, flexShrink: 0 }} />
          <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 700, letterSpacing: isMobile ? '0.1em' : '0.16em', textTransform: 'uppercase' as const, color: C.gold }}>
            {sl.eyebrow}
          </span>
        </div>

        {/* Título — h1 semántico */}
        <h1 style={{ margin: 0, fontWeight: 'inherit' }}>
          <span style={{ display: 'block', fontSize: 'clamp(18px, 2.8vw, 32px)', fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.02em', marginBottom: isMobile ? '6px' : '8px' }}>
            {sl.line1}
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: isMobile ? '8px' : '14px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(28px, 7.5vw, 68px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {sl.line2}
            </span>
            {sl.connector && (
              <span aria-hidden="true" style={{
                fontSize: 'clamp(22px, 5.5vw, 50px)',
                fontWeight: 500,
                color: C.gold,
                opacity: 0.9,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                display: 'inline-block',
                verticalAlign: 'baseline',
              }}>y</span>
            )}
          </span>
          <span style={{
            display: 'block',
            fontSize: 'clamp(28px, 7.5vw, 68px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1,
            color: 'transparent',
            backgroundImage: `linear-gradient(180deg, ${C.gold} 0%, #f3c266 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            marginBottom: '8px',
          }}>
            {sl.line3}
          </span>
        </h1>

        {/* Subtítulo */}
        <p style={{ fontSize: isMobile ? '13px' : '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, maxWidth: '460px', margin: 0 }}>
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
        </div>

        {/* Dots: ahora botones con hit area 44x44 */}
        <div role="tablist" aria-label="Ir a slide" style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              type="button"
              aria-selected={current === i}
              aria-label={`Slide ${i + 1} de ${slides.length}`}
              onClick={() => goTo(i, i > current ? 'left' : 'right')}
              style={{
                width: '36px', height: '36px',
                padding: 0, margin: 0,
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span aria-hidden="true" style={{
                display: 'block',
                width: current === i ? '24px' : '8px', height: '8px', borderRadius: '4px',
                background: current === i ? C.gold : 'rgba(255,255,255,0.45)',
                transition: 'width 0.35s ease, background 0.35s ease',
              }} />
            </button>
          ))}
          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => setPaused(p => !p)}
            aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'}
            aria-pressed={paused}
            style={{
              marginLeft: '8px',
              width: '36px', height: '36px',
              padding: 0,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {paused ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
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
          width: isMobile ? '44px' : '48px', height: isMobile ? '44px' : '48px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(231,167,63,0.45)',
        }}
      >
        <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Flecha abajo */}
      <div className="hero-arrow-down" style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
        <a href="#productos" aria-label="Ir a productos" style={{ textDecoration: 'none', display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </div>

    </section>
  )
}
