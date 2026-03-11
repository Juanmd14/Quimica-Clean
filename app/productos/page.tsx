'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { C, categories } from '@/app/components/constants'
import { GlowCard } from '@/app/components/ui'

interface Producto {
  id: number
  nombre: string
  categoria: string
  color: string | null
  color2: string | null
  emoji: string | null
  activo: boolean
  orden: number
}

function ColorDot({ color, color2 }: { color?: string | null; color2?: string | null }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: color2
        ? `linear-gradient(135deg, ${color} 50%, ${color2} 50%)`
        : color || `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '48px',
    }}>
      {!color && !color2 ? '🧴' : null}
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
      <div style={{ background: C.blueDark, padding: '40px 48px', textAlign: 'center' }}>
        <Link href="/" style={{ color: C.gold, textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
          ← Volver al inicio
        </Link>
        <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'white', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          {activeCategory === 'Todos' ? 'Todos los Productos' : activeCategory}
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
          Catálogo completo de productos Química Clean
        </p>
      </div>

      {/* Filtros */}
      <div style={{ background: C.white, padding: '20px 48px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: activeCategory === cat ? C.blue : C.white,
              border: `1.5px solid ${activeCategory === cat ? C.blue : C.border}`,
              color: activeCategory === cat ? 'white' : C.textMid,
              padding: '8px 16px', borderRadius: '20px',
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: C.textMid }}>Cargando productos...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#e74c3c', background: 'rgba(231,76,60,0.08)', borderRadius: '12px', border: '1px solid rgba(231,76,60,0.2)' }}>
            {error}
          </div>
        ) : productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: C.textMid }}>
            <p>No hay productos en esta categoría</p>
            <Link href="/" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>Volver al inicio</Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '28px', fontSize: '14px', color: C.textMid }}>
              <strong>{productos.length}</strong> producto(s) encontrado(s)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {productos.map(p => (
                <GlowCard key={p.id} style={{ padding: 0 }}>
                  {/* Color swatch */}
                  <div style={{ height: '120px', borderRadius: '14px 14px 0 0', overflow: 'hidden', position: 'relative' }}>
                    <ColorDot color={p.color} color2={p.color2} />
                    {p.emoji && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px' }}>
                        {p.emoji}
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: C.blueLight, padding: '3px 10px', borderRadius: '10px', fontSize: '10px', color: C.blue, fontWeight: 700 }}>
                      {p.categoria.toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '18px 20px 20px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '15px', color: C.text, margin: '0 0 14px', lineHeight: 1.35 }}>
                      {p.nombre}
                    </h3>
                    <a href="/#contacto" style={{ fontSize: '13px', color: C.gold, fontWeight: 600, textDecoration: 'none' }}>
                      Consultar precio →
                    </a>
                  </div>
                </GlowCard>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, padding: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
          ¿No encontrás lo que buscas?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>
          Contactanos y te asesoramos
        </p>
        <a href="/#contacto" style={{ display: 'inline-block', background: 'white', color: C.gold, padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Ir a Contacto
        </a>
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