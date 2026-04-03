'use client'

import { useState, useEffect } from 'react'
import { C } from './constants'

// ─── Types ────────────────────────────────────────────────────────────────────
type FormStatus = 'idle' | 'loading' | 'success' | 'error'
type FormError = { nombre?: string; telefono?: string; email?: string }

// ─── Constants ────────────────────────────────────────────────────────────────
const initialFormData = {
  nombre: '',
  telefono: '',
  producto_interes: '',
  mensaje: '',
}

// ─── Breakpoint hook ───────────────────────────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(1200)
  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return { isMobile: width < 768, isTablet: width < 1024, width }
}

// ─── Contact Component ────────────────────────────────────────────────────────
export function Contact() {
  const { isMobile } = useBreakpoint()
  const [formData, setFormData] = useState(initialFormData)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<FormError>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  // Validaciones
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
          producto_interes: formData.producto_interes.trim(),
          mensaje: formData.mensaje.trim(),
        }),
      })
      
      if (res.ok) {
        setStatus('success')
        setFormData(initialFormData)
        setTouched({})
        setErrors({})
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    const newErrors = { ...errors }
    
    if (field === 'nombre') {
      if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido'
      else if (formData.nombre.trim().length < 3) newErrors.nombre = 'Mínimo 3 caracteres'
      else delete newErrors.nombre
    } else if (field === 'telefono') {
      if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono requerido'
      else if (!validatePhone(formData.telefono)) newErrors.telefono = 'Teléfono inválido'
      else delete newErrors.telefono
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
    <div style={{ background: `linear-gradient(135deg, ${C.blueDark} 0%, #1a2a3a 100%)`, padding: isMobile ? '24px 16px' : '40px', borderRadius: '12px' }}>
      <h2 style={{ color: C.gold, fontSize: isMobile ? '20px' : '24px', fontWeight: 700, marginBottom: '8px' }}>📞 Contactanos</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px' }}>Completa el formulario y nos comunicaremos pronto</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '100%' }}>
        {/* Nombre */}
        <div>
          <label style={{ display: 'block', color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Nombre *</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            onBlur={() => handleFieldBlur('nombre')}
            style={getInputStyle('nombre')}
          />
          {errors.nombre && touched.nombre && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', margin: 0 }}>{errors.nombre}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label style={{ display: 'block', color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Teléfono *</label>
          <input
            type="tel"
            placeholder="+54 9 381 304-6228"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            onBlur={() => handleFieldBlur('telefono')}
            style={getInputStyle('telefono')}
          />
          {errors.telefono && touched.telefono && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', margin: 0 }}>{errors.telefono}</p>}
        </div>

        {/* Producto de interés */}
        <div>
          <label style={{ display: 'block', color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Producto de Interés</label>
          <input
            type="text"
            placeholder="¿Qué producto te interesa?"
            value={formData.producto_interes}
            onChange={(e) => setFormData({ ...formData, producto_interes: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* Mensaje */}
        <div>
          <label style={{ display: 'block', color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Mensaje</label>
          <textarea
            placeholder="Cuéntanos tu consulta..."
            value={formData.mensaje}
            onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }}
          />
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div style={{ background: 'rgba(74, 222, 128, 0.2)', border: '1px solid #4ade80', color: '#4ade80', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            ✅ ¡Lead enviado correctamente! Nos comunicaremos pronto.
          </div>
        )}
        {status === 'error' && (
          <div style={{ background: 'rgba(248, 113, 113, 0.2)', border: '1px solid #f87171', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            ❌ Error al enviar. Intenta de nuevo.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            background: status === 'loading' ? 'rgba(43, 123, 184, 0.5)' : 'linear-gradient(135deg, #2b7bb8 0%, #1e5a99 100%)',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => {
            if (status !== 'loading') {
              const btn = e.currentTarget as HTMLButtonElement
              btn.style.transform = 'translateY(-2px)'
              btn.style.boxShadow = '0 8px 16px rgba(43,123,184,0.3)'
            }
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.transform = 'translateY(0)'
            btn.style.boxShadow = 'none'
          }}
        >
          {status === 'loading' ? '⏳ Enviando...' : 'Enviar Consulta'}
        </button>
      </form>
    </div>
  )
}

// ─── WhyUs Component ──────────────────────────────────────────────────────────
export function WhyUs() {
  const { isMobile } = useBreakpoint()
  
  return (
    <section style={{ background: C.blueDark, padding: isMobile ? '32px 16px' : '56px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: C.gold, fontSize: isMobile ? '20px' : '28px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>¿Por qué elegirnos?</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Rápido</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Entrega ágil en San Miguel de Tucumán</p>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💰</div>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Precios Competitivos</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Las mejores opciones del mercado</p>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Calidad Garantizada</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Productos verificados y confiables</p>
        </div>
      </div>
    </section>
  )
}

// ─── Footer Component ─────────────────────────────────────────────────────────
export function Footer() {
  const { isMobile } = useBreakpoint()
  
  return (
    <footer style={{ background: '#0f1822', border: `1px solid ${C.border}`, padding: isMobile ? '32px 16px' : '40px', marginTop: '40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '32px', marginBottom: '32px', paddingBottom: '32px', borderBottom: `1px solid ${C.border}` }}>
          {/* Empresa */}
          <div>
            <h4 style={{ color: C.gold, fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>Empresa</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><a href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px' }}>Inicio</a></li>
              <li style={{ marginBottom: '8px' }}><a href="/#productos" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px' }}>Productos</a></li>
              <li><a href="/#contacto" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px' }}>Contacto</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 style={{ color: C.gold, fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><a href="/legal" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px' }}>Privacidad</a></li>
              <li style={{ marginBottom: '8px' }}><a href="/legal" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px' }}>Términos</a></li>
              <li><a href="/legal" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px' }}>Aviso Legal</a></li>
            </ul>
          </div>
          
          {/* Contacto */}
          <div>
            <h4 style={{ color: C.gold, fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>Contacto</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '0 0 8px 0' }}>📍 San Miguel de Tucumán, Argentina</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '0 0 8px 0' }}>📞 +54 9 381 304-6228</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>📧 admquimicaclean@gmail.com</p>
          </div>
        </div>
        
        {/* Copyright */}
        <div style={{ textAlign: 'center', paddingTop: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>© 2026 Química Clean. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}