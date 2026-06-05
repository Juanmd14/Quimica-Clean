'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { C } from './constants'
import { useBreakpoint } from '@/lib/hooks'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    let raf = 0
    const fn = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 60
        setScrolled(isScrolled)
        if (isScrolled) setMenuOpen(false)
        raf = 0
      })
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => {
      window.removeEventListener('scroll', fn)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

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
        height: isMobile ? '60px' : '68px', padding: '0 24px',
        background: scrolled || menuOpen ? 'rgba(255,255,255,0.97)' : C.white,
        borderBottom: `1px solid ${C.border}`,
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : '0 2px 20px rgba(0,0,0,0)',
        transition: 'background 0.35s, backdrop-filter 0.35s, box-shadow 0.35s',
        willChange: 'box-shadow, backdrop-filter',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }} aria-label="Ir al inicio">
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
            <span style={{ fontWeight: 800, fontSize: '15px', color: C.blue, letterSpacing: '-0.01em' }}>
              QUÍMICA <span style={{ color: C.gold }}>CLEAN</span>
            </span>
          )}
        </Link>

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
                  className="qc-nav-link"
                  style={{
                    fontSize: '14px', fontWeight: 500,
                    padding: '7px 18px', borderRadius: '8px',
                  }}
                >{label}</a>
              ))}
            </div>

            <a href="#contacto" style={{ textDecoration: 'none' }}>
              <button className="qc-btn-gold" style={{
                padding: '10px 22px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px',
              }}>Consultar ahora</button>
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
              transition: 'transform 0.3s, opacity 0.3s',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: C.text, borderRadius: '2px',
              transition: 'transform 0.3s, opacity 0.3s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: C.text, borderRadius: '2px',
              transition: 'transform 0.3s, opacity 0.3s',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }} />
          </button>
        )}
      </nav>

      {/* Mobile menu desplegable */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99,
          background: 'rgba(255,255,255,0.98)',
          borderBottom: `1px solid ${C.border}`,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          padding: '20px 24px 28px',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-6px)',
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={handleNavClick}
                className="qc-nav-link-mobile"
                style={{
                  fontSize: '16px', fontWeight: 600,
                  padding: '12px 16px', borderRadius: '10px',
                  display: 'block',
                }}
              >{label}</a>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '8px', paddingTop: '16px' }}>
              <a href="#contacto" onClick={handleNavClick} style={{ textDecoration: 'none', display: 'block' }}>
                <button className="qc-btn-gold" style={{
                  width: '100%', padding: '13px', borderRadius: '10px',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '15px',
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