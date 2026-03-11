import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nombre, telefono, producto_interes, mensaje } = body

  // Validación básica
  if (!nombre || !telefono) {
    return NextResponse.json(
      { error: 'Nombre y teléfono son obligatorios' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert([{ nombre, telefono, producto_interes, mensaje }])
    .select()

  if (error) {
    return NextResponse.json(
      { error: 'Error al guardar el lead' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: 'Lead guardado correctamente', data },
    { status: 201 }
  )
}