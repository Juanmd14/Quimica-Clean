import { createBrowserClient } from '@supabase/ssr'


export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Tipos
export type Producto = {
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

export const CATEGORIAS = [
  'Jabones', 'Suavizantes', 'Detergentes', 'Desengrasantes',
  'Desinfectantes', 'Pisos', 'Piletas', 'Automotor',
  'Hogar', 'Concentrados', 'Materia Prima', 'Bouquets', 'Contenedores',
  'Jabon de manos',
] as const

