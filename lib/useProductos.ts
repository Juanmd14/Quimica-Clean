import { useEffect, useState } from 'react'
import { type Producto } from '@/lib/supabase'

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(result => {
        if (result.success) setProductos(result.data || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { productos, loading }
}