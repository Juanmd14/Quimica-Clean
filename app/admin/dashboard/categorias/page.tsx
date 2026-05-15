'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import AdminBackButton from '@/app/admin/components/AdminBackButton'

type Categoria = {
  id: number
  nombre: string
  emoji: string | null
  imagen_url: string | null
  orden: number
}

const C = {
  bg: '#0f1623', card: '#1a2436', border: '#2a3a54',
  blue: '#2b7bb8', gold: '#e7a73f', text: '#f1f5f9',
  textMid: '#94a3b8', danger: '#ef4444', success: '#22c55e',
}

async function compressImg(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      const MAX = 400
      let w = img.width, h = img.height
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(img.src)
      canvas.toBlob(b => resolve(b!), 'image/webp', 0.82)
    }
    img.src = URL.createObjectURL(file)
  })
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ emoji: '', imagen_url: '', orden: 0, imgFile: null as File | null, imgPreview: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategorias(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleEdit = (cat: Categoria) => {
    setEditingId(cat.id)
    setEditForm({ 
      emoji: cat.emoji || '', 
      imagen_url: cat.imagen_url || '',
      orden: cat.orden,
      imgFile: null,
      imgPreview: cat.imagen_url || ''
    })
  }

  const handleImgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setEditForm(f => ({ ...f, imgFile: file, imgPreview: URL.createObjectURL(file) }))
  }

  const handleSave = async (cat: Categoria) => {
    setSaving(true)
    try {
      let imagen_url = editForm.imagen_url

      if (editForm.imgFile) {
        const blob = await compressImg(editForm.imgFile)
        const fd = new FormData()
        fd.append('file', blob, `cat_${cat.id}.webp`)
        const res = await fetch('/api/products/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.url) imagen_url = json.url
      }

      const res = await fetch('/api/categorias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: cat.id, 
          emoji: editForm.emoji || null, 
          imagen_url: imagen_url || null,
          orden: editForm.orden 
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCategorias(prev => prev.map(c => c.id === cat.id ? { 
          ...c, 
          emoji: editForm.emoji || null, 
          imagen_url: imagen_url || null,
          orden: editForm.orden 
        } : c))
        setEditingId(null)
      }
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '40px', color: C.text }}>Cargando...</div>

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text, padding: '28px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <AdminBackButton />
        </div>
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
              <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                {cat.imagen_url ? (
                  <Image src={cat.imagen_url} alt={cat.nombre} fill sizes="50px" style={{ objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '24px' }}>{cat.emoji || '📦'}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{cat.nombre}</div>
                <div style={{ fontSize: '12px', color: C.textMid }}>Orden: {cat.orden}</div>
              </div>
              <button
                onClick={() => handleEdit(cat)}
                style={{
                  background: C.blue, color: 'white', border: 'none',
                  padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 500,
                }}
              >
                Editar
              </button>

              {editingId === cat.id && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'auto' }}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', width: '360px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Editar {cat.nombre}</h3>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: C.textMid, marginBottom: '6px' }}>Imagen</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImgSelect}
                        ref={fileRef}
                        style={{ display: 'none' }}
                      />
                      <div 
                        onClick={() => fileRef.current?.click()}
                        style={{ 
                          width: '100%', height: '120px', 
                          background: C.bg, border: `1.5px dashed ${C.border}`, 
                          borderRadius: '8px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        {editForm.imgPreview ? (
                          <Image src={editForm.imgPreview} alt="Preview" fill sizes="100px" style={{ objectFit: 'cover' }} />
                        ) : (
                          <span style={{ color: C.textMid, fontSize: '14px' }}>Click para subir imagen</span>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: C.textMid, marginBottom: '6px' }}>Emoji (si no hay imagen)</label>
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