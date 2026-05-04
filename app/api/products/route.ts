import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { productSchema } from '@/lib/validations'
import { requireAdminAuth } from '@/lib/adminMiddleware'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('productos')
      .select('id, nombre, categoria, color, color2, emoji, activo, orden')
      .eq('activo', true)
      .order('categoria')
      .order('orden')

    if (category) {
      query = query.eq('categoria', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase fetch error:', error)
      return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdminAuth()
  if (authCheck.error) {
    return authCheck.response
  }

  try {
    const body = await request.json()

    const validationResult = productSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const productData = validationResult.data

    const { data, error } = await supabaseAdmin
      .from('productos')
      .insert([productData])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Error al crear el producto' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: data[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}