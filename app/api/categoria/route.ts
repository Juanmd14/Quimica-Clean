import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('categoria')
      .select('*')
      .order('orden')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Error al obtener categorías', details: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: data || [] })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, emoji, orden } = await request.json()

    if (!nombre?.trim()) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
      .from('categoria')
      .insert([{ nombre, emoji: emoji ?? '📦', orden: orden ?? 0 }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al crear categoría', details: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}