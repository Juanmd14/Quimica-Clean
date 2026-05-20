'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminBackButton from '@/app/admin/components/AdminBackButton'

type Producto = {
  id: number
  categoria: string
  nombre: string
  descripcion: string | null
  color: string | null
  color2: string | null
  emoji: string | null
  imagen_url: string | null
  activo: boolean
  orden: number
}

const CATEGORIAS = [
  'Jabones',
  'Suavizantes',
  'Detergentes',
  'Desengrasantes',
  'Desinfectantes',
  'Pisos',
  'Piletas',
  'Automotor',
  'Hogar',
  'Concentrados',
  'Materia Prima',
  'Bouquets',
  'Contenedores',
  'Jabon de manos',
]


const C = {
  bg: '#0f1623', card: '#1a2436', border: '#2a3a54',
  blue: '#2b7bb8', gold: '#e7a73f', text: '#f1f5f9',
  textMid: '#94a3b8', danger: '#ef4444', success: '#22c55e',
}

function ColorDot({ color, color2, size = 28 }: { color?: string | null; color2?: string | null; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color2
        ? `linear-gradient(135deg, ${color} 50%, ${color2} 50%)`
        : color || '#334155',
      border: '2px solid rgba(255,255,255,0.15)',
    }} />
  )
}

type FormData = Omit<Producto, 'id' | 'activo' | 'orden'>

async function compressImg(file: File): Promise<Blob> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const MAX = 800
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

function ProductModal({ product, onSave, onClose }: {
  product: Producto | null
  onSave: (data: FormData & { id?: number }) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<FormData>({
    categoria:   product?.categoria   ?? 'Jabones',
    nombre:      product?.nombre      ?? '',
    descripcion: product?.descripcion ?? null,
    color:       product?.color       ?? '#ffffff',
    color2:      product?.color2      ?? null,
    emoji:       product?.emoji       ?? null,
    imagen_url:  product?.imagen_url  ?? null,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [useColor2, setUseColor2] = useState(!!product?.color2)
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(product?.imagen_url ?? null)

  const set = (k: keyof FormData, v: string | null) => setForm(f => ({ ...f, [k]: v }))

  const handleImgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.nombre.trim()) return
    setSaving(true)
    let imagen_url = form.imagen_url

    if (imgFile) {
      setUploading(true)
      try {
        const blob = await compressImg(imgFile)
        const fd = new FormData()
        fd.append('file', blob, `${product?.id ?? Date.now()}.webp`)
        const res = await fetch('/api/products/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (json.url) imagen_url = json.url
      } catch (e) { console.error(e) }
      setUploading(false)
    }

    await onSave({ ...form, imagen_url, color2: useColor2 ? form.color2 : null, id: product?.id })
    setSaving(false)
    onClose()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0f1623', border: `1.5px solid ${C.border}`,
    color: C.text, padding: '9px 12px', borderRadius: '8px', fontSize: '14px',
    outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
  }
  const label: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: C.textMid, marginBottom: '6px', display: 'block',
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px',
        padding: '32px', width: '480px', maxWidth: '95vw', zIndex: 51,
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: C.text, fontWeight: 700, fontSize: '18px', margin: 0 }}>
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMid, fontSize: '22px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>Nombre</label>
            <input style={inputStyle} value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej: Jabón tipo Ariel" />
          </div>

          <div>
            <label style={label}>Categoría</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={label}>Descripción (opcional)</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '72px' }}
              value={form.descripcion || ''}
              onChange={e => set('descripcion', e.target.value || null)}
              placeholder="Descripción del producto..."
            />
          </div>

          <div>
            <label style={label}>Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="color" value={form.color || '#ffffff'} onChange={e => set('color', e.target.value)}
                style={{ width: '48px', height: '38px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }} />
              <input style={{ ...inputStyle, flex: 1 }} value={form.color || ''} onChange={e => set('color', e.target.value)} placeholder="#ffffff" />
              <ColorDot color={form.color} color2={useColor2 ? form.color2 : null} size={36} />
            </div>
          </div>

          <div>
            <label style={{ ...label, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useColor2} onChange={e => setUseColor2(e.target.checked)} style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
              Color secundario
            </label>
            {useColor2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <input type="color" value={form.color2 || '#000000'} onChange={e => set('color2', e.target.value)}
                  style={{ width: '48px', height: '38px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }} />
                <input style={{ ...inputStyle, flex: 1 }} value={form.color2 || ''} onChange={e => set('color2', e.target.value)} placeholder="#000000" />
              </div>
            )}
          </div>

          <div>
            <label style={label}>Emoji (opcional, se usa si no hay imagen)</label>
            <input style={inputStyle} value={form.emoji || ''} onChange={e => set('emoji', e.target.value || null)} placeholder="🧴" />
          </div>

          <div>
            <label style={label}>Imagen del producto</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '88px', height: '66px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0,
                background: form.color || '#1e2d42', border: `1.5px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
              }}>
                {imgPreview
                  // eslint-disable-next-line @next/next/no-img-element -- preview de blob URL local en admin, no necesita optimización
                  ? <img src={imgPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  : (form.emoji || '📷')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <label style={{
                  background: C.blue, color: 'white', padding: '7px 0', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600, textAlign: 'center', display: 'block',
                }}>
                  {uploading ? 'Subiendo…' : imgPreview ? 'Cambiar imagen' : 'Subir imagen'}
                  <input type="file" accept="image/*" onChange={handleImgSelect} style={{ display: 'none' }} disabled={uploading} />
                </label>
                {imgPreview && (
                  <button onClick={() => { setImgPreview(null); setImgFile(null); set('imagen_url', null) }}
                    style={{ background: 'transparent', border: `1.5px solid ${C.border}`, color: C.textMid, padding: '5px 0', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
                    Quitar imagen
                  </button>
                )}
              </div>
            </div>
            <p style={{ fontSize: '11px', color: C.textMid, marginTop: '6px', margin: '6px 0 0' }}>
              Se comprime automáticamente a WebP ≤ 800 px
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1.5px solid ${C.border}`, color: C.textMid, borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || uploading || !form.nombre.trim()} style={{
            flex: 2, padding: '10px', background: C.blue, border: 'none', color: 'white',
            borderRadius: '8px', cursor: (saving || uploading) ? 'not-allowed' : 'pointer', opacity: (saving || uploading) ? 0.7 : 1,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
          }}>
            {uploading ? 'Subiendo imagen…' : saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </>
  )
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [catFilter, setCatFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<Producto | null | 'new'>(null)
  const [toast, setToast] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    const res = await fetch('/api/products?all=true')
    const result = await res.json()
    if (result.success) setProducts(result.data || [])
    else setError('Error al cargar productos')
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/products?all=true')
      .then(res => res.json())
      .then(result => {
        if (cancelled) return
        if (result.success) setProducts(result.data || [])
        else setError('Error al cargar productos')
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    let f = products
    if (catFilter !== 'Todos') f = f.filter(p => p.categoria === catFilter)
    if (search) f = f.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
    return f
  }, [products, catFilter, search])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

const handleSave = async (data: FormData & { id?: number }) => {
  const { id, ...rest } = data
  if (id) {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    })
    showToast('✓ Producto actualizado')
  } else {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, activo: true, orden: products.length }),
    })
    showToast('✓ Producto creado')
  }
  await loadProducts()
}

