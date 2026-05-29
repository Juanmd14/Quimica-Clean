import { useProductosData } from '@/app/components/DataProvider'
import { type Producto } from '@/lib/supabase'
import { products } from '@/app/components/constants'

const fallback: Producto[] = products.map((p, i) => ({
  id: p.id,
  categoria: p.category,
  nombre: p.name,
  descripcion: null,
  color: p.color ?? null,
  color2: p.color2 ?? null,
  emoji: p.emoji ?? null,
  imagen_url: null,
  activo: true,
  orden: i,
}))

export function useProductos() {
  const productos = useProductosData()
  return { productos: productos.length ? productos : fallback, loading: false }
}
