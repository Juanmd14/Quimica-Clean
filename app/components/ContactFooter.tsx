'use client'

import { useState } from 'react'
import Image from 'next/image'
import { C } from './constants'
import { GlowCard, WhatsAppIcon } from './ui'
import { useBreakpoint } from '@/lib/hooks'

// ─── SVG icons ────────────────────────────────────────────────────────────────
function IconCertified({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}
function IconTruck({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}
function IconHandshake({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l1.06 1.06L12 21.23l7.77-7.77 1.06-1.06a5.4 5.4 0 000-7.65v0z" />
    </svg>
  )
}
function IconFlask({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const { isMobile } = useBreakpoint()

  return (
    <section id="nosotros" style={{
      padding: isMobile ? '56px 20px' : '96px 48px',
      background: `linear-gradient(160deg, ${C.blueLight} 0%, ${C.white} 55%)`,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '60px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, color: C.blue, marginBottom: '14px', justifyContent: 'center',
          }}>
            <span style={{ width: '24px', height: '2px', background: C.blue, display: 'inline-block' }} />
            Por qué elegirnos
            <span style={{ width: '24px', height: '2px', background: C.blue, display: 'inline-block' }} />
          </div>
          <h2 style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: isMobile ? '26px' : '34px', color: C.text, letterSpacing: '-0.02em' }}>
            Calidad que respalda cada entrega
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '12px' : '20px',
        }}>
          {reasons.map(({ Icon, title, desc, color, bg }, i) => (
            <GlowCard key={i} style={{ padding: isMobile ? '22px 18px' : '32px' }} glowColor={color}>
              <div style={{
                width: isMobile ? '52px' : '60px', height: isMobile ? '52px' : '60px',
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${bg} 0%, ${C.white} 130%)`,
                border: `1px solid ${color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: isMobile ? '14px' : '18px',
              }}>
                <Icon size={isMobile ? 30 : 34} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '17px', color: C.text, marginBottom: '8px', lineHeight: 1.3 }}>{title}</h3>
              <p style={{ fontSize: isMobile ? '14px' : '13.5px', color: C.textMid, lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
type FormStatus = 'idle' | 'loading' | 'success' | 'error'
type FormError = { [key in keyof typeof initialFormData]?: string }

const initialFormData = { nombre: '', email: '', telefono: '', producto_interes: '', mensaje: '' }

export function Contact() {
  const { isMobile } = useBreakpoint()
  const [formData, setFormData] = useState(initialFormData)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<FormError>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  // Validaciones
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^[\d\s\+\-\(\)]{7,}$/
    return re.test(phone)
  }

  const validateForm = () => {
    const newErrors: FormError = {}
    
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido'
    else if (formData.nombre.trim().length < 3) newErrors.nombre = 'Mínimo 3 caracteres'
    
    if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono requerido'
    else if (!validatePhone(formData.telefono)) newErrors.telefono = 'Teléfono inválido'
    
    if (formData.email && !validateEmail(formData.email)) newErrors.email = 'Email inválido'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          email: formData.email.trim() || undefined,
          producto_interes: formData.producto_interes.trim(),
          mensaje: formData.mensaje.trim(),
        }),
      })
      
      if (res.ok) {
        setStatus('success')
        setFormData(initialFormData)
        setTouched({})
        setErrors({})
        // Auto-clear success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    // Validate single field
    const newErrors = { ...errors }
    
    if (field === 'nombre') {
      if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido'
      else if (formData.nombre.trim().length < 3) newErrors.nombre = 'Mínimo 3 caracteres'
      else delete newErrors.nombre
    } else if (field === 'telefono') {
      if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono requerido'
      else if (!validatePhone(formData.telefono)) newErrors.telefono = 'Teléfono inválido'
      else delete newErrors.telefono
    } else if (field === 'email') {
      if (formData.email && !validateEmail(formData.email)) newErrors.email = 'Email inválido'
      else delete newErrors.email
    }
    setErrors(newErrors)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)', color: 'white',
    padding: '10px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
    outline: 'none', borderRadius: '8px', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
  }

  const getInputStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: errors[field as keyof FormError] && touched[field] ? '#f87171' : inputStyle.borderColor,
  })

  return (
    <section id="contacto" style={{ padding: '0', background: C.white }}>

      {/* Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
        padding: isMobile ? '40px 20px' : '56px 48px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.75)', marginBottom: '12px' }}>
            — Contacto —
          </div>
          <h2 style={{ fontWeight: 700, fontSize: isMobile ? '28px' : '38px', color: 'white', lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.02em' }}>
            ¿Necesitás un producto?
          </h2>
          <p style={{ fontSize: isMobile ? '14px' : '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65 }}>
            Completá el formulario y te respondemos en menos de 24 horas hábiles.
          </p>
        </div>
      </div>

      {/* Cuerpo */}
      <div style={{ background: C.text, padding: isMobile ? '40px 20px' : '56px 48px' }}>
        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.25fr 1fr',
          gap: isMobile ? '32px' : '48px',
          alignItems: 'stretch',
        }}>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '18px', color: 'white', marginBottom: '6px' }}>Hablemos directamente</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
                Somos una empresa con trato personalizado. Nuestro equipo responde rápido y te asesora sin compromiso.
              </p>
            </div>

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
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '1px' }}>{item.label}</div>
                    {item.value.split('\n').map((line, j) => (
                      <div key={j} style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <a href="https://wa.me/543813046228" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
              <button className="qc-btn-wa" style={{
                width: '100%', padding: '13px 24px', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <WhatsAppIcon size={18} color="white" />
                Escribir por WhatsApp
              </button>
            </a>
          </div>

          {/* Formulario */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
            padding: isMobile ? '24px 20px' : '32px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            <div style={{ marginBottom: '4px' }}>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'white', marginBottom: '2px' }}>Envianos tu consulta</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Te respondemos en menos de 24hs hábiles</div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Nombre */}
              <div>
                <input
                  type="text"
                  placeholder="Nombre y apellido *"
                  maxLength={50}
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  onBlur={() => handleFieldBlur('nombre')}
                  onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231,167,63,0.15)' }}
                  onBlurCapture={e => { e.currentTarget.style.borderColor = errors.nombre && touched.nombre ? '#f87171' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                  style={getInputStyle('nombre')}
                />
                {errors.nombre && touched.nombre && (
                  <div style={{ fontSize: '11px', color: '#f87171', marginTop: '4px', fontWeight: 500 }}>⚠️ {errors.nombre}</div>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <input
                  type="tel"
                  placeholder="Teléfono *"
                  maxLength={20}
                  value={formData.telefono}
                  onChange={e => setFormData({ ...formData, telefono: e.target.value.replace(/[^\d\s\+\-\(\)]/g, '') })}
                  onBlur={() => handleFieldBlur('telefono')}
                  onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231,167,63,0.15)' }}
                  onBlurCapture={e => { e.currentTarget.style.borderColor = errors.telefono && touched.telefono ? '#f87171' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                  style={getInputStyle('telefono')}
                />
                {errors.telefono && touched.telefono && (
                  <div style={{ fontSize: '11px', color: '#f87171', marginTop: '4px', fontWeight: 500 }}>⚠️ {errors.telefono}</div>
                )}
              </div>

              {/* Producto de interés */}
              <input
                type="text"
                placeholder="Producto de interés"
                maxLength={50}
                value={formData.producto_interes}
                onChange={e => setFormData({ ...formData, producto_interes: e.target.value })}
                onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231,167,63,0.15)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                style={inputStyle}
              />

              {/* Mensaje */}
              <textarea
                placeholder="Mensaje o consulta"
                rows={3}
                maxLength={300}
                value={formData.mensaje}
                onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                onFocus={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(231,167,63,0.15)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                style={{ ...inputStyle, resize: 'none' }}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="qc-btn-gold"
                style={{
                  width: '100%', padding: '11px', borderRadius: '8px',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                }}
              >
                {status === 'loading' ? '⏳ Enviando...' : '✓ Enviar consulta'}
              </button>
            </form>

            {/* Messages */}
            {status === 'success' && (
              <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '8px', padding: '13px 16px', fontSize: '13px', color: '#86efac', fontWeight: 600, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>✅</span> ¡Consulta enviada exitosamente! Nos pondremos en contacto pronto.
              </div>
            )}
            {status === 'error' && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '13px 16px', fontSize: '13px', color: '#fca5a5', fontWeight: 600, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>❌</span> Error al enviar. Intentá por WhatsApp o email.
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
  const { isMobile } = useBreakpoint()

  return (
    <footer style={{ background: C.dark, borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      <div style={{ padding: isMobile ? '40px 20px 32px' : '60px 48px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1.5fr',
          gap: isMobile ? '32px 20px' : '40px',
        }}>

          {/* Brand — ocupa 2 columnas en mobile */}
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', background: 'white', flexShrink: 0 }}>
                <Image src="/logo_qm.jpg" alt="Quimica Clean" width={36} height={36} style={{ objectFit: 'contain' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'white' }}>
                QUÍMICA <span style={{ color: C.gold }}>CLEAN</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, maxWidth: '280px', marginBottom: '20px' }}>
              Distribuidora mayorista de concentrados y materias primas para industrias y laboratorios de todo el país.
            </p>
            <a href="https://wa.me/543813046228" target="_blank" rel="noreferrer" className="qc-btn-wa-soft" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            }}>
              <WhatsAppIcon size={16} color="#4ade80" />
              +54 9 381 304-6228
            </a>
          </div>

          {/* Productos */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: C.gold, textTransform: 'uppercase' as const, marginBottom: '16px' }}>Productos</div>
            {['Materias Primas', 'Solventes', 'Concentrados', 'Jabones', 'Contenedores', 'Higiene'].map(p => (
              <a key={p} href="#productos" className="qc-link-fade" style={{ display: 'block', textDecoration: 'none', fontSize: '13px', marginBottom: '9px' }}>{p}</a>
            ))}
          </div>

          {/* Empresa */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: C.blue, textTransform: 'uppercase' as const, marginBottom: '16px' }}>Empresa</div>
            {['Nosotros', 'Calidad', 'Distribución', 'Contacto'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="qc-link-fade" style={{ display: 'block', textDecoration: 'none', fontSize: '13px', marginBottom: '9px' }}>{l}</a>
            ))}
          </div>

          {/* Contacto — ocupa 2 columnas en mobile cuando hay espacio */}
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: C.blue, textTransform: 'uppercase' as const, marginBottom: '16px' }}>Contacto</div>
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
        padding: isMobile ? '24px 20px' : '32px 48px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Legal Links */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isMobile ? '12px 20px' : '24px',
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            {[
              { label: 'Política de Privacidad', href: '/legal' },
              { label: 'Términos de Uso', href: '/legal/terminos' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="qc-link-gold-hover"
                style={{ fontSize: '12px', textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright & Status */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: 'space-between',
            gap: isMobile ? '12px' : '0',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              © 2026 Química Clean · San Miguel de Tucumán, Argentina
              <br />
              Todos los derechos reservados.
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', marginLeft: '6px' }}>
                · Sitio por{' '}
                <a
                  href="https://juanmd14.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                  className="qc-link-juan"
                  style={{ textDecoration: 'none' }}
                >
                  Juan
                </a>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isMobile ? 'center' : 'flex-end' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Sistema en línea</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}