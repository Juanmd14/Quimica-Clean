import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdminAuth } from '@/lib/adminMiddleware'
import { revalidateTag } from 'next/cache'

export const revalidate = 3600

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('categorias')
      .select('*')
      .order('orden')

    if (error) {
      console.error('Supabase error category:', error)
      return NextResponse.json({ error: 'Error al obtener categorías', details: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, data: data || [] })
  } catch (err) {
    console.error('Catch error:', err)
    return NextResponse.json({ error: 'Error en el servidor', details: String(err) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireAdminAuth()
    if (authCheck.error) return authCheck.response
  } catch (err) {
    console.error('Auth error en categorias:', err)
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const nombre = (body.nombre as string) || ''
    const emoji = body.emoji as string | undefined
    const orden = body.orden as number | undefined

    if (!nombre?.trim()) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 })
    }

    const insertData = { nombre, emoji: emoji ?? null, orden: orden ?? 0 }

    const { data, error } = await getSupabaseAdmin()
      .from('categorias')
      .insert([insertData])
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al crear categoría', details: error.message }, { status: 500 })
    revalidateTag('categorias', { expire: 0 })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('POST categorias error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authCheck = await requireAdminAuth()
    if (authCheck.error) return authCheck.response
  } catch (err) {
    console.error('Auth error en categorias:', err)
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = body.id as number
    const emoji = body.emoji
    const imagen_url = body.imagen_url
    const orden = body.orden

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
      .from('categorias')
      .update({ emoji, imagen_url, orden })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al actualizar categoría', details: error.message }, { status: 500 })
    revalidateTag('categorias', { expire: 0 })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('PUT categorias error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}