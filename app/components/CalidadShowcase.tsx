'use client'

import { C } from './constants'
import { useBreakpoint } from '@/lib/hooks'

export function CalidadShowcase() {
  const { isMobile } = useBreakpoint()

  return (
    <section
      id="calidad"
      style={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '60vh' : '72vh',
        minHeight: isMobile ? '420px' : '520px',
        overflow: 'hidden',
        background: C.dark,
      }}
    >
      {/* Dark gradient fondo (se ve mientras carga el video) */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${C.blueDark} 0%, ${C.dark} 100%)`,
          zIndex: 0,
        }}
      />
      <video
        src="/showcase.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Gradient overlay para legibilidad */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: isMobile
            ? `linear-gradient(180deg, rgba(13,21,32,0.55) 0%, rgba(13,21,32,0.85) 100%)`
            : `linear-gradient(90deg, rgba(13,21,32,0.88) 0%, rgba(13,21,32,0.55) 45%, rgba(13,21,32,0.15) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Contenido */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: '1200px',
          height: '100%',
          margin: '0 auto',
          padding: isMobile ? '40px 20px' : '0 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ maxWidth: isMobile ? '100%' : '560px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase' as const, color: C.gold, marginBottom: '18px',
          }}>
            <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
            Producción propia
          </div>
          <h2 style={{
            fontFamily: 'DM Sans', fontWeight: 800,
            fontSize: isMobile ? '32px' : '52px',
            color: 'white',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            marginBottom: '18px',
          }}>
            Fórmulas que <span style={{ color: C.gold }}>fabricamos</span> en Tucumán
          </h2>
          <p style={{
            fontSize: isMobile ? '15px' : '17px',
            color: 'rgba(255,255,255,0.78)',
            lineHeight: 1.6,
            marginBottom: isMobile ? '24px' : '32px',
            maxWidth: '480px',
          }}>
            Fabricación propia. Precios mayoristas, stock disponible y envíos a todo el país.
          </p>
          <a
            href="#productos"
            className="qc-btn-gold"
            style={{
              display: 'inline-block',
              padding: '13px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.01em',
            }}
          >
            Conocé nuestra línea →
          </a>
        </div>
      </div>
    </section>
  )
}
