'use client'

import Image from 'next/image'
import { C } from './constants'
import { MoleculeCanvas, RevealText, WhatsAppIcon } from './ui'

export function Hero() {
  return (
    <>
      <section style={{ 
        height: '580px',           /* ← altura fija, la mitad aprox de 100vh */
        paddingTop: '68px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* 1️⃣ Imagen de fondo — next/image con fill */}
        <Image
          src="/hero-bg.jpg"
          alt="Fondo hero"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />

        {/* 2️⃣ Overlay — más suave para que el texto se vea */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(100deg, rgba(8,20,38,0.75) 0%, rgba(8,20,38,0.55) 55%, rgba(8,20,38,0.30) 100%)',
        }} />

        {/* 3️⃣ Partículas encima */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <MoleculeCanvas />
        </div>

        {/* 4️⃣ Contenido */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto', width: '100%',
          padding: '0 48px', position: 'relative', zIndex: 3,
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
            padding: '5px 14px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 600,
            color: 'white', letterSpacing: '0.07em',
            width: 'fit-content',
            opacity: 0, animation: 'fadeUp 0.5s ease 0.1s forwards',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.gold, display: 'inline-block', flexShrink: 0 }} />
            Distribuidora mayorista · Tucumán, Argentina
          </div>

          {/* Título — 3 líneas bien separadas */}
          <div style={{ opacity: 0, animation: 'fadeUp 0.6s ease 0.25s forwards' }}>
            <div style={{ fontSize: '22px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginBottom: '6px', letterSpacing: '0.01em' }}>
              Especialistas en
            </div>
            <div style={{
              fontSize: '52px', fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.025em', marginBottom: '6px',
              background: `linear-gradient(120deg, #f5c96a 0%, ${C.gold} 40%, #d46b1a 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Concentrados y Materias Primas
            </div>
            <div style={{ fontSize: '22px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.01em' }}>
              de calidad industrial
            </div>
          </div>

          {/* Subtítulo */}
          <p style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65,
            maxWidth: '480px', margin: 0,
            opacity: 0, animation: 'fadeUp 0.6s ease 0.45s forwards',
          }}>
            Proveemos insumos a empresas, laboratorios e industrias con más de 20 años de trayectoria y stock permanente.
          </p>

          {/* Botones + PDF en una fila */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
            opacity: 0, animation: 'fadeUp 0.6s ease 0.6s forwards',
          }}>
            <a href="#productos" style={{ textDecoration: 'none' }}>
              <button style={{
                background: C.gold, color: 'white', border: 'none',
                padding: '12px 28px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 4px 16px rgba(231,167,63,0.45)',
              }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.goldDark; b.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = C.gold; b.style.transform = 'translateY(0)' }}
              >Ver catálogo →</button>
            </a>

            <a href="https://wa.me/543813046228" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'rgba(255,255,255,0.1)', color: 'white',
                border: '1.5px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
                padding: '10px 24px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.25s',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.18)' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.1)' }}
              >
                <WhatsAppIcon size={16} color="white" />
                WhatsApp
              </button>
            </a>

            {/* Separador */}
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.2)' }} />

            {/* PDF */}
            <a href="/lista-precios.pdf" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent', color: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '10px 20px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '13px',
                cursor: 'pointer', transition: 'all 0.25s',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backdropFilter: 'blur(6px)',
              }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = 'white'; b.style.borderColor = 'rgba(255,255,255,0.45)'; b.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = 'rgba(255,255,255,0.75)'; b.style.borderColor = 'rgba(255,255,255,0.2)'; b.style.background = 'transparent' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <polyline points="9 14 12 17 15 14" />
                </svg>
                Lista de precios (PDF)
              </button>
            </a>
          </div>

          {/* Mini stats */}
          <div style={{
            display: 'flex', gap: '32px', flexWrap: 'wrap',
            opacity: 0, animation: 'fadeUp 0.6s ease 0.75s forwards',
          }}>
            {[
              { value: '20+', label: 'años de exp.' },
              { value: '300+', label: 'productos' },
              { value: '500+', label: 'clientes' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: C.gold, letterSpacing: '-0.02em' }}>{s.value}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Flecha scroll */}
        <div style={{
          position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 3, opacity: 0, animation: 'fadeUp 0.5s ease 1s forwards',
        }}>
          <a href="#productos" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: 'arrowBounce 2s ease-in-out infinite' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>

      </section>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
      `}</style>
    </>
  )
}