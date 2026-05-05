'use client'

import { useEffect, useState } from 'react'

type Categoria = {
  id: number
  nombre: string
  emoji: string | null
  orden: number
}

const C = {
  bg: '#0f1623', card: '#1a2436', border: '#2a3a54',
  blue: '#2b7bb8', gold: '#e7a73f', text: '#f1f5f9',
  textMid: '#94a3b8', danger: '#ef4444', success: '#22c55e',
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ emoji: '', orden: 0 })

  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategorias(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (cat: Categoria) => {
    setSaving(true)
    try {
      const res = await fetch('/api/categorias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, emoji: editForm.emoji || null, orden: editForm.orden }),
      })
      const data = await res.json()
      if (data.success) {
        setCategorias(prev => prev.map(c => c.id === cat.id ? { ...c, emoji: editForm.emoji || null, orden: editForm.orden } : c))
        setEditingId(null)
      }
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '40px', color: C.text }}>Cargando...</div>

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text, padding: '28px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: C.text, fontWeight: 700, fontSize: '22px', marginBottom: '24px' }}>
          Gestionar Categorías
        </h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          {categorias.map(cat => (
            <div key={cat.id} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: '12px', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{ fontSize: '32px', width: '50px', textAlign: 'center' }}>
                {cat.emoji || '📦'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{cat.nombre}</div>
                <div style={{ fontSize: '12px', color: C.textMid }}>Orden: {cat.orden}</div>
              </div>
              <button
                onClick={() => { setEditingId(cat.id); setEditForm({ emoji: cat.emoji || '', orden: cat.orden }) }}
                style={{
                  background: C.blue, color: 'white', border: 'none',
                  padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 500,
                }}
              >
                Editar
              </button>

              {editingId === cat.id && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', width: '320px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Editar {cat.nombre}</h3>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: C.textMid, marginBottom: '6px' }}>Emoji</label>
                      <input
                        value={editForm.emoji}
                        onChange={e => setEditForm(f => ({ ...f, emoji: e.target.value }))}
                        placeholder="🧴"
                        style={{ width: '100%', background: C.bg, border: `1.5px solid ${C.border}`, color: C.text, padding: '10px', borderRadius: '8px', fontSize: '16px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: C.textMid, marginBottom: '6px' }}>Orden</label>
                      <input
                        type="number"
                        value={editForm.orden}
                        onChange={e => setEditForm(f => ({ ...f, orden: parseInt(e.target.value) || 0 }))}
                        style={{ width: '100%', background: C.bg, border: `1.5px solid ${C.border}`, color: C.text, padding: '10px', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{ flex: 1, background: C.border, color: C.text, border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSave(cat)}
                        disabled={saving}
                        style={{ flex: 1, background: C.gold, color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                      >
                        {saving ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}