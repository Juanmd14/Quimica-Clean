'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { C, stats, categories, products } from './constants'
import { CountUp, GlowCard } from './ui'
import { useProductos } from '@/lib/useProductos'


// ─── SVG icons por categoría ──────────────────────────────────────────────────
function CategoryIcon({ name, size = 28, color = C.blue }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'Suavizantes':
      return <svg {...s}><path d="M12 2C8 2 5 5 5 9c0 3 2 5 4 7l3 4 3-4c2-2 4-4 4-7 0-4-3-7-7-7z"/><path d="M9 9c0-1.7 1.3-3 3-3"/></svg>
    case 'Jabones':
      return <svg {...s}><circle cx="12" cy="10" r="4"/><path d="M8 10c0 0-3 1-3 5s2 5 7 5 7-1 7-5-3-5-3-5"/><path d="M12 6V3"/><circle cx="12" cy="2.5" r="0.5" fill={color}/></svg>
    case 'Detergentes':
      return <svg {...s}><path d="M8 3h8l1 4H7L8 3z"/><path d="M7 7v11a2 2 0 002 2h6a2 2 0 002-2V7"/><path d="M10 11h4"/><path d="M10 15h4"/></svg>
    case 'Desengrasantes':
      return <svg {...s}><path d="M5 3h14"/><path d="M5 3v2l2 2v12a1 1 0 001 1h8a1 1 0 001-1V7l2-2V3"/><path d="M9 11l2 2 4-4"/></svg>
    case 'Desinfectantes':
      return <svg {...s}><path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4z"/><path d="M9 12l2 2 4-4"/></svg>
    case 'Pisos':
      return <svg {...s}><rect x="2" y="14" width="9" height="8" rx="1"/><rect x="13" y="14" width="9" height="8" rx="1"/><rect x="2" y="4" width="9" height="8" rx="1"/><rect x="13" y="4" width="9" height="8" rx="1"/></svg>
    case 'Piletas':
      return <svg {...s}><path d="M2 12c1-2 2-3 4-3s3 2 4 2 3-2 4-2 3 1 4 3"/><path d="M2 17c1-2 2-3 4-3s3 2 4 2 3-2 4-2 3 1 4 3"/><path d="M6 5h12v4H6z"/><path d="M9 5V3m6 2V3"/></svg>
    case 'Automotor':
      return <svg {...s}><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14l3 5v5a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M7 12V7"/></svg>
    case 'Hogar':
      return <svg {...s}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
    case 'Concentrados':
      return <svg {...s}><path d="M9 3h6m-5 0v4l-4 8a2 2 0 001.73 3h8.54A2 2 0 0018 15L14 7V3"/><line x1="6.5" y1="13" x2="17.5" y2="13"/><circle cx="12" cy="18" r="1" fill={color}/></svg>
    case 'Materia Prima':
      return <svg {...s}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
    case 'Contenedores':
      return <svg {...s}><path d="M2 6l10-4 10 4v12l-10 4L2 18V6z"/><path d="M12 2v18"/><path d="M2 6l10 4 10-4"/></svg>
    case 'Bouquets':
      return <svg {...s}><path d="M12 2C8 2 5 5 5 9c0 2.5 1.5 4.5 3 6l4 5 4-5c1.5-1.5 3-3.5 3-6 0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2"/></svg>
    default:
      return <svg {...s}><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export function Stats() {
  return (
    <section style={{ background: C.blueDark }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '44px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            <div style={{ fontWeight: 800, fontSize: '46px', color: C.gold, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {'display' in s ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block' }}>
                  <circle cx="12" cy="12" r="11" stroke={C.gold} strokeWidth="1.5" fill="none" opacity="0.25"/>
                  <polyline points="6.5 12.5 10 16 17.5 8.5" stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : <CountUp target={s.value} suffix={s.suffix} />}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Category Modal ───────────────────────────────────────────────────────────
function CategoryModal({ cat, onClose }: { cat: typeof categories[number]; onClose: () => void }) {
  const catProducts = products.filter(p => p.category === cat.name)
  const hasImages = false

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,0.72)', backdropFilter: 'blur(5px)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: C.white, borderRadius: '20px', padding: '36px',
        width: '92%', maxWidth: '820px', maxHeight: '85vh', overflowY: 'auto',
        zIndex: 201, boxShadow: '0 40px 100px rgba(0,0,0,0.28)',
        animation: 'modalIn 0.25s ease both',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CategoryIcon name={cat.name} size={26} color={C.blue} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '20px', color: C.text }}>{cat.name}</div>
              <div style={{ fontSize: '13px', color: C.textMid }}>
                {catProducts.length} productos
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: C.offWhite, border: `1px solid ${C.border}`, width: '36px', height: '36px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '20px', color: C.textMid,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.border }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.offWhite }}
          >×</button>
        </div>

        {/* Product grid — with optional price badge */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }}>
          {catProducts.map(product => {
            const p = product as any
            return (
              <div key={product.id} style={{
                border: `1.5px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden', transition: 'all 0.22s', position: 'relative',
              }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.blue; d.style.transform = 'translateY(-3px)'; d.style.boxShadow = '0 10px 28px rgba(43,123,184,0.12)' }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.border; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none' }}
              >
                <div style={{
                  height: '80px',
                  background: p.color2
                    ? `linear-gradient(135deg, ${p.color} 50%, ${p.color2} 50%)`
                    : p.color
                      ? p.color
                      : `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
                }}>
                  {!p.color && product.emoji}
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: C.text, marginBottom: '6px', lineHeight: 1.3 }}>{product.name}</div>
                  <p style={{ fontSize: '12px', color: C.textMid, lineHeight: 1.6, marginBottom: '12px' }}>{product.desc}</p>
                  <a href="#contacto" onClick={onClose} style={{ fontSize: '12px', color: C.gold, fontWeight: 600, textDecoration: 'none' }}>
                    Consultar →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -47%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function Categories() {
  const [openCat, setOpenCat] = useState<typeof categories[number] | null>(null)

  return (
    <section style={{ padding: '96px 48px', background: C.offWhite }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.blue, marginBottom: '14px' }}>
            <span style={{ width: '24px', height: '2px', background: C.blue, display: 'inline-block' }} />
            Lo que ofrecemos
          </div>
          <h2 style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: '34px', color: C.text, letterSpacing: '-0.02em' }}>
            Categorías de productos
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
          {categories.map((cat, i) => (
            <div key={i} onClick={() => setOpenCat(cat)} style={{
              background: C.white, border: `1.5px solid ${C.border}`,
              padding: '24px 16px', textAlign: 'center', borderRadius: '16px',
              cursor: 'pointer', transition: 'all 0.25s',
            }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.blue; d.style.transform = 'translateY(-5px)'; d.style.boxShadow = '0 16px 36px rgba(43,123,184,0.1)' }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.border; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <CategoryIcon name={cat.name} size={24} color={C.blue} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: C.text, marginBottom: '4px', lineHeight: 1.25 }}>{cat.name}</div>
              <div style={{ fontSize: '11px', color: C.blue, fontWeight: 600 }}>
                {cat.count} productos
              </div>
            </div>
          ))}
        </div>
      </div>

      {openCat && <CategoryModal cat={openCat} onClose={() => setOpenCat(null)} />}
    </section>
  )
}

