'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { C, stats } from './constants'
import { CountUp, GlowCard } from './ui'
import { useProductos } from '@/lib/useProductos'

type CategoriaData = {
  nombre: string
  emoji: string
  count: number
}

const fallbackCategories: CategoriaData[] = [
  { nombre: 'Jabones', emoji: '🧴', count: 7 },
  { nombre: 'Suavizantes', emoji: '🌸', count: 3 },
  { nombre: 'Detergentes', emoji: '🧼', count: 3 },
  { nombre: 'Desengrasantes', emoji: '🧹', count: 8 },
  { nombre: 'Desinfectantes', emoji: '🦠', count: 9 },
  { nombre: 'Pisos', emoji: '🏠', count: 4 },
  { nombre: 'Piletas', emoji: '🏊', count: 7 },
  { nombre: 'Automotor', emoji: '🚗', count: 4 },
  { nombre: 'Hogar', emoji: '🏡', count: 5 },
  { nombre: 'Concentrados', emoji: '🔬', count: 10 },
  { nombre: 'Materia Prima', emoji: '⚗️', count: 20 },
  { nombre: 'Bouquets', emoji: '🌺', count: 21 },
  { nombre: 'Contenedores', emoji: '📦', count: 6 },
  { nombre: 'Jabon de manos', emoji: '🧼', count: 5 },
]

// ─── Breakpoint hook ──────────────────────────────────────────────────────────
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

// ─── SVG icons por categoría ──────────────────────────────────────────────────
function CategoryIcon({ name, size = 28, color = C.blue }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'Suavizantes':
      return <svg {...s}><path d="M12 2C8 2 5 5 5 9c0 3 2 5 4 7l3 4 3-4c2-2 4-4 4-7 0-4-3-7-7-7z" /><path d="M9 9c0-1.7 1.3-3 3-3" /></svg>
    case 'Jabones':
      return <svg {...s}><circle cx="12" cy="10" r="4" /><path d="M8 10c0 0-3 1-3 5s2 5 7 5 7-1 7-5-3-5-3-5" /><path d="M12 6V3" /><circle cx="12" cy="2.5" r="0.5" fill={color} /></svg>
    case 'Detergentes':
      return <svg {...s}><path d="M8 3h8l1 4H7L8 3z" /><path d="M7 7v11a2 2 0 002 2h6a2 2 0 002-2V7" /><path d="M10 11h4" /><path d="M10 15h4" /></svg>
    case 'Desengrasantes':
      return <svg {...s}><path d="M5 3h14" /><path d="M5 3v2l2 2v12a1 1 0 001 1h8a1 1 0 001-1V7l2-2V3" /><path d="M9 11l2 2 4-4" /></svg>
    case 'Desinfectantes':
      return <svg {...s}><path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4z" /><path d="M9 12l2 2 4-4" /></svg>
    case 'Pisos':
      return <svg {...s}><rect x="2" y="14" width="9" height="8" rx="1" /><rect x="13" y="14" width="9" height="8" rx="1" /><rect x="2" y="4" width="9" height="8" rx="1" /><rect x="13" y="4" width="9" height="8" rx="1" /></svg>
    case 'Piletas':
      return <svg {...s}><path d="M2 12c1-2 2-3 4-3s3 2 4 2 3-2 4-2 3 1 4 3" /><path d="M2 17c1-2 2-3 4-3s3 2 4 2 3-2 4-2 3 1 4 3" /><path d="M6 5h12v4H6z" /><path d="M9 5V3m6 2V3" /></svg>
    case 'Automotor':
      return <svg {...s}><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14l3 5v5a2 2 0 01-2 2h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M7 12V7" /></svg>
    case 'Hogar':
      return <svg {...s}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>
    case 'Concentrados':
      return <svg {...s}><path d="M9 3h6m-5 0v4l-4 8a2 2 0 001.73 3h8.54A2 2 0 0018 15L14 7V3" /><line x1="6.5" y1="13" x2="17.5" y2="13" /><circle cx="12" cy="18" r="1" fill={color} /></svg>
    case 'Materia Prima':
      return <svg {...s}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" /></svg>
    case 'Contenedores':
      return <svg {...s}><path d="M2 6l10-4 10 4v12l-10 4L2 18V6z" /><path d="M12 2v18" /><path d="M2 6l10 4 10-4" /></svg>
    case 'Bouquets':
      return <svg {...s}><path d="M12 2C8 2 5 5 5 9c0 2.5 1.5 4.5 3 6l4 5 4-5c1.5-1.5 3-3.5 3-6 0-4-3-7-7-7z" /><circle cx="12" cy="9" r="2" /></svg>
    default:
      return <svg {...s}><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" /></svg>
  }
}

