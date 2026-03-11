import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nombre, telefono, producto_interes, mensaje } = body

  // Validación básica
  if (!nombre || !telefono) {
    return NextResponse.json({ error: 'Nombre y teléfono son obligatorios' }, { status: 400 })
  }

  // Validación anti-spam
  if (nombre.length > 100 || telefono.length > 20) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }
  if (mensaje && mensaje.length > 500) {
    return NextResponse.json({ error: 'Mensaje demasiado largo' }, { status: 400 })
  }
  if (/(.)\1{10,}/.test(nombre + telefono + (mensaje || ''))) {
    return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert([{ nombre, telefono, producto_interes, mensaje }])
    .select()

  if (error) {
    console.error('Lead error:', error)
    return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Lead guardado correctamente', data }, { status: 201 })
}