// ─── Products ─────────────────────────────────────────────────────────────────
export function Products() {
  const { productos } = useProductos()
  const displayCats = categories
  const [activeCat, setActiveCat] = useState('Todos')
const filtered = activeCat === 'Todos' ? products : products.filter(p => p.category === activeCat)
  const shown = filtered.slice(0, 6)

  return (
    <section id="productos" style={{ padding: '96px 48px', background: C.white }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.gold, marginBottom: '14px' }}>
              <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
              Catálogo
            </div>
            <h2 style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: '34px', color: C.text, letterSpacing: '-0.02em' }}>Productos destacados</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Todos', ...displayCats.map(c => c.name)].map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{
                background: activeCat === cat ? C.blue : C.white,
                border: `1.5px solid ${activeCat === cat ? C.blue : C.border}`,
                color: activeCat === cat ? 'white' : C.textMid,
                padding: '7px 16px', borderRadius: '20px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeCat === cat ? '0 4px 12px rgba(43,123,184,0.3)' : 'none',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '40px' }} className="products-grid">
          {shown.map(product => (
            <GlowCard key={product.id} style={{ padding: '0' }}>
              <div style={{
                height: '140px', borderRadius: '14px 14px 0 0',
                background: `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px',
                position: 'relative',
              }}>
                {product.emoji}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: C.blueLight, padding: '2px 9px', borderRadius: '10px', fontSize: '10px', color: C.blue, fontWeight: 700, letterSpacing: '0.04em' }}>
                  {product.category.toUpperCase()}
                </div>
              </div>
              <div style={{ padding: '20px 22px 22px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '16px', color: C.text, marginBottom: '7px', lineHeight: 1.3 }}>{product.name}</h3>
                <p style={{ fontSize: '13px', color: C.textMid, lineHeight: 1.65, marginBottom: '18px' }}>{product.desc}</p>
                <a href="#contacto" style={{ fontSize: '13px', color: C.gold, fontWeight: 600, textDecoration: 'none' }}>
                  Consultar →
                </a>
              </div>
            </GlowCard>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="#categorias" style={{
            display: 'inline-block', background: C.blue, color: 'white',
            padding: '13px 32px', borderRadius: '8px', textDecoration: 'none',
            fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = C.blueDark; a.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = C.blue; a.style.transform = 'translateY(0)' }}
          >
            Ver todas las categorías →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Fabricantes ──────────────────────────────────────────────────────────────
const fabricantes = [
  { name: 'Pastas', emoji: '🧴', desc: 'Pastas limpiadoras industriales y domésticas de alta efectividad.' },
  { name: 'Kit de Suavizante', emoji: '🌸', desc: 'Kits concentrados para producción de suavizantes textiles perfumados.' },
  { name: 'Esencias Concentradas', emoji: '✨', desc: 'Esencias de alta concentración para perfumar productos de limpieza.' },
  { name: 'Mr. Músculo Concentrado', emoji: '💪', desc: 'Desengrasante potente para cocinas, hornos y superficies difíciles.' },
  { name: 'Limpia Vidrios Concentrado', emoji: '🪟', desc: 'Fórmula concentrada para vidrios y superficies brillantes sin rayas.' },
  { name: 'Creolina', emoji: '🧪', desc: 'Desinfectante clásico de alto poder para uso doméstico e industrial.' },
  { name: 'K-Otrina', emoji: '🛡️', desc: 'Insecticida concentrado de uso profesional para control de plagas.' },
]

export function Fabricantes() {
  return (
    <section style={{ padding: '96px 48px', background: `linear-gradient(160deg, ${C.blueDark} 0%, #0d1f35 100%)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${C.gold}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, ${C.blue}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.gold, marginBottom: '14px' }}>
            <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
            Línea propia
            <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
          </div>
          <h2 style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: '38px', color: 'white', letterSpacing: '-0.025em', marginBottom: '14px' }}>
            Somos <span style={{ color: C.gold }}>Fabricantes</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
            Producimos nuestra propia línea de productos con fórmulas probadas y stock permanente.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {fabricantes.map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px 24px', transition: 'all 0.3s', cursor: 'default', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(255,255,255,0.09)'; d.style.borderColor = `${C.gold}55`; d.style.transform = 'translateY(-5px)'; d.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)` }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(255,255,255,0.05)'; d.style.borderColor = 'rgba(255,255,255,0.1)'; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(231,167,63,0.12)', border: '1px solid rgba(231,167,63,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '18px' }}>
                {item.emoji}
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'white', marginBottom: '8px' }}>{item.name}</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              <div style={{ marginTop: '18px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: C.gold, fontWeight: 600 }}>
                <span style={{ width: '16px', height: '1.5px', background: C.gold, display: 'inline-block' }} />
                Fabricación propia
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}