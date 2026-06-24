'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { C } from './constants'

// ─── WhatsApp SVG icon ────────────────────────────────────────────────────────
export function WhatsAppIcon({ size = 22, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ─── GlowCard: card con spotlight que sigue el cursor ─────────────────────────
export function GlowCard({
  children, style = {}, glowColor = C.blue,
}: {
  children: React.ReactNode; style?: React.CSSProperties; glowColor?: string
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        background: C.white,
        border: `1.5px solid ${hovered ? `${glowColor}44` : C.border}`,
        borderRadius: '14px',
        transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 44px ${glowColor}18` : 'none',
        ...style,
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', pointerEvents: 'none', zIndex: 0,
          width: '220px', height: '220px', borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor}1a 0%, transparent 70%)`,
          left: pos.x - 110, top: pos.y - 110,
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${glowColor}, ${C.gold})`,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.35s ease', transformOrigin: 'left',
      }} />
    </div>
  )
}

// ─── CountUp: animación de número al entrar en viewport ───────────────────────
export function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let v = 0
      const step = target / 50
      const t = setInterval(() => {
        v += step
        if (v >= target) { setCount(target); clearInterval(t) }
        else setCount(Math.floor(v))
      }, 30)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return <div ref={ref}>{count}{suffix}</div>
}

// ─── RevealText: palabras que entran animadas ──────────────────────────────────
export function RevealText({ children, delay = 0 }: { children: string; delay?: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])

  return (
    <span>
      {children.split(' ').map((word, i) => (
        <span key={i} style={{
          display: 'inline-block',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(18px)',
          transition: `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s`,
          marginRight: '0.28em',
        }}>{word}</span>
      ))}
    </span>
  )
}

// ─── MoleculeCanvas: partículas moleculares animadas ──────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; r: number; opacity: number; isGold: boolean; haloCanvas: HTMLCanvasElement }

function buildHalo(color: string, opacity: number, radius: number): HTMLCanvasElement {
  const size = Math.ceil(radius * 6)
  const off = document.createElement('canvas')
  off.width = off.height = size
  const c = off.getContext('2d')!
  const cx = size / 2, cy = size / 2
  const grad = c.createRadialGradient(cx, cy, 0, cx, cy, radius * 3)
  grad.addColorStop(0, `${color.replace(')', `,${opacity})`).replace('rgb', 'rgba')}`)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  c.fillStyle = grad
  c.fillRect(0, 0, size, size)
  return off
}

export function MoleculeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const visibleRef = useRef<boolean>(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Respect reduced-motion + low-end heuristics
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    if (reduceMotion) return

    const COUNT = isMobile ? 18 : 38
    const LINK_DIST = isMobile ? 90 : 110

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    particles.current = Array.from({ length: COUNT }, () => {
      const r = Math.random() * 3 + 2
      const opacity = Math.random() * 0.5 + 0.15
      const isGold = r > 4
      const color = isGold ? 'rgb(231,167,63)' : 'rgb(43,123,184)'
      return {
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r, opacity, isGold,
        haloCanvas: buildHalo(color, opacity, r),
      }
    })

    // Pausar cuando el canvas no se ve
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting },
      { threshold: 0 },
    )
    io.observe(canvas)

    const draw = () => {
      if (visibleRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const pts = particles.current

        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
            const d2 = dx * dx + dy * dy
            const link2 = LINK_DIST * LINK_DIST
            if (d2 < link2) {
              const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.15
              ctx.beginPath()
              ctx.strokeStyle = `rgba(43,123,184,${alpha})`
              ctx.lineWidth = 1
              ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke()
            }
          }
        }

        for (let k = 0; k < pts.length; k++) {
          const p = pts[k]
          const halfSize = p.haloCanvas.width / 2
          ctx.drawImage(p.haloCanvas, p.x - halfSize, p.y - halfSize)
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = p.isGold
            ? `rgba(231,167,63,${p.opacity + 0.3})`
            : `rgba(43,123,184,${p.opacity + 0.3})`
          ctx.fill()
          p.x += p.vx; p.y += p.vy
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }

    // Defer animation start to idle time (after LCP)
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    const usingRic = typeof w.requestIdleCallback === 'function'
    const startId = usingRic ? w.requestIdleCallback!(() => draw()) : window.setTimeout(() => draw(), 800)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      io.disconnect()
      if (usingRic && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(startId)
      else clearTimeout(startId)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}