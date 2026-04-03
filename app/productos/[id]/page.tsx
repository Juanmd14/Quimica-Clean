'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Metadata } from 'next'
import { C, categories } from '@/app/components/constants'
import { useProductos } from '@/lib/useProductos'
import { WhatsAppIcon } from '@/app/components/ui'

// Generate metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = parseInt(params.id, 10)
  
  // Importamos el hook fuera - esto no funcionará en server component
  // En su lugar, retornamos metadata genérica que se sobrescribe en client
  return {
    title: `Producto ${id} | Química Clean`,
    description: 'Producto de Química Clean - Distribuidora mayorista',
  }
}

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

// Hook para actualizar metadata dinámicamente
function useProductMetadata(producto: any) {
  useEffect(() => {
    if (!producto) return
    
    // Actualizar title
    document.title = `${producto.nombre} | Química Clean - Distribuidora Mayorista`
    
    // Actualizar/crear og:title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', `${producto.nombre} | Química Clean`)
    
    // Actualizar/crear og:description
    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    const description = `${producto.nombre} - Distribuidor mayorista de productos de limpieza. Categoría: ${producto.categoria}. Cotizá con Química Clean.`
    ogDesc.setAttribute('content', description)
    
    // Actualizar/crear description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)
    
    // Actualizar/crear og:type
    let ogType = document.querySelector('meta[property="og:type"]')
    if (!ogType) {
      ogType = document.createElement('meta')
      ogType.setAttribute('property', 'og:type')
      document.head.appendChild(ogType)
    }
    ogType.setAttribute('content', 'product')
    
    // Actualizar/crear og:url
    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (!ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrl)
    }
    ogUrl.setAttribute('content', `https://quimica-clean.com/productos/${producto.id}`)
    
    // Actualizar canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `https://quimica-clean.com/productos/${producto.id}`)
    
  }, [producto])
}

