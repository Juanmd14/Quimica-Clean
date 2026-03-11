'use client'

import { useState } from 'react'
import Image from 'next/image'
import { C } from './constants'
import { GlowCard, WhatsAppIcon } from './ui'

// ─── SVG icons para "Por qué elegirnos" ──────────────────────────────────────
function IconCertified() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}
function IconTruck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}
function IconHandshake() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l1.06 1.06L12 21.23l7.77-7.77 1.06-1.06a5.4 5.4 0 000-7.65v0z" />
    </svg>
  )
}
function IconFlask() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6m-5 0v6l-5 9a2 2 0 001.73 3h10.54A2 2 0 0018 18L13 9V3" />
      <line x1="6.5" y1="14" x2="17.5" y2="14" />
    </svg>
  )
}

const reasons = [
  { Icon: IconCertified, title: 'Calidad certificada', desc: 'Productos con certificación y fichas técnicas disponibles para cada insumo.', color: C.gold, bg: C.goldLight },
  { Icon: IconTruck, title: 'Distribución nacional', desc: 'Envíos a todo Argentina. Stock permanente para pedidos urgentes sin demoras.', color: C.blue, bg: C.blueLight },
  { Icon: IconHandshake, title: 'Atención mayorista', desc: 'Precios especiales para revendedores, industrias y compras en volumen.', color: C.gold, bg: C.goldLight },
  { Icon: IconFlask, title: 'Asesoramiento técnico', desc: 'Te orientamos en la elección del producto adecuado para cada proceso.', color: C.blue, bg: C.blueLight },
]

