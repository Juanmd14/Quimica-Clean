import 'server-only'
import { unstable_cache } from 'next/cache'
import { getSupabaseAdmin } from './supabaseAdmin'
import type { Producto, Categoria } from './types'

const FEATURED_NAMES = ['ariel nelson', 'ala nelson']
const featuredRank = (name: string) => {
  const n = name.toLowerCase()
  const idx = FEATURED_NAMES.findIndex(f => n.includes(f))
  return idx === -1 ? 999 : idx
}

const CATEGORY_PRIORITY = ['Jabones']
const categoryRank = (cat: string) => {
  const idx = CATEGORY_PRIORITY.indexOf(cat)
  return idx === -1 ? 999 : idx
}

export const getProductos = unstable_cache(
  async (): Promise<Producto[]> => {
    const { data, error } = await getSupabaseAdmin()
      .from('productos')
      .select('id, nombre, categoria, descripcion, color, color2, emoji, imagen_url, activo, orden')
      .eq('activo', true)
      .order('categoria')
      .order('orden')

    if (error) {
      console.error('getProductos supabase error:', error)
      return []
    }

    return [...(data || [])].sort((a, b) => {
      const ra = categoryRank(a.categoria)
      const rb = categoryRank(b.categoria)
      if (ra !== rb) return ra - rb
      if (a.categoria !== b.categoria) return a.categoria.localeCompare(b.categoria)
      return featuredRank(a.nombre) - featuredRank(b.nombre)
    }) as Producto[]
  },
  ['productos-publicos'],
  { revalidate: 600, tags: ['productos'] },
)

export const getCategorias = unstable_cache(
  async (): Promise<Categoria[]> => {
    const { data, error } = await getSupabaseAdmin()
      .from('categorias')
      .select('id, nombre, emoji, imagen_url, orden')
      .order('orden')

    if (error) {
      console.error('getCategorias supabase error:', error)
      return []
    }
    return (data || []) as Categoria[]
  },
  ['categorias-publicas'],
  { revalidate: 3600, tags: ['categorias'] },
)
