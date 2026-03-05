'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { C } from './constants'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '68px', padding: '0 48px',
      background: scrolled ? 'rgba(255,255,255,0.97)' : C.white,
      borderBottom: `1px solid ${C.border}`,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
      transition: 'all 0.35s',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="/logo_qm.jpg"
          alt="Química Clean"
          width={52}
          height={52}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Links en pill container */}
      <div style={{
        display: 'flex', gap: '4px',
        background: C.offWhite, padding: '4px',
        borderRadius: '12px', border: `1px solid ${C.border}`,
      }}
        className="nav-links"
      >
        {[
          { label: 'Productos', href: '#productos' },
          { label: 'Nosotros', href: '#nosotros' },
          { label: 'Contacto', href: '#contacto' },
        ].map(({ label, href }) => (
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

      {/* CTA */}
      <a href="#contacto" style={{ textDecoration: 'none' }} className="nav-cta">
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
    </nav>
  )
}