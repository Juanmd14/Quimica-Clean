// Products API Route

import { supabase, supabaseAdmin } from '@/lib/supabase'
import { productSchema } from '@/lib/validations'
import { requireAdminAuth } from '@/lib/adminMiddleware'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'

    let query = supabase.from('products').select('*', { count: 'exact' })

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category)
    }

    // Apply pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Error al obtener productos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Verify admin authentication
  const authCheck = await requireAdminAuth()
  if (authCheck.error) {
    return authCheck.response
  }

  try {
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

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          image_url: productData.image_url,
          stock: productData.stock,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
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