function CategoryIcon({ name, size = 32, color = C.blue }: { name: string; size?: number; color?: string }) {
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

export default function ProductoPage() {
  const params = useParams()
  const router = useRouter()
  const { isMobile } = useBreakpoint()
  const { productos, loading } = useProductos()
  
  const id = params?.id ? parseInt(params.id as string, 10) : null
  const producto = id ? productos.find(p => p.id === id) : null
  const categoria = producto ? categories.find(c => c.name === producto.categoria) : null
  
  // Actualizar metadata cuando el producto se carga
  useProductMetadata(producto)
  
  // Productos relacionados (misma categoría)
  const relacionados = producto 
    ? productos.filter(p => p.categoria === producto.categoria && p.id !== producto.id).slice(0, 4)
    : []

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: C.textMid }}>Cargando...</div>
        </div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.offWhite }}>
        <div style={{ maxWidth: '500px', padding: isMobile ? '20px' : '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: C.text, marginBottom: '12px' }}>
            Producto no encontrado
          </h1>
          <p style={{ fontSize: '14px', color: C.textMid, marginBottom: '24px', lineHeight: 1.6 }}>
            El producto que buscas no existe o ha sido descontinuado.
          </p>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{
              background: C.blue, color: 'white', border: 'none',
              padding: '12px 28px', borderRadius: '8px',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
              cursor: 'pointer',
            }}>
              Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Determinar color de fondo
  const bgColor = producto.color2
    ? `linear-gradient(135deg, ${producto.color} 50%, ${producto.color2} 50%)`
    : producto.color || `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`

  return (
    <main style={{ minHeight: '100vh', background: C.offWhite, paddingTop: '88px' }}>
      {/* Breadcrumb */}
      <nav style={{ padding: isMobile ? '16px 20px' : '20px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontSize: '13px', color: C.textMid, display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link href="/" style={{ color: C.blue, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <Link href="/#productos" style={{ color: C.blue, textDecoration: 'none' }}>
            Productos
          </Link>
          <span>/</span>
          <span style={{ color: C.text, fontWeight: 600 }}>{producto.nombre}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px' : '40px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'auto' : '1fr 1fr',
          gap: isMobile ? '28px' : '48px',
          alignItems: 'start',
        }}>
          {/* Imagen */}
          <div style={{
            height: isMobile ? '300px' : '400px',
            background: bgColor,
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
            position: 'relative',
          }}>
            <img
              src={`/products/${producto.id}.jpg`}
              alt={producto.nombre}
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget
                el.style.display = 'none'
                const parent = el.parentElement
                if (parent) {
                  const span = document.createElement('span')
                  span.style.fontSize = isMobile ? '80px' : '120px'
                  span.textContent = producto.emoji || '🧴'
                  parent.appendChild(span)
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {producto.emoji && (
              <span style={{
                fontSize: isMobile ? '80px' : '120px',
                position: 'absolute',
                zIndex: 1,
              }}>
                {producto.emoji}
              </span>
            )}
          </div>

          {/* Detalles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Categoría */}
            {categoria && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: categoria.name === 'Bouquets' || categoria.name === 'Materia Prima' ? C.goldLight : C.blueLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CategoryIcon name={categoria.name} size={20} color={categoria.name === 'Bouquets' || categoria.name === 'Materia Prima' ? C.gold : C.blue} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: C.blue }}>
                    Categoría
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>
                    {categoria.name}
                  </div>
                </div>
              </div>
            )}

            {/* Nombre y Descripción */}
            <div>
              <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: 800, color: C.text, marginBottom: '12px', lineHeight: 1.2 }}>
                {producto.nombre}
              </h1>
              <p style={{ fontSize: '15px', color: C.textMid, lineHeight: 1.7, margin: 0 }}>
                Producto especializado en limpieza industrial y comercial. Parte del catálogo mayorista de{' '}
                <span style={{ fontWeight: 600, color: C.text }}>Química Clean</span>
                , tu distribuidor de confianza en Tucumán, Argentina.
              </p>
            </div>

            {/* Características */}
            <div style={{
              background: C.white, padding: isMobile ? '20px' : '28px',
              borderRadius: '14px', border: `1.5px solid ${C.border}`,
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>
                Detalles
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: C.textMid, fontWeight: 500, marginBottom: '4px' }}>ID Producto</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: C.text }}>{producto.id}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: C.textMid, fontWeight: 500, marginBottom: '4px' }}>Categoría</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: C.text }}>{producto.categoria}</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '12px' : '16px', paddingTop: '8px' }}>
              <a href="#contacto" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', background: C.gold, color: 'white', border: 'none',
                  padding: isMobile ? '14px' : '16px',
                  borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                  fontSize: isMobile ? '14px' : '15px', cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = C.goldDark
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(231, 167, 63, 0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = C.gold
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>
                  Solicitar cotización
                </button>
              </a>
              <a href="https://wa.me/5493815554488?text=Hola%20me%20interesa%20el%20producto%20ID:%20" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', background: '#25d366', color: 'white', border: 'none',
                  padding: isMobile ? '14px' : '16px',
                  borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                  fontSize: isMobile ? '14px' : '15px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.25s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#1da851'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#25d366'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}>
                  <WhatsAppIcon size={18} color="white" />
                  WhatsApp
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        {relacionados.length > 0 && (
          <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase' as const, color: C.blue, marginBottom: '12px',
              }}>
                <span style={{ width: '24px', height: '2px', background: C.blue }} />
                Más en esta categoría
                <span style={{ width: '24px', height: '2px', background: C.blue }} />
              </div>
              <h2 style={{ fontSize: isMobile ? '26px' : '32px', fontWeight: 800, color: C.text, margin: 0 }}>
                Productos relacionados
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}>
              {relacionados.map(p => (
                <Link key={p.id} href={`/productos/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: C.white, borderRadius: '14px',
                    overflow: 'hidden', border: `1.5px solid ${C.border}`,
                    transition: 'all 0.3s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.transform = 'translateY(-8px)'
                      el.style.boxShadow = '0 20px 44px rgba(0,0,0,0.1)'
                      el.style.borderColor = C.blue
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.transform = 'translateY(0)'
                      el.style.boxShadow = 'none'
                      el.style.borderColor = C.border
                    }}>
                    {/* Imagen */}
                    <div style={{
                      height: '160px', background: p.color2
                        ? `linear-gradient(135deg, ${p.color} 50%, ${p.color2} 50%)`
                        : p.color || `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '48px' }}>{p.emoji || '🧴'}</span>
                    </div>
                    {/* Info */}
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: C.blue, marginBottom: '6px' }}>
                        {p.categoria}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
                        {p.nombre}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
