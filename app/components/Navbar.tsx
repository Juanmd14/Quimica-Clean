'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { C } from './constants'

function useBreakpoint() {
  const [width, setWidth] = useState(1200)
  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return { isMobile: width < 768 }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Cerrar menu al hacer scroll
  useEffect(() => {
    if (scrolled && menuOpen) setMenuOpen(false)
  }, [scrolled])

  const handleNavClick = () => setMenuOpen(false)

  const links = [
    { label: 'Productos', href: '#productos' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '68px', padding: '0 24px',
        background: scrolled || menuOpen ? 'rgba(255,255,255,0.97)' : C.white,
        borderBottom: `1px solid ${C.border}`,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
        transition: 'all 0.35s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }} aria-label="Ir al inicio">
          <Image
            src="/logo_qm.jpg"
            alt="Quimica Clean"
            width={46}
            height={46}
            style={{ objectFit: 'contain' }}
            priority
          />
          {/* Nombre visible solo en mobile */}
          {isMobile && (
            <span style={{ fontWeight: 800, fontSize: '15px', color: C.text, letterSpacing: '-0.01em' }}>
              QUÍMICA <span style={{ color: C.gold }}>CLEAN</span>
            </span>
          )}
        </a>

        {/* Desktop: links + CTA */}
        {!isMobile && (
          <>
            <div style={{
              display: 'flex', gap: '4px',
              background: C.offWhite, padding: '4px',
              borderRadius: '12px', border: `1px solid ${C.border}`,
            }}>
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    color: C.textMid, textDecoration: 'none',
                    fontSize: '14px', fontWeight: 500,
                    padding: '7px 18px', borderRadius: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = C.white
                    e.currentTarget.style.color = C.blue
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = C.textMid
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >{label}</a>
              ))}
            </div>

            <a href="#contacto" style={{ textDecoration: 'none' }}>
              <button style={{
                background: C.gold, color: 'white', border: 'none',
                padding: '10px 22px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.goldDark; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.gold; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
              >Consultar ahora</button>
            </a>
          </>
        )}

        {/* Mobile: botón hamburguesa */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', borderRadius: '8px',
              display: 'flex', flexDirection: 'column', gap: '5px',
              alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Abrir menú"
          >
            {/* 3 líneas animadas */}
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: C.text, borderRadius: '2px',
              transition: 'all 0.3s',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: C.text, borderRadius: '2px',
              transition: 'all 0.3s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: C.text, borderRadius: '2px',
              transition: 'all 0.3s',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }} />
          </button>
        )}
      </nav>

      {/* Mobile menu desplegable */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 99,
          background: 'rgba(255,255,255,0.98)',
          borderBottom: `1px solid ${C.border}`,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          padding: menuOpen ? '20px 24px 28px' : '0 24px',
          maxHeight: menuOpen ? '300px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, padding 0.35s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={handleNavClick}
                style={{
                  color: C.text, textDecoration: 'none',
                  fontSize: '16px', fontWeight: 600,
                  padding: '12px 16px', borderRadius: '10px',
                  transition: 'background 0.2s',
                  display: 'block',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >{label}</a>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '8px', paddingTop: '16px' }}>
              <a href="#contacto" onClick={handleNavClick} style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{
                  width: '100%', background: C.gold, color: 'white', border: 'none',
                  padding: '13px', borderRadius: '10px',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px',
                  cursor: 'pointer',
                }}>
                  Consultar ahora
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop para cerrar el menu */}
      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.2)' }}
        />
      )}
    </>
  )
}