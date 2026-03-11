'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { C } from '@/app/components/constants'
import { GlowCard } from '@/app/components/ui'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  image_url: string
  stock: number
}

export default function CategoryPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('cat') || 'Todos'
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState(categoryParam)

  // Cargar productos de la API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const url = activeCategory === 'Todos' 
          ? '/api/products' 
          : `/api/products?category=${activeCategory}`
        
        const response = await fetch(url)
        const result = await response.json()
        
        if (result.success) {
          setProducts(result.data || [])
        } else {
          setError('Error al cargar productos')
        }
      } catch (err) {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [activeCategory])

  const categories = ['Todos', 'Contenedores', 'Bidones', 'Bidones de 5L', 'Otros']
  const filteredProducts = activeCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', background: C.offWhite }}>
      {/* Header */}
      <div style={{ background: C.blueDark, padding: '40px 48px', textAlign: 'center' }}>
        <Link href="/" style={{ 
          color: C.gold, 
          textDecoration: 'none', 
          fontSize: '14px', 
          marginBottom: '20px', 
          display: 'inline-block',
          fontWeight: '600'
        }}>
          ← Volver al inicio
        </Link>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: '700', 
          color: 'white', 
          margin: '20px 0',
          letterSpacing: '-0.02em'
        }}>
          {activeCategory === 'Todos' ? 'Todos los Productos' : activeCategory}
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255,255,255,0.7)', 
          marginBottom: '0'
        }}>
          Explora nuestro catálogo completo de {activeCategory.toLowerCase()}
        </p>
      </div>

      {/* Filtros */}
      <div style={{ 
        background: C.white, 
        padding: '24px 48px', 
        borderBottom: `1px solid ${C.border}`,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? C.blue : C.white,
                border: `1.5px solid ${activeCategory === cat ? C.blue : C.border}`,
                color: activeCategory === cat ? 'white' : C.textMid,
                padding: '10px 20px', 
                borderRadius: '20px',
                fontFamily: 'DM Sans, sans-serif', 
                fontSize: '14px', 
                fontWeight: '500',
                cursor: 'pointer', 
                transition: 'all 0.2s',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(43,123,184,0.3)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Productos */}
      <div style={{ padding: '56px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: C.textMid }}>
            <p style={{ fontSize: '16px' }}>Cargando productos...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0', 
            color: '#e74c3c',
            background: 'rgba(231,76,60,0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(231,76,60,0.2)'
          }}>
            <p style={{ fontSize: '16px' }}>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0', 
            color: C.textMid
          }}>
            <p style={{ fontSize: '16px' }}>No hay productos en esta categoría</p>
            <Link href="/" style={{ 
              color: C.blue, 
              textDecoration: 'none',
              fontWeight: '600',
              marginTop: '16px',
              display: 'inline-block'
            }}>
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <div style={{ 
              marginBottom: '32px',
              fontSize: '14px',
              color: C.textMid
            }}>
              Se encontraron <strong>{filteredProducts.length}</strong> producto(s)
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '24px' 
            }}>
              {filteredProducts.map(product => (
                <GlowCard key={product.id} style={{ padding: '0', height: '100%' }}>
                  {/* Imagen */}
                  <div style={{
                    height: '200px', 
                    borderRadius: '14px 14px 0 0', 
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '64px',
                    position: 'relative',
                  }}>
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      '📦'
                    )}
                    <div style={{
                      position: 'absolute', 
                      top: '12px', 
                      left: '12px',
                      background: C.blueLight, 
                      padding: '6px 12px', 
                      borderRadius: '12px',
                      fontSize: '11px', 
                      color: C.blue, 
                      fontWeight: '600', 
                      letterSpacing: '0.05em',
                    }}>
                      {product.category.toUpperCase()}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ 
                      fontWeight: '700', 
                      fontSize: '18px', 
                      color: C.text, 
                      marginBottom: '8px',
                      marginTop: '0'
                    }}>
                      {product.name}
                    </h3>
                    
                    <p style={{ 
                      fontSize: '13px', 
                      color: C.textMid, 
                      lineHeight: 1.65, 
                      marginBottom: '16px',
                      flex: 1
                    }}>
                      {product.description}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: C.gold 
                      }}>
                        ${product.price.toFixed(2)}
                      </div>
                      <div style={{ 
                        fontSize: '12px',
                        color: product.stock > 0 ? '#27ae60' : '#e74c3c',
                        fontWeight: '600',
                        background: product.stock > 0 ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                      </div>
                    </div>

                    <a href="#contacto" style={{ 
                      fontSize: '13px', 
                      color: C.gold, 
                      fontWeight: '600', 
                      textDecoration: 'none',
                      display: 'inline-block',
                      marginTop: 'auto'
                    }}>
                      Consultar disponibilidad →
                    </a>
                  </div>
                </GlowCard>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div style={{
        background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
        padding: '48px', 
        textAlign: 'center',
        margin: '40px 0 0 0'
      }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: 'white',
          marginBottom: '12px',
          letterSpacing: '-0.02em'
        }}>
          ¿No encontrás lo que buscas?
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255,255,255,0.85)',
          marginBottom: '24px'
        }}>
          Contactanos y te asesoramos sobre otros productos disponibles
        </p>
        <a href="#contacto" style={{ 
          display: 'inline-block',
          background: 'white',
          color: C.gold,
          padding: '12px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'}
        >
          Ir a Contacto
        </a>
      </div>
    </div>
  )
}
