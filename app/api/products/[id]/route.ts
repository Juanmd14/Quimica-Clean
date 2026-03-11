// Get, Update, Delete Product by ID
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createClient} from '@/lib/supabase'
const supabase = createClient()
import { productSchema } from '@/lib/validations'
import { requireAdminAuth } from '@/lib/adminMiddleware'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('products')
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
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const authCheck = await requireAdminAuth()
  if (authCheck.error) {
    return authCheck.response
  }

  try {
    const { id } = await params
    const body = await request.json()

    // Validate input with Zod
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

    // Update in Supabase
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        image_url: productData.image_url,
        stock: productData.stock,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado o error en actualización' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error)
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const authCheck = await requireAdminAuth()
  if (authCheck.error) {
    return authCheck.response
  }

  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Error al eliminar el producto' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Producto eliminado' })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}