const handleDelete = async (id: number, nombre: string) => {
  if (!confirm(`¿Eliminar "${nombre}"?`)) return
  await fetch(`/api/products/${id}`, { method: 'DELETE' })
  showToast('Producto eliminado')
  await loadProducts()
}

 const handleToggle = async (p: Producto) => {
  await fetch(`/api/products/${p.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activo: !p.activo }),
  })
  setProducts(prev => prev.map(x => x.id === p.id ? { ...x, activo: !x.activo } : x))
}
  const cats = ['Todos', ...Array.from(new Set(products.map(p => p.categoria))).sort()]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#1e3a1e', border: '1px solid #22c55e', color: '#4ade80', padding: '12px 20px', borderRadius: '10px', zIndex: 100, fontWeight: 500, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      <div style={{ padding: '28px 32px', maxWidth: '1300px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <AdminBackButton />
            <h2 style={{ color: C.text, fontWeight: 700, fontSize: '22px', margin: 0 }}>Gestionar Productos</h2>
          </div>
          <button onClick={() => setModal('new')} style={{ background: C.gold, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: 'DM Sans, sans-serif' }}>
            + Nuevo producto
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total', value: products.length },
            { label: 'Activos', value: products.filter(p => p.activo).length },
            { label: 'Categorías', value: cats.length - 1 },
            { label: 'Inactivos', value: products.filter(p => !p.activo).length },
          ].map((s, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: i === 3 ? C.danger : C.gold }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: C.textMid, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar producto..."
            style={{ background: C.card, border: `1.5px solid ${C.border}`, color: C.text, padding: '9px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '240px' }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cats.map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)} style={{
                background: catFilter === cat ? C.blue : C.card,
                border: `1.5px solid ${catFilter === cat ? C.blue : C.border}`,
                color: catFilter === cat ? 'white' : C.textMid,
                padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
                fontSize: '12px', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: C.textMid }}>Cargando…</div>
        ) : (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 160px 80px 100px', padding: '12px 20px', borderBottom: `1px solid ${C.border}`, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMid }}>
              <div></div><div>Nombre</div><div>Categoría</div><div>Estado</div><div style={{ textAlign: 'right' }}>Acciones</div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: C.textMid }}>Sin resultados</div>
            ) : filtered.map((p, i) => (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 160px 80px 100px',
                padding: '12px 20px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                opacity: p.activo ? 1 : 0.45, transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <ColorDot color={p.color} color2={p.color2} size={26} />
                <div style={{ fontWeight: 500, fontSize: '14px', paddingRight: '12px' }}>
                  {p.emoji && <span style={{ marginRight: '8px' }}>{p.emoji}</span>}
                  {p.nombre}
                </div>
                <div>
                  <span style={{ background: 'rgba(43,123,184,0.15)', color: '#60a5fa', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                    {p.categoria}
                  </span>
                </div>
                <div>
                  <button onClick={() => handleToggle(p)} style={{
                    background: p.activo ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: p.activo ? '#4ade80' : '#f87171',
                    border: 'none', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {p.activo ? 'Activo' : 'Oculto'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setModal(p)} style={{ background: 'rgba(43,123,184,0.15)', border: 'none', color: '#60a5fa', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }} title="Editar">✏️</button>
                  <button onClick={() => handleDelete(p.id, p.nombre)} style={{ background: 'rgba(239,68,68,0.12)', border: 'none', color: '#f87171', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }} title="Eliminar">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal as Producto}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}