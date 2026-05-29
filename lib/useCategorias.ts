import { useCategoriasData } from '@/app/components/DataProvider'
import type { Categoria } from '@/lib/types'

const fallback: Categoria[] = [
  { id: 1, nombre: 'Jabones', emoji: '🧴', imagen_url: null, orden: 1 },
  { id: 2, nombre: 'Suavizantes', emoji: '🌸', imagen_url: null, orden: 2 },
  { id: 3, nombre: 'Detergentes', emoji: '🧼', imagen_url: null, orden: 3 },
  { id: 4, nombre: 'Desengrasantes', emoji: '🧹', imagen_url: null, orden: 4 },
  { id: 5, nombre: 'Desinfectantes', emoji: '🦠', imagen_url: null, orden: 5 },
  { id: 6, nombre: 'Pisos', emoji: '🏠', imagen_url: null, orden: 6 },
  { id: 7, nombre: 'Piletas', emoji: '🏊', imagen_url: null, orden: 7 },
  { id: 8, nombre: 'Automotor', emoji: '🚗', imagen_url: null, orden: 8 },
  { id: 9, nombre: 'Hogar', emoji: '🏡', imagen_url: null, orden: 9 },
  { id: 10, nombre: 'Concentrados', emoji: '🔬', imagen_url: null, orden: 10 },
  { id: 11, nombre: 'Materia Prima', emoji: '⚗️', imagen_url: null, orden: 11 },
  { id: 12, nombre: 'Bouquets', emoji: '🌺', imagen_url: null, orden: 12 },
  { id: 13, nombre: 'Contenedores', emoji: '📦', imagen_url: null, orden: 13 },
]

export function useCategorias() {
  const categorias = useCategoriasData()
  return { categorias: categorias.length ? categorias : fallback, loading: false }
}