// ─── ProductThumb ─────────────────────────────────────────────────────────────
function ProductThumb({ id, imageUrl, color, color2, emoji, height = 140 }: {
  id: number; imageUrl?: string; color?: string; color2?: string; emoji?: string; height?: number
}) {
  const [imgError, setImgError] = useState(false)
  const bg = color2
    ? `linear-gradient(135deg, ${color} 50%, ${color2} 50%)`
    : color || `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`
  const src = imageUrl || `/products/${id}.jpg`

  return (
    <div style={{ height, position: 'relative', overflow: 'hidden', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!imgError && (
        <img
          src={src}
          alt="Producto"
          loading="lazy"
          onError={() => setImgError(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {imgError && emoji && (
        <span style={{ fontSize: height > 100 ? '42px' : '28px', position: 'relative', zIndex: 1 }}>
          {emoji}
        </span>
      )}
    </div>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export function Stats() {
  const { isMobile } = useBreakpoint()

  return (
    <section style={{ background: C.blueDark }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      }}>
        {stats.map((s, i) => {
          const isLastInRow = isMobile ? i % 2 === 1 : i === 3
          const isBottomRow = isMobile && i >= 2
          return (
            <div key={i} style={{
              textAlign: 'center',
              padding: isMobile ? '28px 16px' : '44px 24px',
              borderRight: !isLastInRow ? '1px solid rgba(255,255,255,0.1)' : 'none',
              borderBottom: isBottomRow ? 'none' : isMobile && i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <div style={{ fontWeight: 800, fontSize: isMobile ? '36px' : '46px', color: C.gold, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                {'display' in s ? (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block' }}>
                    <circle cx="12" cy="12" r="11" stroke={C.gold} strokeWidth="1.5" fill="none" opacity="0.25" />
                    <polyline points="6.5 12.5 10 16 17.5 8.5" stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : <CountUp target={s.value} suffix={s.suffix} />}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Category Modal ───────────────────────────────────────────────────────────
function CategoryModal({ cat, onClose }: { cat: CategoriaData; onClose: () => void }) {
  const { isMobile } = useBreakpoint()
  const { productos } = useProductos()
  const catProducts = productos.filter(p => p.categoria === cat.nombre)

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,0.72)', backdropFilter: 'blur(5px)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: C.white, borderRadius: '20px',
        padding: isMobile ? '20px 16px' : '36px',
        width: '92%', maxWidth: '820px',
        maxHeight: isMobile ? '90vh' : '85vh',
        overflowY: 'auto',
        zIndex: 201, boxShadow: '0 40px 100px rgba(0,0,0,0.28)',
        animation: 'modalIn 0.25s ease both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '16px' : '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '24px' }}>
              {cat.emoji}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? '16px' : '20px', color: C.text }}>{cat.nombre}</div>
              <div style={{ fontSize: '12px', color: C.textMid }}>{catProducts.length} productos</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: C.offWhite, border: `1px solid ${C.border}`, width: '36px', height: '36px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '20px', color: C.textMid,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: isMobile ? '10px' : '14px',
        }}>
          {catProducts.map(product => (
            <Link key={product.id} href={`/productos/${product.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                border: `1.5px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden',
                transition: 'all 0.22s', position: 'relative', cursor: 'pointer',
              }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.blue; d.style.transform = 'translateY(-3px)'; d.style.boxShadow = '0 10px 28px rgba(43,123,184,0.12)' }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.border; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none' }}
              >
                <ProductThumb
                  id={product.id}
                  imageUrl={product.imagen_url ?? undefined}
                  color={product.color ?? undefined}
                  color2={product.color2 ?? undefined}
                  emoji={product.emoji ?? undefined}
                  height={isMobile ? 64 : 80}
                />
                <div style={{ padding: isMobile ? '10px 12px 12px' : '14px 16px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: isMobile ? '12px' : '14px', color: C.text, marginBottom: '4px', lineHeight: 1.3 }}>{product.nombre}</div>
                  <div style={{ fontSize: '12px', color: C.gold, fontWeight: 600 }}>
                    Ver detalles →
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
  const { isMobile } = useBreakpoint()
  const [openCat, setOpenCat] = useState<CategoriaData | null>(null)
  const [categorias, setCategorias] = useState<CategoriaData[]>(fallbackCategories)

  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          const cats = data.data.map((c: { nombre: string; emoji: string | null }) => ({
            nombre: c.nombre,
            emoji: c.emoji || '📦',
            count: 0,
          }))
          setCategorias(cats)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="categorias" style={{ padding: isMobile ? '56px 20px' : '96px 48px', background: C.offWhite }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: isMobile ? '32px' : '52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.blue, marginBottom: '14px' }}>
            <span style={{ width: '24px', height: '2px', background: C.blue, display: 'inline-block' }} />
            Lo que ofrecemos
          </div>
          <h2 style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: isMobile ? '26px' : '34px', color: C.text, letterSpacing: '-0.02em' }}>
            Categorías de productos
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(160px, 1fr))', gap: isMobile ? '10px' : '14px' }}>
          {categorias.map((cat, i) => (
            <div key={i} onClick={() => setOpenCat(cat)} style={{
              background: C.white, border: `1.5px solid ${C.border}`,
              padding: isMobile ? '18px 12px' : '24px 16px',
              textAlign: 'center', borderRadius: '16px',
              cursor: 'pointer', transition: 'all 0.25s',
            }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.blue; d.style.transform = 'translateY(-5px)'; d.style.boxShadow = '0 16px 36px rgba(43,123,184,0.1)' }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.border; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none' }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px' }}>
                {cat.emoji}
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: C.text, marginBottom: '4px', lineHeight: 1.25 }}>{cat.nombre}</div>
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
  const { isMobile, isTablet } = useBreakpoint()
  const { productos } = useProductos()
  const [activeCat, setActiveCat] = useState('Todos')
  const filtered = activeCat === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === activeCat)
  const shown = filtered.slice(0, 6)

  const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)'

  return (
    <section id="productos" style={{ padding: isMobile ? '56px 20px' : '96px 48px', background: C.white }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.gold, marginBottom: '14px' }}>
              <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
              Catálogo
            </div>
            <h2 style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: isMobile ? '26px' : '34px', color: C.text, letterSpacing: '-0.02em' }}>Productos destacados</h2>
          </div>

          <div style={{
            display: 'flex', gap: '8px',
            overflowX: isMobile ? 'auto' : 'visible',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            width: isMobile ? '100%' : 'auto',
            paddingBottom: isMobile ? '4px' : '0',
            WebkitOverflowScrolling: 'touch' as any,
          }}>
            {['Todos', ...categorias.map(c => c.nombre)].map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{
                background: activeCat === cat ? C.blue : C.white,
                border: `1.5px solid ${activeCat === cat ? C.blue : C.border}`,
                color: activeCat === cat ? 'white' : C.textMid,
                padding: '7px 14px', borderRadius: '20px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeCat === cat ? '0 4px 12px rgba(43,123,184,0.3)' : 'none',
                flexShrink: 0,
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? '14px' : '20px', marginBottom: '40px' }}>
          {shown.map(product => (
            <Link key={product.id} href={`/productos/${product.id}`} style={{ textDecoration: 'none' }}>
              <GlowCard style={{ padding: '0' }}>
                <div style={{ borderRadius: '14px 14px 0 0', overflow: 'hidden', position: 'relative' }}>
                  <ProductThumb
                    id={product.id}
                    imageUrl={product.imagen_url ?? undefined}
                    color={product.color ?? undefined}
                    color2={product.color2 ?? undefined}
                    emoji={product.emoji ?? undefined}
                    height={isMobile ? 120 : 140}
                  />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, background: C.blueLight, padding: '2px 9px', borderRadius: '10px', fontSize: '10px', color: C.blue, fontWeight: 700, letterSpacing: '0.04em' }}>
                    {product.categoria.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: isMobile ? '14px 16px 18px' : '20px 22px 22px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '15px', color: C.text, marginBottom: '7px', lineHeight: 1.3 }}>{product.nombre}</h3>
                  <div style={{ fontSize: '13px', color: C.gold, fontWeight: 600 }}>
                    Ver detalles →
                  </div>
                </div>
              </GlowCard>
            </Link>
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
  const { isMobile } = useBreakpoint()

  return (
    <section style={{ padding: isMobile ? '56px 20px' : '96px 48px', background: `linear-gradient(160deg, ${C.blueDark} 0%, #0d1f35 100%)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${C.gold}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, ${C.blue}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.gold, marginBottom: '14px' }}>
            <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
            Línea propia
            <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
          </div>
          <h2 style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: isMobile ? '28px' : '38px', color: 'white', letterSpacing: '-0.025em', marginBottom: '14px' }}>
            Somos <span style={{ color: C.gold }}>Fabricantes</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
            Producimos nuestra propia línea de productos con fórmulas probadas y stock permanente.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {fabricantes.map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: isMobile ? '20px 18px' : '28px 24px', transition: 'all 0.3s', cursor: 'default', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(255,255,255,0.09)'; d.style.borderColor = `${C.gold}55`; d.style.transform = 'translateY(-5px)'; d.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)` }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(255,255,255,0.05)'; d.style.borderColor = 'rgba(255,255,255,0.1)'; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(231,167,63,0.12)', border: '1px solid rgba(231,167,63,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '14px' }}>
                {item.emoji}
              </div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'white', marginBottom: '6px' }}>{item.name}</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: C.gold, fontWeight: 600 }}>
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