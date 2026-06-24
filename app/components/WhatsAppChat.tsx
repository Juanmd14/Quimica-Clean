'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { C } from './constants'
import { WhatsAppIcon } from './ui'
import { useBreakpoint } from '@/lib/hooks'
import { getBusinessStatus, getNextOpenAt, type BusinessStatus } from '@/lib/businessHours'
import type { ChatContext } from './WhatsAppChatLazy'

const ASESORAS = [
  { id: 'luciana', name: 'Luciana', role: 'Asesora comercial', photo: '/asesora-luciana.jpg', phone: '5493813202593' },
  { id: 'rocio',   name: 'Rocío',   role: 'Asesora comercial', photo: '/asesora-rocio.jpg',   phone: '5493813006202' },
  { id: 'laura',   name: 'Laura',   role: 'Asesora comercial', photo: '/laura-asesora.jpeg',  phone: '5493815436868' },
] as const
type Asesora = (typeof ASESORAS)[number]

type ChipCtx = 'home' | 'catalog' | 'product'

type Chip = { label: string; build: (ctx: ChatContext) => string }

const CHIP_POOL: Record<ChipCtx, Chip[]> = {
  home: [
    { label: '💰 Consultar precios', build: () => 'Hola, quiero consultar precios mayoristas.' },
    { label: '📦 Hacer un pedido',   build: () => 'Hola, quiero hacer un pedido.' },
    { label: '📋 Ver catálogo',      build: () => 'Hola, me gustaría ver el catálogo de productos.' },
    { label: '🚚 Info de envíos',    build: () => 'Hola, quiero saber cómo son los envíos.' },
  ],
  catalog: [
    { label: '💰 Pedir cotización',     build: () => 'Hola, quiero pedir una cotización mayorista.' },
    { label: '📦 ¿Cómo compro?',        build: () => 'Hola, ¿cómo es el proceso para hacer un pedido?' },
    { label: '🚚 ¿Envían a mi zona?',   build: () => 'Hola, quiero saber si hacen envíos a mi zona.' },
    { label: '🏭 Soy revendedor',       build: () => 'Hola, soy revendedor y quiero trabajar con ustedes.' },
  ],
  product: [
    { label: '💲 Precio y stock',        build: c => c.type === 'product' ? `Hola, quiero precio y stock del producto: ${c.name}.` : 'Hola.' },
    { label: '📐 Presentaciones',        build: c => c.type === 'product' ? `Hola, ¿qué presentaciones tienen del producto: ${c.name}?` : 'Hola.' },
    { label: '🚚 Calcular envío',        build: c => c.type === 'product' ? `Hola, quiero calcular envío para: ${c.name}.` : 'Hola.' },
    { label: '📋 Productos similares',   build: c => c.type === 'product' ? `Hola, ¿tienen productos similares a: ${c.name}?` : 'Hola.' },
  ],
}

function useAsesora(): Asesora {
  // Default optimista: si el fetch al endpoint no resolvió todavía, mostramos Luciana.
  // El chat tarda ≥2.5s en revelar el tooltip y ≥1.3s en mostrar el saludo,
  // así que normalmente el fetch ya está resuelto antes de que el usuario vea el nombre.
  const [asesora, setAsesora] = useState<Asesora>(ASESORAS[0])

  useEffect(() => {
    let cancelled = false
    fetch('/api/asesora', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: { id?: string } | null) => {
        if (cancelled || !d) return
        const match = ASESORAS.find(a => a.id === d.id)
        if (match) setAsesora(match)
      })
      .catch(() => { /* fallback al default */ })
    return () => { cancelled = true }
  }, [])

  return asesora
}

