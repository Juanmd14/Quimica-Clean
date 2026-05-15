import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { C, categories } from '@/app/components/constants'
import { WhatsAppIcon } from '@/app/components/ui'
import { CONFIG } from '@/lib/config'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import type { Producto } from '@/lib/supabase'

async function fetchProducto(id: number): Promise<Producto | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('productos')
    .select('*')
    .eq('id', id)
    .eq('activo', true)
    .single()
  if (error || !data) return null
  return data as unknown as Producto
}

async function fetchRelacionados(categoria: string, excludeId: number): Promise<Producto[]> {
  const { data } = await getSupabaseAdmin()
    .from('productos')
    .select('*')
    .eq('categoria', categoria)
    .eq('activo', true)
    .neq('id', excludeId)
    .limit(4)
  return (data as unknown as Producto[]) || []
}

type CategoriaRow = { nombre: string; emoji: string | null; imagen_url: string | null }

async function fetchCategoriaPorNombre(nombre: string): Promise<CategoriaRow | null> {
  const { data } = await getSupabaseAdmin()
    .from('categorias')
    .select('nombre, emoji, imagen_url')
    .eq('nombre', nombre)
    .single()
  return (data as unknown as CategoriaRow) || null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const producto = await fetchProducto(parseInt(id, 10))
  if (!producto) {
    return { title: 'Producto no encontrado | Química Clean' }
  }
  const url = `https://quimica-clean.com/productos/${producto.id}`
  const desc = producto.descripcion ||
    `${producto.nombre} - Distribuidora mayorista de productos de limpieza. Categoría: ${producto.categoria}. Cotizá con Química Clean.`
  return {
    title: `${producto.nombre} | Química Clean`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${producto.nombre} | Química Clean`,
      description: desc,
      type: 'website',
      url,
      images: producto.imagen_url ? [{ url: producto.imagen_url }] : undefined,
    },
  }
}

function CategoryIcon({ name, size = 32, color = C.blue }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'Suavizantes':   return <svg {...s}><path d="M12 2C8 2 5 5 5 9c0 3 2 5 4 7l3 4 3-4c2-2 4-4 4-7 0-4-3-7-7-7z" /></svg>
    case 'Jabones':       return <svg {...s}><circle cx="12" cy="10" r="4" /><path d="M8 10c0 0-3 1-3 5s2 5 7 5 7-1 7-5-3-5-3-5" /></svg>
    case 'Detergentes':   return <svg {...s}><path d="M8 3h8l1 4H7L8 3z" /><path d="M7 7v11a2 2 0 002 2h6a2 2 0 002-2V7" /></svg>
    case 'Desengrasantes':return <svg {...s}><path d="M5 3h14M5 3v2l2 2v12a1 1 0 001 1h8a1 1 0 001-1V7l2-2V3M9 11l2 2 4-4" /></svg>
    case 'Desinfectantes':return <svg {...s}><path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4zM9 12l2 2 4-4" /></svg>
    default:              return <svg {...s}><circle cx="12" cy="12" r="9" /></svg>
  }
}

function ProductImage({ producto }: { producto: Producto }) {
  if (producto.imagen_url) {
    return (
      <Image
        src={producto.imagen_url}
        alt={producto.nombre}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
        priority
      />
    )
  }
  const bg = producto.color2
    ? `linear-gradient(135deg, ${producto.color} 50%, ${producto.color2} 50%)`
    : producto.color || `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`
  return (
    <div style={{
      position: 'absolute', inset: 0, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'clamp(80px, 20vw, 140px)',
    }}>
      {producto.emoji || '🧴'}
    </div>
  )
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = parseInt(idParam, 10)
  if (isNaN(id)) notFound()

  const producto = await fetchProducto(id)
  if (!producto) notFound()

  const categoria = categories.find(c => c.name === producto.categoria)
  const [relacionados, categoriaDB] = await Promise.all([
    fetchRelacionados(producto.categoria, producto.id),
    fetchCategoriaPorNombre(producto.categoria),
  ])

  const waNumber = (CONFIG.WHATSAPP_NUMBER || '').replace('+', '')
  const waMsg = encodeURIComponent(`Hola! Me interesa el producto: ${producto.nombre}. ¿Me pueden dar más información?`)

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion || `${producto.nombre} - Productos de limpieza mayorista`,
    category: producto.categoria,
    brand: { '@type': 'Brand', name: 'Química Clean' },
    image: producto.imagen_url || undefined,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `https://quimica-clean.com/productos/${producto.id}`,
      priceCurrency: 'ARS',
    },
  }

  return (
    <main style={{ minHeight: '100vh', background: C.offWhite, paddingTop: '88px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="qc-page-pad" style={{ padding: '20px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontSize: '13px', color: C.textMid, display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: C.blue, textDecoration: 'none' }}>Inicio</Link>
          <span>/</span>
          <Link href="/productos" style={{ color: C.blue, textDecoration: 'none' }}>Productos</Link>
          <span>/</span>
          <span style={{ color: C.text, fontWeight: 600 }}>{producto.nombre}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="qc-page-pad qc-section-pad" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="qc-grid-2" style={{ alignItems: 'start' }}>
          {/* Imagen */}
          <div style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            maxHeight: '500px',
            background: C.offWhite,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
          }}>
            <ProductImage producto={producto} />
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.95)', padding: '6px 14px', borderRadius: '12px', fontSize: '11px', color: C.blue, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {producto.categoria}
            </div>
          </div>

          {/* Detalles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {producto.categoria && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: producto.categoria === 'Bouquets' || producto.categoria === 'Materia Prima' ? C.goldLight : C.blueLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {categoriaDB?.imagen_url ? (
                    <Image src={categoriaDB.imagen_url} alt={producto.categoria} fill sizes="40px" style={{ objectFit: 'cover' }} />
                  ) : categoriaDB?.emoji ? (
                    <span style={{ fontSize: '22px' }}>{categoriaDB.emoji}</span>
                  ) : categoria ? (
                    <CategoryIcon name={categoria.name} size={20} color={producto.categoria === 'Bouquets' || producto.categoria === 'Materia Prima' ? C.gold : C.blue} />
                  ) : (
                    <span style={{ fontSize: '22px' }}>📦</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: C.blue }}>Categoría</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>{producto.categoria}</div>
                </div>
              </div>
            )}

            <div>
              <h1 className="qc-h1" style={{ fontWeight: 800, color: C.text, marginBottom: '12px', lineHeight: 1.15 }}>
                {producto.nombre}
              </h1>
              <p style={{ fontSize: '15px', color: C.textMid, lineHeight: 1.7, margin: 0 }}>
                {producto.descripcion || (
                  <>Producto especializado en limpieza industrial y comercial. Parte del catálogo mayorista de{' '}
                  <span style={{ fontWeight: 600, color: C.text }}>Química Clean</span>, tu distribuidor de confianza en Tucumán, Argentina.</>
                )}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Link href="/#contacto" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', background: C.gold, color: 'white', border: 'none',
                  padding: '16px', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                }}>
                  Solicitar cotización
                </button>
              </Link>
              <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', background: '#25d366', color: 'white', border: 'none',
                  padding: '16px', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
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
          <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase' as const, color: C.blue, marginBottom: '12px',
              }}>
                <span style={{ width: '24px', height: '2px', background: C.blue }} />
                Más en esta categoría
                <span style={{ width: '24px', height: '2px', background: C.blue }} />
              </div>
              <h2 className="qc-h2" style={{ fontWeight: 800, color: C.text, margin: 0 }}>
                Productos relacionados
              </h2>
            </div>

            <div className="qc-grid-cards">
              {relacionados.map(p => {
                const bg = p.color2 ? `linear-gradient(135deg, ${p.color} 50%, ${p.color2} 50%)` : (p.color || `linear-gradient(135deg, ${C.blueLight}, ${C.goldLight})`)
                return (
                  <Link key={p.id} href={`/productos/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: C.white, borderRadius: '14px',
                      overflow: 'hidden', border: `1.5px solid ${C.border}`,
                      transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s', height: '100%',
                    }}>
                      <div style={{ position: 'relative', aspectRatio: '4 / 3', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.imagen_url
                          ? <Image src={p.imagen_url} alt={p.nombre} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                          : <span style={{ fontSize: '48px' }}>{p.emoji || '🧴'}</span>}
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: C.blue, marginBottom: '4px' }}>
                          {p.categoria}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
                          {p.nombre}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
