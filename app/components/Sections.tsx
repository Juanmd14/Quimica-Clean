'use client'

import { useState } from 'react'
import Link from 'next/link'
import { C, stats, categories, products } from './constants'
import { CountUp, GlowCard } from './ui'

// ─── Stats ────────────────────────────────────────────────────────────────────
export function Stats() {
  return (
    <section style={{ background: C.blueDark }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
      }} className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '44px 24px',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}>
            <div style={{ fontWeight: 800, fontSize: '46px', color: C.gold, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
              <CountUp target={s.value} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function Categories() {
  return (
    <section style={{ padding: '96px 48px', background: C.offWhite }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '52px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, color: C.blue, marginBottom: '14px',
          }}>
            <span style={{ width: '24px', height: '2px', background: C.blue, display: 'inline-block' }} />
            Lo que ofrecemos
          </div>
          <h2 style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: '34px', color: C.text, letterSpacing: '-0.02em' }}>
            Categorías de productos
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '16px' }}>
          {categories.map((cat, i) => (
            <Link key={i} href={`/productos?cat=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: C.white, border: `1.5px solid ${C.border}`,
                padding: '28px 20px', textAlign: 'center', borderRadius: '14px',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.blue; d.style.transform = 'translateY(-5px)'; d.style.boxShadow = '0 16px 32px rgba(43,123,184,0.1)' }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = C.border; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>{cat.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: C.text, marginBottom: '5px' }}>{cat.name}</div>
                <div style={{ fontSize: '12px', color: C.blue, fontWeight: 600 }}>{cat.count} productos</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Products ─────────────────────────────────────────────────────────────────
export function Products() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const filtered = activeCategory === 'Todos' ? products : products.filter(p => p.category === activeCategory)

  return (
    <section id="productos" style={{ padding: '96px 48px', background: C.white }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase' as const, color: C.gold, marginBottom: '14px',
            }}>
              <span style={{ width: '24px', height: '2px', background: C.gold, display: 'inline-block' }} />
              Catálogo
            </div>
            <h2 style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: '34px', color: C.text, letterSpacing: '-0.02em' }}>
              Productos destacados
            </h2>
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Todos', ...categories.map(c => c.name)].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                background: activeCategory === cat ? C.blue : C.white,
                border: `1.5px solid ${activeCategory === cat ? C.blue : C.border}`,
                color: activeCategory === cat ? 'white' : C.textMid,
                padding: '8px 18px', borderRadius: '20px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(43,123,184,0.3)' : 'none',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '40px' }} className="products-grid">
          {filtered.map(product => (
            <GlowCard key={product.id} style={{ padding: '0' }}>
              {/* Imagen placeholder — reemplazá con <Image src={product.img} ... /> */}
              <div style={{
                height: '160px', borderRadius: '14px 14px 0 0', overflow: 'hidden',
                background: `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px',
                position: 'relative',
              }}>
                {product.emoji}
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  background: C.blueLight, padding: '3px 10px', borderRadius: '12px',
                  fontSize: '11px', color: C.blue, fontWeight: 600, letterSpacing: '0.05em',
                }}>{product.category.toUpperCase()}</div>
              </div>

              <div style={{ padding: '22px 24px 24px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '17px', color: C.text, marginBottom: '8px' }}>{product.name}</h3>
                <p style={{ fontSize: '13px', color: C.textMid, lineHeight: 1.65, marginBottom: '20px' }}>{product.desc}</p>
                <Link href={`/productos?cat=${encodeURIComponent(product.category)}`} style={{ fontSize: '13px', color: C.gold, fontWeight: 600, textDecoration: 'none' }}>
                  Ver más productos →
                </Link>
              </div>
            </GlowCard>
          ))}
        </div>

        {/* CTA Ver todos */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/productos" style={{ 
            display: 'inline-block',
            background: C.blue,
            color: 'white',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = C.blueDark
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = C.blue
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
          }}>
            Ver todos los productos →
          </Link>
        </div>
      </div>
    </section>
  )
}