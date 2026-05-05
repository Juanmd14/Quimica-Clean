'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error boundary:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#f8fafc',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{
        maxWidth: '480px',
        textAlign: 'center',
        background: 'white',
        padding: '40px 32px',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          Algo salió mal
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
          Ocurrió un error inesperado al cargar la página. Probá de nuevo en unos segundos.
        </p>
        <button
          onClick={reset}
          style={{
            background: '#2b7bb8',
            color: 'white',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
