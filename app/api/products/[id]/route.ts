import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdminAuth } from '@/lib/adminMiddleware'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await getSupabaseAdmin()
      .from('productos')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('GET product[id] error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdminAuth()
  if (authCheck.error) return authCheck.response

  try {
    const { id } = await params
    const body = await request.json()

    const ALLOWED = ['nombre', 'categoria', 'descripcion', 'color', 'color2', 'emoji', 'imagen_url', 'activo', 'orden']
    const updates: Record<string, unknown> = {}
    for (const key of ALLOWED) {
      if (key in body) updates[key] = body[key]
    }

    const { data, error } = await getSupabaseAdmin()
      .from('productos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    revalidateTag('productos', { expire: 0 })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('PUT product[id] error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdminAuth()
  if (authCheck.error) return authCheck.response

  try {
    const { id } = await params
    const { error } = await getSupabaseAdmin().from('productos').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
    revalidateTag('productos', { expire: 0 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE product[id] error:', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