// ─── WhyUs ────────────────────────────────────────────────────────────────────
export function WhyUs() {
  return (
    <section id="nosotros" style={{
      padding: '96px 48px',
      background: `linear-gradient(160deg, ${C.blueLight} 0%, ${C.white} 55%)`,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, color: C.blue, marginBottom: '14px', justifyContent: 'center',
          }}>
            <span style={{ width: '24px', height: '2px', background: C.blue, display: 'inline-block' }} />
            Por qué elegirnos
            <span style={{ width: '24px', height: '2px', background: C.blue, display: 'inline-block' }} />
          </div>
          <h2 style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: '34px', color: C.text, letterSpacing: '-0.02em' }}>
            Calidad que respalda cada entrega
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }} className="reasons-grid">
          {reasons.map(({ Icon, title, desc, color, bg }, i) => (
            <GlowCard key={i} style={{ padding: '32px' }} glowColor={color}>
              {/* Reemplazá el SVG con <Image src={`/icons/${i}.png`} ... /> cuando tengas imágenes */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px', background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px',
              }}>
                <Icon />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: C.text, marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: C.textMid, lineHeight: 1.7 }}>{desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function Contact() {
  const [formData, setFormData] = useState({ nombre: '', telefono: '', producto_interes: '', mensaje: '' })
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.telefono) return
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) { setStatus('success'); setFormData({ nombre: '', telefono: '', producto_interes: '', mensaje: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)', color: 'white',
    padding: '10px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
    outline: 'none', borderRadius: '8px', transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <section id="contacto" style={{ padding: '0', background: C.white }}>

      {/* Banner naranja */}
      <div style={{
        background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
        padding: '56px 48px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.75)', marginBottom: '12px' }}>
            — Contacto —
          </div>
          <h2 style={{ fontWeight: 700, fontSize: '38px', color: 'white', lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.02em' }}>
            ¿Necesitás un producto?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65 }}>
            Completá el formulario y te respondemos en menos de 24 horas hábiles.
          </p>
        </div>
      </div>

      {/* Cuerpo oscuro */}
      <div style={{ background: C.text, padding: '56px 48px' }}>
        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '48px', alignItems: 'stretch',
        }} className="contact-grid">

          {/* Columna izquierda — info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '18px', color: 'white', marginBottom: '6px' }}>Hablemos directamente</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
                Somos una empresa con trato personalizado. Nuestro equipo responde rápido y te asesora sin compromiso.
              </p>
            </div>

            {/* Datos de contacto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  icon: <WhatsAppIcon size={20} color="#25D366" />,
                  label: 'WhatsApp', value: '+54 9 381 304-6228',
                  bg: 'rgba(37,211,102,0.1)', border: 'rgba(37,211,102,0.2)',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: 'Email', value: 'admquimicaclean@gmail.com',
                  bg: 'rgba(231,167,63,0.1)', border: 'rgba(231,167,63,0.2)',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  label: 'Ubicación', value: 'San Miguel de Tucumán, Argentina',
                  bg: 'rgba(43,123,184,0.1)', border: 'rgba(43,123,184,0.2)',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  label: 'Horario', value: 'Lun–Vie 8:00–13:30 y 14:30–18:00\nSáb 8:00–13:00',
                  bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)',
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                    background: item.bg, border: `1px solid ${item.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: '2px',
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '1px' }}>{item.label}</div>
                    {item.value.split('\n').map((line, j) => (
                      <div key={j} style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <a href="https://wa.me/543813046228" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{
                width: '100%', background: '#25D366', color: 'white', border: 'none',
                padding: '13px 24px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.25s', boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
              }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#1da851'; b.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#25D366'; b.style.transform = 'translateY(0)' }}
              >
                <WhatsAppIcon size={18} color="white" />
                Escribir por WhatsApp
              </button>
            </a>
          </div>

          {/* Columna derecha — formulario */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
            padding: '32px', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', gap: '16px',
            height: 'fit-content',
          }}>
            <div style={{ marginBottom: '4px' }}>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'white', marginBottom: '2px' }}>Envianos tu consulta</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Te respondemos en menos de 24hs hábiles</div>
            </div>

            <input
              style={inputStyle} placeholder="Nombre y apellido *"
              value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231,167,63,0.15)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <input
              style={inputStyle} placeholder="Teléfono *"
              value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })}
              onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231,167,63,0.15)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <input
              style={inputStyle} placeholder="Producto de interés"
              value={formData.producto_interes} onChange={e => setFormData({ ...formData, producto_interes: e.target.value })}
              onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231,167,63,0.15)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <textarea
              style={{ ...inputStyle, resize: 'vertical' }} placeholder="Mensaje o consulta" rows={3}
              value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
              onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231,167,63,0.15)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
            />

            <button
              onClick={handleSubmit} disabled={status === 'loading'}
              style={{
                width: '100%', padding: '11px', background: C.gold, color: 'white',
                border: 'none', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600, fontSize: '14px', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1, transition: 'all 0.25s',
              }}
              onMouseEnter={e => { if (status !== 'loading') { (e.currentTarget as HTMLButtonElement).style.background = C.goldDark; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.gold; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar consulta →'}
            </button>

            {status === 'success' && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', padding: '13px 16px', fontSize: '14px', color: '#4ade80', fontWeight: 500 }}>
                ✅ ¡Consulta enviada! Te contactamos pronto.
              </div>
            )}
            {status === 'error' && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '13px 16px', fontSize: '14px', color: '#f87171', fontWeight: 500 }}>
                ❌ Error al enviar. Intentá por WhatsApp.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ background: C.dark, borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Top */}
      <div style={{ padding: '60px 48px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px' }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
                <Image src="/logo_qm.jpg" alt="Quimica Clean" width={38} height={38} style={{ objectFit: 'contain' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '16px', color: 'white' }}>
                QUÍMICA <span style={{ color: C.gold }}>CLEAN</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, maxWidth: '260px', marginBottom: '24px' }}>
              Distribuidora mayorista de concentrados y materias primas para industrias y laboratorios de todo el país.
            </p>
            <a href="https://wa.me/543813046228" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
              color: '#4ade80', padding: '8px 16px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.2)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.1)'}
            >
              <WhatsAppIcon size={16} color="#4ade80" />
              +54 9 381 304-6228
            </a>
          </div>

          {/* Productos */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: '20px' }}>Productos</div>
            {['Materias Primas', 'Solventes', 'Concentrados', 'Jabones', 'Contenedores', 'Higiene'].map(p => (
              <a key={p} href="#productos" style={{ display: 'block', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '13px', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >{p}</a>
            ))}
          </div>

          {/* Empresa */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: C.blue, textTransform: 'uppercase' as const, marginBottom: '20px' }}>Empresa</div>
            {['Nosotros', 'Calidad', 'Distribución', 'Contacto'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ display: 'block', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '13px', marginBottom: '10px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >{l}</a>
            ))}
          </div>

          {/* Contacto */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: C.blue, textTransform: 'uppercase' as const, marginBottom: '20px' }}>Contacto</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.9 }}>
              <div>admquimicaclean@gmail.com</div>
              <div>Tucumán, Argentina</div>
              <div style={{ marginTop: '4px', fontSize: '11px' }}>Lun–Vie: 8:00–13:30 y 14:30–18:00</div>
              <div style={{ fontSize: '11px' }}>Sáb: 8:00–13:00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
      }}>

        {/* izquierda (vacío o algo futuro) */}
        <div style={{ flex: 1 }} />

        {/* centro */}
        <div style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.25)'
        }}>
          © 2026 Química Clean · Tucumán, Argentina. Todos los derechos reservados.
        </div>

        {/* derecha */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '6px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e'
          }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            Sistema operativo
          </span>
        </div>

      </div>
    </footer>
  )
}