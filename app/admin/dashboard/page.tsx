'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { CONFIG } from '@/lib/config'

type Stats = {
  productos: number | null
  categorias: number | null
  leadsHoy: number | null
  leadsSemana: number | null
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<Stats>({ productos: null, categorias: null, leadsHoy: null, leadsSemana: null })
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    type LeadCount = { hoy: number | null; semana: number | null }

    const productsPromise: Promise<number | null> = fetch('/api/products')
      .then(r => r.json())
      .then(j => j.success ? j.data.length : null)
      .catch(() => null)

    const catsPromise: Promise<number | null> = fetch('/api/categorias')
      .then(r => r.json())
      .then(j => j.success ? j.data.length : null)
      .catch(() => null)

    const leadsPromise: Promise<LeadCount> = Promise.resolve(
      supabase.from('leads').select('created_at')
    ).then(({ data, error }) => {
      if (error || !data) return { hoy: null, semana: null }
      const ahora = new Date()
      const hace7 = new Date(); hace7.setDate(hace7.getDate() - 7)
      let hoy = 0, semana = 0
      for (const l of data) {
        const d = new Date(l.created_at)
        if (d.toDateString() === ahora.toDateString()) hoy++
        if (d >= hace7) semana++
      }
      return { hoy, semana }
    }).catch(() => ({ hoy: null, semana: null }))

    Promise.all([productsPromise, catsPromise, leadsPromise]).then(([productos, categorias, leads]) => {
      setStats({ productos, categorias, leadsHoy: leads.hoy, leadsSemana: leads.semana })
    })
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout error:', err)
      setLoading(false)
    }
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Productos', href: '/admin/dashboard/products', icon: '📦' },
    { label: 'Categorías', href: '/admin/dashboard/categorias', icon: '🏷️' },
    { label: 'Leads / Consultas', href: '/admin/dashboard/leads', icon: '📋' },
    { label: 'Usuarios', href: '/admin/dashboard/users', icon: '👥' },
    { label: 'Configuración', href: '/admin/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        background: 'white',
        borderRight: '1px solid #ddd',
        boxShadow: '2px 0 4px rgba(0,0,0,0.05)',
        padding: '20px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}>
        <h1 style={{
          fontSize: '20px',
          color: CONFIG.PRIMARY_COLOR,
          margin: '0 0 30px 0',
          paddingBottom: '20px',
          borderBottom: '1px solid #eee',
        }}>
          {CONFIG.BRAND_NAME}
        </h1>

        <nav style={{ marginBottom: '30px' }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '6px',
                color: '#333',
                textDecoration: 'none',
                transition: 'background 0.2s',
                fontSize: '14px',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#f0f0f0'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginTop: 'auto',
          }}
        >
          {loading ? 'Saliendo...' : '🚪 Cerrar Sesión'}
        </button>

        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px',
            marginTop: '12px',
            background: '#2b7bb8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            justifyContent: 'center',
          }}
        >
          🏠 Volver al inicio
        </Link>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minHeight: '100vh' }}>
        {/* Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #ddd',
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ color: '#333', margin: 0, fontSize: '24px' }}>
            Panel de Control
          </h2>
          <div style={{ color: '#666', fontSize: '14px' }}>
            Bienvenido, Administrador
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>
              Panel de Control
            </h2>

            {/* Métricas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}>
              {[
                { label: 'Productos activos', value: stats.productos, color: '#2b7bb8' },
                { label: 'Categorías', value: stats.categorias, color: '#7c3aed' },
                { label: 'Leads (hoy)', value: stats.leadsHoy, color: '#16a34a' },
                { label: 'Leads (7 días)', value: stats.leadsSemana, color: '#e7a73f' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '18px 20px',
                  borderLeft: `4px solid ${s.color}`,
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                    {s.value === null ? '—' : s.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
            }}>
              {/* Card: Products */}
              <Link
                href="/admin/dashboard/products"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '20px',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>📦</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.9 }}>Gestionar Productos</p>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>Ir</p>
              </Link>

              {/* Card: Leads */}
              <Link
                href="/admin/dashboard/leads"
                style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  padding: '20px',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>📋</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.9 }}>Leads / Consultas</p>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>Ir</p>
              </Link>

              {/* Card: Users */}
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: '20px',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>👥</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.9 }}>Gestionar Usuarios</p>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>Próximamente</p>
              </div>

              {/* Card: Settings */}
              <div style={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                padding: '20px',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>⚙️</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.9 }}>Configuración</p>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>Próximamente</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
