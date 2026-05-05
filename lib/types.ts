// Tipos del esquema Supabase (filas de cada tabla pública).

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

export type Categoria = {
  id: number
  nombre: string
  emoji: string | null
  imagen_url: string | null
  orden: number
}

export type Lead = {
  id: number
  nombre: string
  telefono: string
  producto_interes: string | null
  mensaje: string | null
  created_at: string
}
