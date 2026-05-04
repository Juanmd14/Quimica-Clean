'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient, type Producto, CATEGORIAS } from '@/lib/supabase'

// ─── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#0f1623', card: '#1a2436', border: '#2a3a54',
  blue: '#2b7bb8', gold: '#e7a73f', text: '#f1f5f9',
  textMid: '#94a3b8', danger: '#ef4444', success: '#22c55e',
}

// ─── ColorDot ────────────────────────────────────────────────────────────────
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

// ─── Modal de edición / creación ─────────────────────────────────────────────
type FormData = Omit<Producto, 'id' | 'activo' | 'orden'>

function ProductModal({
  product, onSave, onClose,
}: {
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
  const [useColor2, setUseColor2] = useState(!!product?.color2)

  const set = (k: keyof FormData, v: string | null) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.nombre.trim()) return
    setSaving(true)
    await onSave({ ...form, color2: useColor2 ? form.color2 : null, id: product?.id })
    setSaving(false)
    onClose()
  }

  const label: React.CSSProperties = { fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMid, marginBottom: '6px', display: 'block' }
  const input: React.CSSProperties = { width: '100%', background: '#0f1623', border: `1.5px solid ${C.border}`, color: C.text, padding: '9px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }

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
            <input style={input} value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej: Jabón tipo Ariel" />
          </div>
          <div>
            <label style={label}>Categoría</label>
            <select style={{ ...input, cursor: 'pointer' }} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="color" value={form.color || '#ffffff'} onChange={e => set('color', e.target.value)}
                style={{ width: '48px', height: '38px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, background: 'none' }} />
              <input style={{ ...input, flex: 1 }} value={form.color || ''} onChange={e => set('color', e.target.value)} placeholder="#ffffff" />
              <ColorDot color={form.color} color2={useColor2 ? form.color2 : null} size={36} />
            </div>
          </div>
          <div>
            <label style={{ ...label, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useColor2} onChange={e => setUseColor2(e.target.checked)}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
              Color secundario (ej: rojo/negro)
            </label>
            {useColor2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <input type="color" value={form.color2 || '#000000'} onChange={e => set('color2', e.target.value)}
                  style={{ width: '48px', height: '38px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0, background: 'none' }} />
                <input style={{ ...input, flex: 1 }} value={form.color2 || ''} onChange={e => set('color2', e.target.value)} placeholder="#000000" />
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1.5px solid ${C.border}`, color: C.textMid, borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || !form.nombre.trim()} style={{
            flex: 2, padding: '10px', background: C.blue, border: 'none', color: 'white',
            borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
          }}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Login ───────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !pass) return
    setLoading(true); setError('')
    const sb = createClient()
    const { error: err } = await sb.auth.signInWithPassword({ email, password: pass })
    if (err) { setError('Usuario o contraseña incorrectos'); setLoading(false); return }
    onLogin()
  }

  const input: React.CSSProperties = { width: '100%', background: '#0f1623', border: `1.5px solid ${C.border}`, color: C.text, padding: '11px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: '380px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔐</div>
          <h1 style={{ color: C.text, fontWeight: 800, fontSize: '22px', margin: 0 }}>Panel Admin</h1>
          <p style={{ color: C.textMid, fontSize: '13px', marginTop: '6px' }}>Química Clean</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input style={input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <input style={input} type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          {error && <div style={{ color: '#f87171', fontSize: '13px', textAlign: 'center' }}>{error}</div>}
          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', padding: '12px', background: C.gold, color: 'white', border: 'none',
            borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '4px',
          }}>
            {loading ? 'Entrando…' : 'Ingresar'}
          </button>
          <a href="/" style={{ display: 'block', textAlign: 'center', fontSize: '13px', color: C.textMid, textDecoration: 'none' }}>
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Admin Principal ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed]       = useState<boolean | null>(null)
  const [products, setProducts]   = useState<Producto[]>([])
  const [filtered, setFiltered]   = useState<Producto[]>([])
  const [catFilter, setCatFilter] = useState('Todos')
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState<Producto | null | 'new'>(null)
  const [loading, setLoading]     = useState(true)
  const [toast, setToast]         = useState('')
  const sb = createClient()

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setAuthed(!!data.session) })
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    const { data } = await sb.from('productos').select('*').order('categoria').order('orden')
    setProducts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) loadProducts() }, [authed, loadProducts])

  useEffect(() => {
    let f = products
    if (catFilter !== 'Todos') f = f.filter(p => p.categoria === catFilter)
    if (search) f = f.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
    setFiltered(f)
  }, [products, catFilter, search])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleSave = async (data: FormData & { id?: number }) => {
    const { id, ...rest } = data as any
    if (id) {
      await sb.from('productos').update(rest).eq('id', id)
      showToast('✓ Producto actualizado')
    } else {
      await sb.from('productos').insert([{ ...rest, activo: true, orden: products.length }])
      showToast('✓ Producto creado')
    }
    await loadProducts()
  }

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    await sb.from('productos').delete().eq('id', id)
    showToast('Producto eliminado')
    await loadProducts()
  }

  const handleToggle = async (p: Producto) => {
    await sb.from('productos').update({ activo: !p.activo }).eq('id', p.id)
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, activo: !x.activo } : x))
  }

  const handleLogout = async () => { await sb.auth.signOut(); setAuthed(false) }

  if (authed === null) return null
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const cats = ['Todos', ...Array.from(new Set(products.map(p => p.categoria))).sort()]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif', color: C.text }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#1e3a1e', border: '1px solid #22c55e', color: '#4ade80', padding: '12px 20px', borderRadius: '10px', zIndex: 100, fontWeight: 500, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 800, fontSize: '16px' }}>QUÍMICA <span style={{ color: C.gold }}>CLEAN</span></span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ color: C.textMid, fontSize: '13px' }}>Panel de productos</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textMid, padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
              ← Sitio web
            </button>
          </a>
          <button onClick={() => setModal('new')} style={{ background: C.gold, color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            + Nuevo producto
          </button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textMid, padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
            Salir
          </button>
        </div>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: '1300px', margin: '0 auto' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total productos', value: products.length },
            { label: 'Activos', value: products.filter(p => p.activo).length },
            { label: 'Categorías', value: cats.length - 1 },
            { label: 'Inactivos', value: products.filter(p => !p.activo).length },
          ].map((s, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: i === 3 ? C.danger : C.gold }}>{s.value}</div>
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
              }}>{cat} {cat !== 'Todos' ? `(${products.filter(p => p.categoria === cat).length})` : ''}</button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: C.textMid }}>Cargando…</div>
        ) : (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 160px 80px 100px', padding: '12px 20px', borderBottom: `1px solid ${C.border}`, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMid }}>
              <div></div>
              <div>Nombre</div>
              <div>Categoría</div>
              <div>Estado</div>
              <div style={{ textAlign: 'right' }}>Acciones</div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: C.textMid }}>Sin resultados</div>
            ) : (
              filtered.map((p, i) => (
                <div key={p.id} style={{
                  display: 'grid', gridTemplateColumns: '40px 1fr 160px 80px 100px',
                  padding: '12px 20px', alignItems: 'center',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                  opacity: p.activo ? 1 : 0.45,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <ColorDot color={p.color} color2={p.color2} size={26} />
                  <div style={{ fontWeight: 500, fontSize: '14px', paddingRight: '12px' }}>{p.nombre}</div>
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
              ))
            )}
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