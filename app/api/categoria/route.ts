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
    const body = await request.json()
    const nombre = body.nombre as string
    const emoji = body.emoji as string | undefined
    const orden = body.orden as number | undefined

    if (!nombre?.trim()) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = { nombre }
    if (emoji) insertData.emoji = emoji
    if (orden != null) insertData.orden = orden

    const { data, error } = await getSupabaseAdmin()
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