'use client'

import Image from 'next/image'
import { C } from './constants'
import { MoleculeCanvas, WhatsAppIcon } from './ui'

export function Hero() {
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
        @keyframes lineGrow {
          from { width: 0; opacity: 0; }
          to   { width: 40px; opacity: 1; }
        }
      `}</style>

      <section style={{
        height: '600px', paddingTop: '68px',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <Image src="/hero-bg.jpg" alt="Fondo hero" fill priority style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(105deg, rgba(5,15,30,0.96) 0%, rgba(5,15,30,0.86) 55%, rgba(5,15,30,0.65) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}><MoleculeCanvas /></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 48px', position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* Eyebrow */}
          <div style={{ animation: 'fadeUp 0.5s ease 0.1s both', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '2px', background: C.gold, animation: 'lineGrow 0.6s ease 0.3s both' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: C.gold }}>
              Distribuidora mayorista · Tucumán, Argentina
            </span>
          </div>

          {/* Título en capas */}
          <div style={{ animation: 'fadeUp 0.65s ease 0.3s both' }}>

            {/* "Especialistas en" — ahora más grande y visible */}
            <div style={{
              fontSize: 'clamp(20px, 2.8vw, 32px)',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.02em',
              marginBottom: '8px',
            }}>
              Especialistas en
            </div>

            {/* "CONCENTRADOS" — sólido blanco */}
            <div style={{
              fontSize: 'clamp(40px, 6vw, 68px)',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              marginBottom: '4px',
            }}>
              CONCENTRADOS
            </div>

            {/* "y MATERIAS PRIMAS" — outline dorado */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: 'clamp(20px, 2.8vw, 32px)', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>y</span>
              <span style={{
                fontSize: 'clamp(40px, 6vw, 68px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
                WebkitTextStroke: `2px ${C.gold}`,
                color: 'transparent',
              }}>
                MATERIAS PRIMAS
              </span>
            </div>

            {/* "de calidad industrial" — mismo peso y tamaño que "Especialistas en" */}
            <div style={{
              fontSize: 'clamp(20px, 2.8vw, 32px)',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.02em',
            }}>
              de calidad industrial
            </div>
          </div>

          {/* Subtítulo */}
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '460px', margin: 0, animation: 'fadeUp 0.6s ease 0.5s both' }}>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Fabricantes de productos y materias primas.</span>{' '}
            Proveemos insumos a empresas, laboratorios e industrias con stock permanente.
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', animation: 'fadeUp 0.6s ease 0.65s both' }}>
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

        </div>

        {/* Flecha */}
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 3, animation: 'fadeUp 0.5s ease 1s both' }}>
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