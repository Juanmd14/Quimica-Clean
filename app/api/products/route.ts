import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdminAuth } from '@/lib/adminMiddleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = getSupabaseAdmin()
      .from('productos')
      .select('id, nombre, categoria, descripcion, color, color2, emoji, imagen_url, activo, orden')
      .order('categoria')
      .order('orden')

    if (category) query = query.eq('categoria', category)

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
  try {
    const authCheck = await requireAdminAuth()
    if (authCheck.error) {
      console.error('Auth error:', authCheck.response)
      return authCheck.response
    }
  } catch (authErr) {
    console.error('requireAdminAuth error:', authErr)
    return NextResponse.json({ error: 'Error en autenticación', details: String(authErr) }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { nombre, categoria, descripcion, color, color2, emoji, imagen_url, activo, orden } = body

    if (!nombre?.trim() || !categoria?.trim()) {
      return NextResponse.json({ error: 'Nombre y categoría son requeridos' }, { status: 400 })
    }

    console.log('Creating product:', { nombre, categoria })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseAdmin() as any)
      .from('productos')
      .insert([{ nombre, categoria, descripcion, color, color2, emoji, imagen_url, activo: activo ?? true, orden: orden ?? 0 }])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Error al crear el producto', details: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('POST products error:', err)
    return NextResponse.json({ error: 'Error en el servidor', details: String(err) }, { status: 500 })
  }
}
