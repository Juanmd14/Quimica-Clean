'use client'

import { useState, useEffect, useRef } from 'react'
import { C } from './constants'
import { WhatsAppIcon } from './ui'

const WA_NUMBER = '5493813046228'

const QUICK_CHIPS = [
  { label: '💰 Consultar precios', text: 'Hola, quiero consultar precios.' },
  { label: '📦 Hacer un pedido',   text: 'Hola, quiero hacer un pedido.' },
  { label: '📋 Ver catálogo',      text: 'Hola, me gustaría ver el catálogo de productos.' },
  { label: '🚚 Info de envíos',    text: 'Hola, quiero saber cómo son los envíos.' },
]

function getTime() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export function WhatsAppChat() {
  const [open, setOpen]               = useState(false)
  const [phase, setPhase]             = useState<'typing' | 'ready' | 'connecting'>('typing')
  const [progress, setProgress]       = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [badge, setBadge]             = useState(true)
  const [botTime, setBotTime]         = useState('')
  const [userMsg, setUserMsg]         = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Tooltip de bienvenida
  useEffect(() => {
    const t1 = setTimeout(() => setShowTooltip(true), 2500)
    const t2 = setTimeout(() => setShowTooltip(false), 7000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Al abrir: animación de tipeo, registrar hora
  useEffect(() => {
    if (!open) return
    setBadge(false)
    setPhase('typing')
    setProgress(0)
    setUserMsg('')
    const t = setTimeout(() => {
      setBotTime(getTime())
      setPhase('ready')
      setTimeout(() => inputRef.current?.focus(), 100)
    }, 1300)
    return () => clearTimeout(t)
  }, [open])

  const redirect = (text: string) => {
    setUserMsg(text)
    if (inputRef.current) inputRef.current.disabled = true
    setPhase('connecting')
    setProgress(0)
    requestAnimationFrame(() => setTimeout(() => setProgress(100), 50))
    setTimeout(() => {
      const msg = `Hola, te escribo desde el sitio web. Mi consulta es: ${text}`
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
      setTimeout(() => {
        if (inputRef.current) { inputRef.current.value = ''; inputRef.current.disabled = false }
        setPhase('typing')
        setProgress(0)
        setUserMsg('')
        setOpen(false)
      }, 700)
    }, 1200)
  }

  const handleSend = () => {
    const text = inputRef.current?.value.trim()
    if (!text || phase !== 'ready') return
    redirect(text)
  }

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%   { transform:scale(1);   opacity:.7; }
          70%  { transform:scale(1.65);opacity:0; }
          100% { transform:scale(1.65);opacity:0; }
        }
        @keyframes wa-bounce {
          0%,60%,100% { transform:translateY(0); }
          30%          { transform:translateY(-7px); }
        }
        @keyframes wa-pop {
          from { transform:scale(.42) translateY(24px); opacity:0; }
          to   { transform:scale(1)   translateY(0);    opacity:1; }
        }
        @keyframes wa-spin  { to { transform:rotate(360deg); } }
        @keyframes wa-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wa-badge { 0%,100%{transform:scale(1)} 50%{transform:scale(1.25)} }

        .wa-input:focus { border-color:${C.blue} !important; background:#fff !important; outline:none; }
        .wa-input::placeholder { color:${C.textLight}; }
        .wa-input:disabled { cursor:not-allowed; }
        .wa-send-btn:hover:not(:disabled) { background:${C.blueDark} !important; }
        .wa-fab-btn:hover { transform:scale(1.08) !important; box-shadow:0 8px 30px rgba(43,123,184,.6) !important; }
        .wa-chip:hover { background:${C.blue} !important; color:#fff !important; border-color:${C.blue} !important; transform:translateY(-1px); box-shadow:0 4px 12px rgba(43,123,184,.25); }
        .wa-chip { transition: all .18s ease; }
      `}</style>

      {/* Tooltip */}
      <div style={{
        position:'fixed', bottom:'94px', right:'88px', zIndex:999,
        background:C.white, padding:'8px 14px', borderRadius:'12px',
        fontSize:'13px', fontWeight:500, color:C.text,
        boxShadow:'0 4px 16px rgba(0,0,0,.13)',
        whiteSpace:'nowrap', pointerEvents:'none',
        opacity: showTooltip && !open ? 1 : 0,
        transition:'opacity .4s',
        border:`1px solid ${C.border}`,
      }}>
        ¿Tenés una consulta? ¡Escribinos! 💬
        <span style={{
          position:'absolute', right:'-7px', top:'50%', transform:'translateY(-50%)',
          width:0, height:0,
          borderTop:'7px solid transparent', borderBottom:'7px solid transparent',
          borderLeft:`7px solid ${C.white}`,
        }} />
      </div>

      {/* Ventana de chat */}
      {open && (
        <div style={{
          position:'fixed', bottom:'92px', right:'24px', zIndex:999,
          width:'320px', background:C.white, borderRadius:'20px',
          boxShadow:'0 16px 56px rgba(0,0,0,.18)',
          overflow:'hidden', transformOrigin:'bottom right',
          animation:'wa-pop .3s cubic-bezier(.34,1.56,.64,1) forwards',
          border:`1px solid ${C.border}`,
        }}>

          {/* Header */}
          <div style={{
            background:`linear-gradient(135deg, ${C.blueDark}, ${C.blue})`,
            padding:'14px 16px', display:'flex', alignItems:'center', gap:'11px',
          }}>
            <div style={{
              width:44, height:44, borderRadius:'50%',
              background:'rgba(255,255,255,.15)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              border:'1.5px solid rgba(255,255,255,.25)',
            }}>
              <WhatsAppIcon size={22} color="white" />
            </div>
            <div>
              <div style={{ color:C.white, fontSize:'14px', fontWeight:700 }}>
                Química Clean
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80' }} />
                <span style={{ color:'rgba(255,255,255,.75)', fontSize:'11px' }}>
                  En línea · Respuesta inmediata
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                marginLeft:'auto', background:'rgba(255,255,255,.12)', border:'none',
                color:'rgba(255,255,255,.85)', cursor:'pointer',
                fontSize:'14px', padding:'6px 7px', lineHeight:1,
                borderRadius:'8px', transition:'background .15s',
              }}
            >✕</button>
          </div>

          {/* Mensajes */}
          <div style={{ padding:'14px 14px 0', background:'#f0f4f8', display:'flex', flexDirection:'column', gap:8 }}>

            {/* Burbuja bot */}
            <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
              <div style={{
                width:28, height:28, borderRadius:'50%', flexShrink:0,
                background:C.blue,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <WhatsAppIcon size={14} color="white" />
              </div>
              <div>
                <div style={{
                  background:C.white, borderRadius:'14px', borderBottomLeftRadius:'4px',
                  padding:'10px 14px', fontSize:'13.5px', lineHeight:1.55, color:C.text,
                  boxShadow:'0 1px 4px rgba(0,0,0,.07)', maxWidth:'225px',
                }}>
                  {phase === 'typing' ? (
                    <div style={{ display:'flex', gap:4, alignItems:'center', padding:'3px 2px' }}>
                      {[0, .2, .4].map((d, i) => (
                        <div key={i} style={{
                          width:7, height:7, borderRadius:'50%', background:C.textLight,
                          animation:`wa-bounce 1.2s ${d}s infinite ease-in-out`,
                        }} />
                      ))}
                    </div>
                  ) : (
                    <span style={{ animation:'wa-fadein .35s ease forwards' }}>
                      ¡Hola! 👋 Soy el asistente de{' '}
                      <strong style={{ color:C.blue }}>Química Clean</strong>.
                      ¿En qué puedo ayudarte hoy?
                    </span>
                  )}
                </div>
                {phase !== 'typing' && (
                  <div style={{
                    fontSize:'10px', color:C.textLight, marginTop:3, marginLeft:4,
                    animation:'wa-fadein .35s .1s ease both',
                  }}>
                    {botTime} · ✓✓
                  </div>
                )}
              </div>
            </div>

            {/* Burbuja usuario (solo en fase connecting) */}
            {phase === 'connecting' && userMsg && (
              <div style={{
                display:'flex', justifyContent:'flex-end',
                animation:'wa-fadein .25s ease forwards',
              }}>
                <div>
                  <div style={{
                    background:C.blue, color:'#fff',
                    borderRadius:'14px', borderBottomRightRadius:'4px',
                    padding:'10px 14px', fontSize:'13.5px', lineHeight:1.55,
                    maxWidth:'220px', boxShadow:'0 1px 4px rgba(0,0,0,.1)',
                  }}>
                    {userMsg}
                  </div>
                  <div style={{ fontSize:'10px', color:C.textLight, marginTop:3, textAlign:'right', marginRight:4 }}>
                    {getTime()} · ✓
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chips de consulta rápida */}
          {phase === 'ready' && (
            <div style={{
              padding:'10px 12px 8px', background:'#f0f4f8',
              display:'flex', flexWrap:'wrap', gap:6,
              animation:'wa-fadein .3s .1s ease both',
            }}>
              {QUICK_CHIPS.map(chip => (
                <button
                  key={chip.label}
                  className="wa-chip"
                  onClick={() => redirect(chip.text)}
                  style={{
                    background:C.white, color:C.textMid,
                    border:`1px solid ${C.border}`, borderRadius:'20px',
                    padding:'5px 11px', fontSize:'11.5px', fontWeight:500,
                    cursor:'pointer', fontFamily:'DM Sans, sans-serif',
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Pantalla de conectando */}
          {phase === 'connecting' && (
            <div style={{
              padding:'18px 16px', background:'#f0f4f8',
              display:'flex', flexDirection:'column', alignItems:'center', gap:10,
            }}>
              <div style={{
                width:34, height:34,
                border:`3px solid ${C.border}`,
                borderTopColor:C.blue, borderRadius:'50%',
                animation:'wa-spin .8s linear infinite',
              }} />
              <div style={{ fontSize:'13.5px', fontWeight:600, color:C.text }}>
                Conectando con un asesor...
              </div>
              <div style={{ fontSize:'11.5px', color:C.textLight }}>
                En un momento te atendemos
              </div>
              <div style={{ width:'100%', height:3, background:C.border, borderRadius:4, overflow:'hidden' }}>
                <div style={{
                  height:'100%', background:C.blue, borderRadius:4,
                  width:`${progress}%`, transition:'width 1s ease',
                }} />
              </div>
            </div>
          )}

          {/* Input */}
          {phase !== 'connecting' && (
            <>
              <div style={{
                display:'flex', gap:8, padding:'10px 12px',
                background:C.white, borderTop:`1px solid ${C.border}`, alignItems:'center',
              }}>
                <input
                  ref={inputRef}
                  className="wa-input"
                  type="text"
                  placeholder="O escribí tu consulta..."
                  disabled={phase === 'typing'}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                  style={{
                    flex:1, border:`1.5px solid ${C.border}`, borderRadius:'24px',
                    padding:'9px 14px', fontSize:'13.5px', color:C.text,
                    fontFamily:'DM Sans, sans-serif', background:C.offWhite,
                    transition:'border-color .2s, background .2s',
                    opacity: phase === 'typing' ? 0.45 : 1,
                  }}
                />
                <button
                  className="wa-send-btn"
                  onClick={handleSend}
                  disabled={phase === 'typing'}
                  style={{
                    width:38, height:38, borderRadius:'50%',
                    background:C.blue, border:'none',
                    cursor: phase === 'typing' ? 'default' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'background .15s', flexShrink:0,
                    opacity: phase === 'typing' ? 0.45 : 1,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <div style={{
                textAlign:'center', padding:'5px 0 10px',
                fontSize:'10.5px', color:C.textLight, background:C.white, letterSpacing:'.3px',
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
          position:'fixed', bottom:'24px', right:'24px', zIndex:1000,
          width:58, height:58, borderRadius:'50%',
          background:C.blue, border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 24px rgba(43,123,184,.45)',
          transition:'transform .2s, box-shadow .2s',
        }}
      >
        {/* Pulse ring */}
        {!open && (
          <div style={{
            position:'absolute', width:'100%', height:'100%', borderRadius:'50%',
            background:'rgba(43,123,184,.35)',
            animation:'wa-pulse 2s infinite',
            pointerEvents:'none',
          }} />
        )}
        {/* Badge */}
        {badge && !open && (
          <div style={{
            position:'absolute', top:-3, right:-3,
            width:18, height:18, borderRadius:'50%',
            background:'#ef4444', color:'#fff',
            fontSize:'10px', fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center',
            border:`2px solid #fff`,
            animation:'wa-badge 1.5s 3s ease-in-out 3',
          }}>1</div>
        )}
        <WhatsAppIcon size={28} color="white" />
      </button>
    </>
  )
}