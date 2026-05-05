import { useEffect, useState } from 'react'

type Categoria = {
  id: number
  nombre: string
  emoji: string | null
  orden: number
}

const fallback: Categoria[] = [
  { id: 1, nombre: 'Jabones', emoji: '🧴', orden: 1 },
  { id: 2, nombre: 'Suavizantes', emoji: '🌸', orden: 2 },
  { id: 3, nombre: 'Detergentes', emoji: '🧼', orden: 3 },
  { id: 4, nombre: 'Desengrasantes', emoji: '🧹', orden: 4 },
  { id: 5, nombre: 'Desinfectantes', emoji: '🦠', orden: 5 },
  { id: 6, nombre: 'Pisos', emoji: '🏠', orden: 6 },
  { id: 7, nombre: 'Piletas', emoji: '🏊', orden: 7 },
  { id: 8, nombre: 'Automotor', emoji: '🚗', orden: 8 },
  { id: 9, nombre: 'Hogar', emoji: '🏡', orden: 9 },
  { id: 10, nombre: 'Concentrados', emoji: '🔬', orden: 10 },
  { id: 11, nombre: 'Materia Prima', emoji: '⚗️', orden: 11 },
  { id: 12, nombre: 'Bouquets', emoji: '🌺', orden: 12 },
  { id: 13, nombre: 'Contenedores', emoji: '📦', orden: 13 },
]

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data?.length) {
          setCategorias(result.data)
        }
      })
      .catch(() => setCategorias(fallback))
      .finally(() => setLoading(false))
  }, [])

  return { categorias: categorias.length ? categorias : fallback, loading }
}