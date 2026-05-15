'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import AdminBackButton from '@/app/admin/components/AdminBackButton'

type Lead = {
  id: number
  nombre: string
  telefono: string
  email?: string
  producto_interes?: string
  mensaje?: string
  created_at: string
}

const C = {
  bg: '#0f1623', card: '#1a2436', border: '#2a3a54',
  blue: '#2b7bb8', gold: '#e7a73f', text: '#f1f5f9',
  textMid: '#94a3b8',
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandido, setExpandido] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError('Error al cargar los leads')
        else setLeads(data || [])
        setLoading(false)
      })
  }, [])

  const hoy = leads.filter(l => {
    const d = new Date(l.created_at)
    const ahora = new Date()
    return d.toDateString() === ahora.toDateString()
  }).length

  const semana = leads.filter(l => {
    const d = new Date(l.created_at)
    const hace7 = new Date(); hace7.setDate(hace7.getDate() - 7)
    return d >= hace7
  }).length

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text }}>
      <div style={{ padding: '28px 32px', maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '20px' }}>
          <AdminBackButton />
        </div>

        <h2 style={{ color: C.text, fontWeight: 700, fontSize: '22px', margin: '0 0 28px' }}>
          Leads / Consultas
        </h2>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total', value: leads.length },
            { label: 'Esta semana', value: semana },
            { label: 'Hoy', value: hoy },
          ].map((s, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: C.gold }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: C.textMid, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: C.textMid }}>Cargando...</div>
        ) : error ? (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '16px', borderRadius: '8px' }}>{error}</div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: C.textMid }}>Todavía no hay consultas</div>
        ) : (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 130px 180px', padding: '12px 20px', borderBottom: `1px solid ${C.border}`, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: C.textMid }}>
              <div>Fecha</div><div>Nombre / Teléfono</div><div>Producto</div><div>Mensaje</div>
            </div>

            {leads.map((lead, i) => (
              <div key={lead.id}>
                <div
                  onClick={() => setExpandido(expandido === lead.id ? null : lead.id)}
                  style={{
                    display: 'grid', gridTemplateColumns: '160px 1fr 130px 180px',
                    padding: '14px 20px', alignItems: 'center',
                    borderBottom: i < leads.length - 1 ? `1px solid ${C.border}` : 'none',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <div style={{ fontSize: '12px', color: C.textMid }}>{formatFecha(lead.created_at)}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{lead.nombre}</div>
                    <div style={{ fontSize: '12px', color: C.textMid }}>{lead.telefono}</div>
                    {lead.email && <div style={{ fontSize: '11px', color: C.blue }}>{lead.email}</div>}
                  </div>
                  <div>
                    {lead.producto_interes ? (
                      <span style={{ background: 'rgba(43,123,184,0.15)', color: '#60a5fa', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                        {lead.producto_interes}
                      </span>
                    ) : (
                      <span style={{ color: C.textMid, fontSize: '12px' }}>—</span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: C.textMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {lead.mensaje || '—'}
                  </div>
                </div>
                {expandido === lead.id && lead.mensaje && (
                  <div style={{ padding: '16px 20px', background: 'rgba(43,123,184,0.06)', borderBottom: i < leads.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: C.textMid, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Mensaje completo</div>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: C.text }}>{lead.mensaje}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
