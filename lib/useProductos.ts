import { useEffect, useState } from 'react'
import { createClient, type Producto } from '@/lib/supabase'

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('categoria')
      .order('orden')
      .then(({ data }) => {
        setProductos(data || [])
        setLoading(false)
      })
  }, [])

  return { productos, loading }
}