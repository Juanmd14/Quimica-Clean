import { type Producto } from '@/lib/supabase'
import { products } from '@/app/components/constants'

const staticProductos: Producto[] = products.map((p, i) => ({
  id: p.id,
  categoria: p.category,
  nombre: p.name,
  color: p.color ?? null,
  color2: p.color2 ?? null,
  emoji: p.emoji ?? null,
  activo: true,
  orden: i,
}))

export function useProductos() {
  return { productos: staticProductos, loading: false }
}
