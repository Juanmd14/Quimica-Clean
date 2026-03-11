import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Cliente admin (solo server-side, bypasea RLS)
export const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tipos
export type Producto = {
  id: number
  categoria: string
  nombre: string
  color: string | null
  color2: string | null
  emoji: string | null
  activo: boolean
  orden: number
}

export const CATEGORIAS = [
  'Jabones', 'Suavizantes', 'Detergentes', 'Desengrasantes',
  'Desinfectantes', 'Pisos', 'Piletas', 'Automotor',
  'Hogar', 'Concentrados', 'Materia Prima', 'Bouquets', 'Contenedores',
] as const

