import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { productSchema } from '@/lib/validations'
import { requireAdminAuth } from '@/lib/adminMiddleware'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin  
      .from('productos')                          
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
