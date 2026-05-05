import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdminAuth } from '@/lib/adminMiddleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabaseAdmin
      .from('productos')
      .select('id, nombre, categoria, descripcion, color, color2, emoji, imagen_url, activo, orden')
      .order('categoria')
      .order('orden')

    if (category) query = query.eq('categoria', category)

    // Admin panel pide todos; público solo los activos
    const onlyActive = searchParams.get('all') !== 'true'
    if (onlyActive) query = query.eq('activo', true)

    const { data, error } = await query
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Error al obtener productos', details: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: data || [] })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdminAuth()
  if (authCheck.error) return authCheck.response

  try {
    const { nombre, categoria, descripcion, color, color2, emoji, imagen_url, activo, orden } = await request.json()

    if (!nombre?.trim() || !categoria?.trim()) {
      return NextResponse.json({ error: 'Nombre y categoría son requeridos' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('productos')
      .insert([{ nombre, categoria, descripcion, color, color2, emoji, imagen_url, activo: activo ?? true, orden: orden ?? 0 }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
