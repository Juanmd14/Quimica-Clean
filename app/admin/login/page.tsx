'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const C = {
  bg: '#0f1623',
  card: '#1a2436',
  border: '#2a3a54',
  gold: '#e7a73f',
  text: '#f1f5f9',
  textMid: '#94a3b8',
}

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Contraseña incorrecta')
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0f1623',
    border: `1.5px solid ${C.border}`,
    color: C.text,
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, system-ui, sans-serif',
    }}>
      <div style={{
        width: '380px',
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔐</div>
          <h1 style={{ color: C.text, fontWeight: 800, fontSize: '22px', margin: 0 }}>
            Panel Admin
          </h1>
          <p style={{ color: C.textMid, fontSize: '13px', marginTop: '6px', margin: '6px 0 0' }}>
            Química Clean
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: C.textMid,
              marginBottom: '8px',
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.gold}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border}
              disabled={loading}
              required
              autoFocus
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? '#2a3a54' : C.gold,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              transition: 'background 0.2s, transform 0.1s',
              marginTop: '4px',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#c8882a' }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = C.gold }}
          >
            {loading ? 'Verificando…' : 'Ingresar →'}
          </button>

        </form>
      </div>
    </div>
  )
}