function buildGreeting(context: ChatContext, status: BusinessStatus, name: string, nextOpenAt: string): ReactNode {
  if (context.type === 'product') {
    const intro = <>¡Hola! 👋 Veo que te interesa <strong style={{ color: C.blue }}>{context.name}</strong>.{' '}</>
    if (status === 'open' || status === 'closing-soon') {
      return <>{intro}Soy {name}, ¿te paso stock, precio mayorista o presentaciones?</>
    }
    if (status === 'lunch') {
      return <>{intro}Soy {name}, volvemos del receso a las 14:30 — dejame tu mensaje y te respondo apenas vuelva 🙌</>
    }
    return <>{intro}Ahora estamos cerrados. {nextOpenAt}. Dejá tu consulta y te respondo apenas abramos.</>
  }
  if (context.type === 'catalog') {
    if (status === 'open' || status === 'closing-soon') {
      return <>¡Hola! 👋 ¿Buscás algo específico del catálogo? Soy {name}, te ayudo a encontrarlo.</>
    }
    if (status === 'lunch') {
      return <>¡Hola! 👋 Soy {name}. Volvemos del receso a las 14:30, pero contame qué buscás y te respondo apenas vuelva.</>
    }
    return <>¡Hola! 👋 Soy {name}. Ahora estamos cerrados. {nextOpenAt}. Dejá tu consulta y te contacto apenas abramos.</>
  }
  // home
  if (status === 'open') return <>¡Hola! 👋 Soy {name}, asesora de <strong style={{ color: C.blue }}>Química Clean</strong>. ¿En qué puedo ayudarte hoy?</>
  if (status === 'closing-soon') return <>¡Hola! 👋 Soy {name}. Estamos cerrando pronto — escribime rápido y te respondo hoy 🙌</>
  if (status === 'lunch') return <>¡Hola! 👋 Soy {name}. Volvemos del receso a las 14:30, pero dejame tu mensaje y te respondo apenas vuelva.</>
  return <>¡Hola! 👋 Soy {name}. Ahora estamos cerrados. {nextOpenAt}. Dejá tu consulta y te contacto apenas abramos.</>
}

function buildStatusLine(status: BusinessStatus, nextOpenAt: string): { dot: string; text: string } {
  if (status === 'open') return { dot: '#4ade80', text: 'En línea · Respuesta rápida' }
  if (status === 'closing-soon') return { dot: '#fbbf24', text: 'Cerrando pronto — atención hoy' }
  if (status === 'lunch') return { dot: '#fbbf24', text: 'En receso · Volvemos 14:30' }
  return { dot: '#94a3b8', text: nextOpenAt }
}

