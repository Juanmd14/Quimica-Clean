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
  email: '',
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

        {/* Email */}
        <div>
          <label style={{ display: 'block', color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={inputStyle}
          />
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