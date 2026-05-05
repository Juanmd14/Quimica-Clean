import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdminAuth } from '@/lib/adminMiddleware'

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabaseAdmin() as any
    const { data, error } = await supabase
      .from('categoria')
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
  } catch {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseAdmin() as any)
      .from('categoria')
      .insert([insertData])
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al crear categoría', details: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authCheck = await requireAdminAuth()
    if (authCheck.error) return authCheck.response
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = body.id as number
    const emoji = body.emoji
    const orden = body.orden

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseAdmin() as any)
      .from('categoria')
      .update({ emoji, orden })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al actualizar categoría', details: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}