function getTime() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export function WhatsAppChat({ context = { type: 'home' } as ChatContext }: { context?: ChatContext }) {
  const [open, setOpen]               = useState(false)
  const [phase, setPhase]             = useState<'typing' | 'ready' | 'connecting'>('typing')
  const [progress, setProgress]       = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [badge, setBadge]             = useState(true)
  const [botTime, setBotTime]         = useState('')
  const [userMsg, setUserMsg]         = useState('')
  const asesora                       = useAsesora()
  const [status, setStatus]           = useState<BusinessStatus>(() => getBusinessStatus())
  const [nextOpenAt, setNextOpenAt]   = useState<string>(() => getNextOpenAt())
  const inputRef = useRef<HTMLInputElement>(null)
  const { isMobile } = useBreakpoint()

  // Refresh business status every 60s (handles user crossing a boundary like 13:30 → lunch)
  useEffect(() => {
    const id = setInterval(() => {
      setStatus(getBusinessStatus())
      setNextOpenAt(getNextOpenAt())
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  // Tooltip de bienvenida
  useEffect(() => {
    const t1 = setTimeout(() => setShowTooltip(true), 2500)
    const t2 = setTimeout(() => setShowTooltip(false), 7000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Al abrir: animación de tipeo, registrar hora
  useEffect(() => {
    if (!open || phase !== 'typing') return
    const t = setTimeout(() => {
      setBotTime(getTime())
      setPhase('ready')
      setTimeout(() => inputRef.current?.focus(), 100)
    }, 1300)
    return () => clearTimeout(t)
  }, [open, phase])

  const openChat = () => {
    setBadge(false)
    setPhase('typing')
    setProgress(0)
    setUserMsg('')
    setOpen(true)
  }

  const redirect = (text: string) => {
    // iOS Safari bloquea window.open si no está en el user gesture síncrono.
    // Abrir primero, animar después.
    const url = `https://wa.me/${asesora.phone}?text=${encodeURIComponent(text)}`
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      window.location.assign(url)
      return
    }

    setUserMsg(text)
    if (inputRef.current) inputRef.current.disabled = true
    setPhase('connecting')
    setProgress(0)
    requestAnimationFrame(() => setTimeout(() => setProgress(100), 50))
    setTimeout(() => {
      if (inputRef.current) { inputRef.current.value = ''; inputRef.current.disabled = false }
      setPhase('typing')
      setProgress(0)
      setUserMsg('')
      setOpen(false)
    }, 1500)
  }

  const handleSend = () => {
    const text = inputRef.current?.value.trim()
    if (!text || phase !== 'ready') return
    redirect(text)
  }

  const chipCtx: ChipCtx = context.type
  const chips = CHIP_POOL[chipCtx]
  const statusLine = buildStatusLine(status, nextOpenAt)
  const greeting = buildGreeting(context, status, asesora.name, nextOpenAt)

  return (
    <>
      {/* Tooltip — solo desktop */}
      {!isMobile && (
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
          ¿Tenés una consulta? Te atiende {asesora.name} 💬
          <span style={{
            position:'absolute', right:'-7px', top:'50%', transform:'translateY(-50%)',
            width:0, height:0,
            borderTop:'7px solid transparent', borderBottom:'7px solid transparent',
            borderLeft:`7px solid ${C.white}`,
          }} />
        </div>
      )}

      {/* Ventana de chat */}
      {open && (
        <div
          role="dialog"
          aria-label={`Chat con ${asesora.name}, ${asesora.role} de Química Clean`}
          style={{
            position:'fixed',
            bottom: isMobile ? '82px' : '92px',
            right: isMobile ? '12px' : '24px',
            left: isMobile ? '12px' : 'auto',
            zIndex:999,
            width: isMobile ? 'auto' : '320px',
            maxWidth: isMobile ? '340px' : 'none',
            marginLeft: isMobile ? 'auto' : undefined,
            background:C.white, borderRadius:'20px',
            boxShadow:'0 16px 56px rgba(0,0,0,.18)',
            overflow:'hidden', transformOrigin:'bottom right',
            animation:'wa-pop .3s cubic-bezier(.34,1.56,.64,1) forwards',
            border:`1px solid ${C.border}`,
          }}
        >

          {/* Header */}
          <div style={{
            background:`linear-gradient(135deg, ${C.blueDark}, ${C.blue})`,
            padding: isMobile ? '11px 14px' : '14px 16px',
            display:'flex', alignItems:'center', gap:'11px',
          }}>
            <div style={{
              width:44, height:44, borderRadius:'50%',
              overflow:'hidden', position:'relative', flexShrink:0,
              border:'1.5px solid rgba(255,255,255,.35)',
              background:'rgba(255,255,255,.1)',
            }}>
              <Image
                src={asesora.photo}
                alt=""
                fill
                sizes="44px"
                style={{ objectFit:'cover' }}
              />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color:C.white, fontSize:'14px', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {asesora.name} · Química Clean
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                <div aria-hidden="true" style={{ width:7, height:7, borderRadius:'50%', background:statusLine.dot }} />
                <span style={{ color:'rgba(255,255,255,.75)', fontSize:'11px' }}>
                  {statusLine.text}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              style={{
                marginLeft:'auto', background:'rgba(255,255,255,.12)', border:'none',
                color:'rgba(255,255,255,.85)', cursor:'pointer',
                fontSize:'14px', padding:'6px 7px', lineHeight:1,
                borderRadius:'8px', transition:'background .15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div style={{ padding:'14px 14px 0', background:'#f0f4f8', display:'flex', flexDirection:'column', gap:8 }}>

            {/* Burbuja bot */}
            <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
              <div style={{
                width:28, height:28, borderRadius:'50%', flexShrink:0,
                overflow:'hidden', position:'relative',
                border:'1px solid rgba(43,123,184,.25)',
              }}>
                <Image src={asesora.photo} alt="" fill sizes="28px" style={{ objectFit:'cover' }} />
              </div>
              <div>
                <div style={{
                  background:C.white, borderRadius:'18px', borderBottomLeftRadius:'4px',
                  padding:'10px 14px', fontSize:'13.5px', lineHeight:1.55, color:C.text,
                  boxShadow:'0 1px 6px rgba(0,0,0,.06)', maxWidth:'225px',
                }}>
                  {phase === 'typing' ? (
                    <div style={{ display:'flex', gap:4, alignItems:'center', padding:'3px 2px' }} aria-label="Escribiendo">
                      {[0, .2, .4].map((d, i) => (
                        <div key={i} style={{
                          width:7, height:7, borderRadius:'50%', background:C.textLight,
                          animation:`wa-bounce 1.2s ${d}s infinite ease-in-out`,
                        }} />
                      ))}
                    </div>
                  ) : (
                    <span style={{ animation:'wa-fadein .35s ease forwards' }}>
                      {greeting}
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
                    borderRadius:'18px', borderBottomRightRadius:'4px',
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
            }}>
              {chips.map((chip, i) => (
                <button
                  key={chip.label}
                  type="button"
                  className="wa-chip"
                  onClick={() => redirect(chip.build(context))}
                  style={{
                    background:C.white, color:C.textMid,
                    border:`1px solid ${C.border}`, borderRadius:'20px',
                    padding:'5px 11px', fontSize:'11.5px', fontWeight:500,
                    cursor:'pointer', fontFamily:'DM Sans, sans-serif',
                    animation:`wa-fadein .3s ${100 + i * 70}ms ease both`,
                    opacity: 0,
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
                Abriendo WhatsApp...
              </div>
              <div style={{ fontSize:'11.5px', color:C.textLight }}>
                Te llevamos al chat con tu mensaje
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
                <label htmlFor="wa-input" className="sr-only">Escribí tu consulta</label>
                <input
                  id="wa-input"
                  ref={inputRef}
                  className="wa-input"
                  type="text"
                  placeholder={phase === 'typing' ? 'Escribiendo...' : 'O escribí tu consulta...'}
                  disabled={phase === 'typing'}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                  style={{
                    flex:1, border:`1.5px solid ${C.border}`, borderRadius:'24px',
                    padding:'9px 14px', fontSize:'13.5px', color:C.text,
                    fontFamily:'DM Sans, sans-serif', background:C.offWhite,
                    transition:'border-color .2s, background .2s',
                    minWidth: 0,
                  }}
                />
                <button
                  type="button"
                  className="wa-send-btn"
                  onClick={handleSend}
                  disabled={phase === 'typing'}
                  aria-label="Enviar consulta a WhatsApp"
                  style={{
                    width:40, height:40, borderRadius:'50%',
                    background: phase === 'typing' ? C.textLight : C.blue, border:'none',
                    cursor: phase === 'typing' ? 'wait' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'background .15s', flexShrink:0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <div style={{
                textAlign:'center', padding:'5px 0 10px',
                fontSize:'10.5px', color:C.textLight, background:C.white, letterSpacing:'.3px',
              }}>
                Te abrimos WhatsApp con tu mensaje listo
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        className="wa-fab-btn"
        onClick={() => open ? setOpen(false) : openChat()}
        title="Escribinos por WhatsApp"
        aria-label={open ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp'}
        aria-expanded={open}
        type="button"
        style={{
          position:'fixed',
          bottom: isMobile ? '16px' : '24px',
          right: isMobile ? '16px' : '24px',
          zIndex:1000,
          width: isMobile ? 56 : 58, height: isMobile ? 56 : 58, borderRadius:'50%',
          background:'#25D366', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 6px 24px rgba(37,211,102,.5)',
          transition:'transform .2s, box-shadow .2s',
        }}
      >
        {/* Pulse ring */}
        {!open && (
          <div aria-hidden="true" style={{
            position:'absolute', width:'100%', height:'100%', borderRadius:'50%',
            background:'rgba(37,211,102,.45)',
            animation:'wa-pulse 2s infinite',
            pointerEvents:'none',
          }} />
        )}
        {/* Badge */}
        {badge && !open && (
          <div aria-hidden="true" style={{
            position:'absolute', top:-3, right:-3,
            width:18, height:18, borderRadius:'50%',
            background:'#ef4444', color:'#fff',
            fontSize:'10px', fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center',
            border:`2px solid #fff`,
            animation:'wa-badge 1.5s 3s ease-in-out 3',
          }}>1</div>
        )}
        <WhatsAppIcon size={isMobile ? 24 : 28} color="white" />
      </button>
    </>
  )
}
