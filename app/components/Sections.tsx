'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { C, stats } from './constants'
import { CountUp, GlowCard } from './ui'
import { Reveal } from './Reveal'
import { useProductos } from '@/lib/useProductos'
import { useCategorias } from '@/lib/useCategorias'
import { useBreakpoint } from '@/lib/hooks'

type CategoriaData = {
  nombre: string
  emoji: string
  imagen_url: string | null
  count: number
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
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 220px"
          onError={() => setImgError(true)}
          style={{ objectFit: 'cover' }}
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
              padding: isMobile ? '20px 10px' : '44px 24px',
              borderRight: !isLastInRow ? '1px solid rgba(255,255,255,0.1)' : 'none',
              borderBottom: isBottomRow ? 'none' : isMobile && i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <div style={{ fontWeight: 800, fontSize: isMobile ? '30px' : '46px', color: C.gold, lineHeight: 1, marginBottom: isMobile ? '4px' : '8px', letterSpacing: '-0.02em' }}>
                {'display' in s ? (
                  <svg width={isMobile ? 36 : 48} height={isMobile ? 36 : 48} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block' }}>
                    <circle cx="12" cy="12" r="11" stroke={C.gold} strokeWidth="1.5" fill="none" opacity="0.25" />
                    <polyline points="6.5 12.5 10 16 17.5 8.5" stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : <CountUp target={s.value} suffix={s.suffix} />}
              </div>
              <div style={{ fontSize: isMobile ? '11.5px' : '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.3 }}>{s.label}</div>
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = 'qc-cat-modal-title'

  // Escape + body scroll lock + focus restore
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const root = dialogRef.current
        if (!root) return
        const focusables = root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Move focus into dialog
    requestAnimationFrame(() => dialogRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <>
      <div onClick={onClose} aria-hidden="true" style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,35,0.72)', backdropFilter: 'blur(5px)', zIndex: 200 }} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: C.white, borderRadius: '20px',
          padding: isMobile ? '20px 16px' : '36px',
          width: '92%', maxWidth: '820px',
          maxHeight: isMobile ? '90vh' : '85vh',
          overflowY: 'auto',
          zIndex: 201, boxShadow: '0 40px 100px rgba(0,0,0,0.28)',
          animation: 'qcModalIn 0.25s ease both',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '16px' : '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div aria-hidden="true" style={{ width: '44px', height: '44px', borderRadius: '12px', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '24px', position: 'relative', overflow: 'hidden' }}>
              {cat.imagen_url ? (
                <Image src={cat.imagen_url} alt="" fill sizes="44px" style={{ objectFit: 'cover' }} />
              ) : (
                <span>{cat.emoji}</span>
              )}
            </div>
            <div>
              <h3 id={titleId} style={{ fontWeight: 800, fontSize: isMobile ? '16px' : '20px', color: C.text, margin: 0 }}>{cat.nombre}</h3>
              <div style={{ fontSize: '12px', color: C.textMid }}>{catProducts.length} productos</div>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Cerrar"
            style={{
              background: C.offWhite, border: `1px solid ${C.border}`, width: '44px', height: '44px',
              borderRadius: '10px', cursor: 'pointer', fontSize: '22px', color: C.textMid,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: isMobile ? '10px' : '14px',
        }}>
          {catProducts.map(product => (
            <Link key={product.id} href={`/productos/${product.id}`} style={{ textDecoration: 'none' }}>
              <div className="qc-card-lift-sm" style={{ borderRadius: '14px', overflow: 'hidden', position: 'relative' }}>
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
    </>
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function Categories() {
  const { isMobile } = useBreakpoint()
  const [openCat, setOpenCat] = useState<CategoriaData | null>(null)
  const { categorias: categoriasRaw } = useCategorias()
  const categorias: CategoriaData[] = categoriasRaw.map(c => ({
    nombre: c.nombre,
    emoji: c.emoji || '📦',
    imagen_url: c.imagen_url || null,
    count: 0,
  }))

  return (
    <section id="categorias" style={{ padding: isMobile ? '56px 20px' : '96px 48px', background: C.offWhite }}>
      <Reveal style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            <div key={i} onClick={() => setOpenCat(cat)} className="qc-card-lift" style={{
              background: C.white,
              padding: isMobile ? '18px 12px' : '24px 16px',
              textAlign: 'center', borderRadius: '16px',
            }}>
              <div aria-hidden="true" style={{ width: '64px', height: '64px', borderRadius: '14px', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', position: 'relative', overflow: 'hidden' }}>
                {cat.imagen_url ? (
                  <Image src={cat.imagen_url} alt="" fill sizes="64px" style={{ objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '36px', lineHeight: 1 }}>{cat.emoji}</span>
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: C.text, marginBottom: '4px', lineHeight: 1.25 }}>{cat.nombre}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {openCat && <CategoryModal cat={openCat} onClose={() => setOpenCat(null)} />}
    </section>
  )
}

// ─── Products ─────────────────────────────────────────────────────────────────
export function Products() {
  const { isMobile, isTablet } = useBreakpoint()
  const { productos } = useProductos()
  const { categorias } = useCategorias()
  const [activeCat, setActiveCat] = useState('Todos')
  const categoriaList = categorias.map(c => c.nombre)

  const filtered = activeCat === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === activeCat)
  const shown = filtered.slice(0, 6)

  const gridCols = isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)'

  return (
    <section id="productos" style={{ padding: isMobile ? '56px 20px' : '96px 48px', background: C.white }}>
      <Reveal style={{ maxWidth: '1200px', margin: '0 auto' }}>

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
            WebkitOverflowScrolling: 'touch',
          }}>
            {['Todos', ...categoriaList].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                aria-pressed={activeCat === cat}
                style={{
                  background: activeCat === cat ? C.blue : C.white,
                  border: `1.5px solid ${activeCat === cat ? C.blue : C.border}`,
                  color: activeCat === cat ? 'white' : C.textMid,
                  padding: '10px 16px', minHeight: '40px', borderRadius: '20px',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', transition: 'background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s',
                  boxShadow: activeCat === cat ? '0 4px 12px rgba(43,123,184,0.3)' : 'none',
                  flexShrink: 0,
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? '10px' : '20px', marginBottom: '40px' }}>
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
                    height={isMobile ? 130 : 140}
                  />
                  <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, background: C.blueLight, padding: '2px 8px', borderRadius: '10px', fontSize: '9.5px', color: C.blue, fontWeight: 700, letterSpacing: '0.04em' }}>
                    {product.categoria.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: isMobile ? '10px 12px 14px' : '20px 22px 22px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: isMobile ? '13px' : '15px', color: C.text, marginBottom: '5px', lineHeight: 1.3 }}>{product.nombre}</h3>
                  <div style={{ fontSize: isMobile ? '11.5px' : '13px', color: C.gold, fontWeight: 600 }}>
                    Ver detalles →
                  </div>
                </div>
              </GlowCard>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/productos" className="qc-btn-blue" style={{
            display: 'inline-block',
            padding: '13px 32px', borderRadius: '8px', textDecoration: 'none',
            fontWeight: 600, fontSize: '14px',
          }}>
            Ver todo el catálogo →
          </Link>
        </div>
      </Reveal>
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
            <div key={i} className="qc-card-glass" style={{ borderRadius: '16px', padding: isMobile ? '20px 18px' : '28px 24px' }}>
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