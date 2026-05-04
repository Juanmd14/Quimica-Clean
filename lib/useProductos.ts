import { useEffect, useState } from 'react'
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
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(result => {
        setProductos(result.success && result.data?.length ? result.data : fallback)
      })
      .catch(() => setProductos(fallback))
      .finally(() => setLoading(false))
  }, [])

  return { productos, loading }
}
