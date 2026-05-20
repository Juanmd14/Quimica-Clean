'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { C, categories } from '@/app/components/constants'
import { GlowCard } from '@/app/components/ui'

interface Producto {
  id: number
  nombre: string
  categoria: string
  descripcion: string | null
  color: string | null
  color2: string | null
  emoji: string | null
  imagen_url: string | null
  activo: boolean
  orden: number
}

function ProductMedia({ p }: { p: Producto }) {
  const bg = p.color2
    ? `linear-gradient(135deg, ${p.color} 50%, ${p.color2} 50%)`
    : p.color || `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`

  if (p.imagen_url) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image
          src={p.imagen_url}
          alt={p.nombre}
          fill
          sizes="(max-width: 768px) 50vw, 240px"
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '44px',
    }}>
      {p.emoji || '🧴'}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: C.white, borderRadius: '14px', overflow: 'hidden', border: `1.5px solid ${C.border}` }}>
      <div className="qc-skeleton" style={{ height: '120px', borderRadius: 0 }} />
      <div style={{ padding: '18px 20px 20px' }}>
        <div className="qc-skeleton" style={{ height: '14px', width: '85%', marginBottom: '10px' }} />
        <div className="qc-skeleton" style={{ height: '14px', width: '60%', marginBottom: '14px' }} />
        <div className="qc-skeleton" style={{ height: '12px', width: '40%' }} />
      </div>
    </div>
  )
}

function CategoryPageContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('cat') || 'Todos'

  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const url = activeCategory === 'Todos'
          ? '/api/products'
          : `/api/products?category=${activeCategory}`
        const res = await fetch(url)
        const result = await res.json()
        if (result.success) {
          setProductos(result.data || [])
        } else {
          setError('Error al cargar productos')
        }
      } catch {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeCategory])

  const cats = ['Todos', ...categories.map(c => c.name)]

  return (
    <div style={{ minHeight: '100vh', background: C.offWhite }}>

      {/* Header */}
      <div className="qc-page-pad" style={{ background: C.blueDark, padding: '40px 48px', textAlign: 'center' }}>
        <Link href="/" style={{ color: C.gold, textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
          ← Volver al inicio
        </Link>
        <h1 className="qc-h1" style={{ fontWeight: 700, color: 'white', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          {activeCategory === 'Todos' ? 'Todos los Productos' : activeCategory}
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
          Catálogo completo de productos Química Clean
        </p>
      </div>

      {/* Filtros */}
      <div className="qc-page-pad" style={{ background: C.white, padding: '20px 48px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar producto..."
            style={{
              width: '100%', maxWidth: '360px', padding: '10px 16px',
              border: `1.5px solid ${C.border}`, borderRadius: '24px',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: C.text,
              outline: 'none', marginBottom: '16px', display: 'block',
              boxSizing: 'border-box' as const,
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cats.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setBusqueda('') }} style={{
                background: activeCategory === cat ? C.blue : C.white,
                border: `1.5px solid ${activeCategory === cat ? C.blue : C.border}`,
                color: activeCategory === cat ? 'white' : C.textMid,
                padding: '8px 16px', borderRadius: '20px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', transition: 'background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="qc-page-pad qc-section-pad" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div className="qc-grid-cards">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#e74c3c', background: 'rgba(231,76,60,0.08)', borderRadius: '12px', border: '1px solid rgba(231,76,60,0.2)' }}>
            {error}
          </div>
        ) : (
          <>
            {(() => {
              const filtrados = productos.filter(p =>
                p.nombre.toLowerCase().includes(busqueda.toLowerCase())
              )
              return filtrados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: C.textMid }}>
                  <p>{busqueda ? `Sin resultados para "${busqueda}"` : 'No hay productos en esta categoría'}</p>
                  <Link href="/" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>Volver al inicio</Link>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '28px', fontSize: '14px', color: C.textMid }}>
                    <strong>{filtrados.length}</strong> producto(s) encontrado(s)
                    {busqueda && <span style={{ marginLeft: '8px' }}>para &quot;<strong>{busqueda}</strong>&quot;</span>}
                  </div>
                  <div className="qc-grid-cards">
                    {filtrados.map(p => (
                      <Link key={p.id} href={`/productos/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <GlowCard style={{ padding: 0, height: '100%' }}>
                          <div style={{ height: '120px', borderRadius: '14px 14px 0 0', overflow: 'hidden', position: 'relative' }}>
                            <ProductMedia p={p} />
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: C.blueLight, padding: '3px 10px', borderRadius: '10px', fontSize: '10px', color: C.blue, fontWeight: 700 }}>
                              {p.categoria.toUpperCase()}
                            </div>
                          </div>
                          <div style={{ padding: '18px 20px 20px' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '15px', color: C.text, margin: '0 0 14px', lineHeight: 1.35 }}>
                              {p.nombre}
                            </h3>
                            <span style={{ fontSize: '13px', color: C.gold, fontWeight: 600 }}>
                              Ver detalle →
                            </span>
                          </div>
                        </GlowCard>
                      </Link>
                    ))}
                  </div>
                </>
              )
            })()}
          </>
        )}
      </div>

      {/* CTA */}
      <div className="qc-page-pad qc-section-pad" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, textAlign: 'center' }}>
        <h2 className="qc-h2" style={{ fontWeight: 700, color: 'white', marginBottom: '10px' }}>
          ¿No encontrás lo que buscas?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>
          Contactanos y te asesoramos
        </p>
        <Link href="/#contacto" style={{ display: 'inline-block', background: 'white', color: C.gold, padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Ir a Contacto
        </Link>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px 0' }}>Cargando...</div>}>
      <CategoryPageContent />
    </Suspense>
  )
}
