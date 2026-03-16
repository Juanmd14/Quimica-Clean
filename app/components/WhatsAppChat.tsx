'use client'

import { useState, useEffect, useRef } from 'react'
import { C } from './constants'
import { WhatsAppIcon } from './ui'

const WA_NUMBER = '5493813046228'

export function WhatsAppChat() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<'typing' | 'ready' | 'connecting'>('typing')
  const [progress, setProgress] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Tooltip de bienvenida
  useEffect(() => {
    const t1 = setTimeout(() => setShowTooltip(true), 2500)
    const t2 = setTimeout(() => setShowTooltip(false), 7000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Animación de tipeo al abrir
  useEffect(() => {
    if (!open) return
    setPhase('typing')
    setProgress(0)
    const t = setTimeout(() => {
      setPhase('ready')
      setTimeout(() => inputRef.current?.focus(), 100)
    }, 1300)
    return () => clearTimeout(t)
  }, [open])

  const handleSend = () => {
    const text = inputRef.current?.value.trim()
    if (!text || phase !== 'ready') return
    if (inputRef.current) inputRef.current.disabled = true
    setPhase('connecting')
    setProgress(0)
    requestAnimationFrame(() => {
      setTimeout(() => setProgress(100), 50)
    })
    setTimeout(() => {
      const msg = `Hola, te escribo desde el sitio web. Mi consulta es: ${text}`
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
      setTimeout(() => {
        if (inputRef.current) { inputRef.current.value = ''; inputRef.current.disabled = false }
        setPhase('typing')
        setProgress(0)
        setOpen(false)
      }, 600)
    }, 1150)
  }

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: .7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes wa-bounce {
          0%,60%,100% { transform: translateY(0); }
          30%          { transform: translateY(-7px); }
        }
        @keyframes wa-pop {
          from { transform: scale(.45) translateY(20px); opacity: 0; }
          to   { transform: scale(1)   translateY(0);    opacity: 1; }
        }
        @keyframes wa-spin { to { transform: rotate(360deg); } }
        .wa-input:focus { border-color: ${C.blue} !important; background: #fff !important; outline: none; }
        .wa-input::placeholder { color: ${C.textLight}; }
        .wa-send-btn:hover  { background: ${C.blueDark} !important; }
        .wa-fab-btn:hover   { transform: scale(1.07) !important; box-shadow: 0 8px 30px rgba(43,123,184,.55) !important; }
      `}</style>

      {/* Tooltip */}
      <div style={{
        position: 'fixed', bottom: '94px', right: '88px', zIndex: 999,
        background: C.white, padding: '8px 14px', borderRadius: '12px',
        fontSize: '13px', fontWeight: 500, color: C.text,
        boxShadow: '0 4px 16px rgba(0,0,0,.13)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
        opacity: showTooltip && !open ? 1 : 0,
        transition: 'opacity .4s',
        border: `1px solid ${C.border}`,
      }}>
        ¿Tenés una consulta? ¡Escribinos! 💬
        <span style={{
          position: 'absolute', right: '-7px', top: '50%', transform: 'translateY(-50%)',
          width: 0, height: 0,
          borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
          borderLeft: `7px solid ${C.white}`,
        }} />
      </div>

      {/* Ventana de chat */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '24px', zIndex: 999,
          width: '320px', background: C.white, borderRadius: '20px',
          boxShadow: '0 12px 48px rgba(0,0,0,.18)',
          overflow: 'hidden', transformOrigin: 'bottom right',
          animation: 'wa-pop .28s cubic-bezier(.34,1.56,.64,1) forwards',
          border: `1px solid ${C.border}`,
        }}>

          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${C.blueDark}, ${C.blue})`,
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '11px',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(255,255,255,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <WhatsAppIcon size={22} color="white" />
            </div>
            <div>
              <div style={{ color: C.white, fontSize: '14px', fontWeight: 700 }}>
                Asistente Química Clean
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ color: 'rgba(255,255,255,.75)', fontSize: '11px' }}>
                  En línea · Respuesta inmediata
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                marginLeft: 'auto', background: 'none', border: 'none',
                color: 'rgba(255,255,255,.65)', cursor: 'pointer',
                fontSize: '18px', padding: '4px', lineHeight: 1,
              }}
            >✕</button>
          </div>

          {/* Burbuja del bot */}
          <div style={{ padding: '14px 14px 10px', background: '#f5f7fa', minHeight: '80px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: C.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WhatsAppIcon size={14} color="white" />
              </div>
              <div style={{
                background: C.white, borderRadius: '14px', borderBottomLeftRadius: '4px',
                padding: '10px 14px', fontSize: '13.5px', lineHeight: 1.55, color: C.text,
                boxShadow: '0 1px 4px rgba(0,0,0,.07)', maxWidth: '230px',
              }}>
                {phase === 'typing' ? (
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: '50%', background: C.textLight,
                        animation: `wa-bounce 1.2s ${d}s infinite ease-in-out`,
                      }} />
                    ))}
                  </div>
                ) : (
                  <span>
                    ¡Hola! 👋 Soy el asistente de{' '}
                    <strong style={{ color: C.blue }}>Química Clean</strong>.
                    ¿En qué puedo ayudarte hoy?
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pantalla de conectando */}
          {phase === 'connecting' && (
            <div style={{
              padding: '20px 16px', background: '#f5f7fa',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36,
                border: `3px solid ${C.border}`,
                borderTopColor: C.blue, borderRadius: '50%',
                animation: 'wa-spin .8s linear infinite',
              }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>
                Conectando con un asesor...
              </div>
              <div style={{ fontSize: '12px', color: C.textLight }}>
                En un momento te atendemos
              </div>
              <div style={{ width: '100%', height: 3, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: C.blue, borderRadius: 4,
                  width: `${progress}%`, transition: 'width 1s ease',
                }} />
              </div>
            </div>
          )}

          {/* Input */}
          {phase !== 'connecting' && (
            <>
              <div style={{
                display: 'flex', gap: 8, padding: '10px 12px',
                background: C.white, borderTop: `1px solid ${C.border}`, alignItems: 'center',
              }}>
                <input
                  ref={inputRef}
                  className="wa-input"
                  type="text"
                  placeholder="Escribí tu consulta..."
                  disabled={phase === 'typing'}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                  style={{
                    flex: 1, border: `1.5px solid ${C.border}`, borderRadius: '24px',
                    padding: '9px 14px', fontSize: '13.5px', color: C.text,
                    fontFamily: 'DM Sans, sans-serif', background: C.offWhite,
                    transition: 'border-color .2s, background .2s',
                    opacity: phase === 'typing' ? 0.5 : 1,
                  }}
                />
                <button
                  className="wa-send-btn"
                  onClick={handleSend}
                  disabled={phase === 'typing'}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: C.blue, border: 'none', cursor: phase === 'typing' ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .15s', flexShrink: 0,
                    opacity: phase === 'typing' ? 0.5 : 1,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <div style={{
                textAlign: 'center', padding: '4px 0 10px',
                fontSize: '10.5px', color: C.textLight, background: C.white, letterSpacing: '.3px',
              }}>
                🔒 Seguro · Química Clean
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        className="wa-fab-btn"
        onClick={() => setOpen(o => !o)}
        title="Escribinos por WhatsApp"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: 58, height: 58, borderRadius: '50%',
          background: C.blue, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(43,123,184,.45)',
          transition: 'transform .2s, box-shadow .2s',
        }}
      >
        {!open && (
          <div style={{
            position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
            background: 'rgba(43,123,184,.35)',
            animation: 'wa-pulse 2s infinite',
            pointerEvents: 'none',
          }} />
        )}
        <WhatsAppIcon size={28} color="white" />
      </button>
    </>
  )
}