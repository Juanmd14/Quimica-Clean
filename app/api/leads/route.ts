import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, producto_interes, mensaje } = body

    // Validaciones
    if (!nombre || !telefono) {
      return NextResponse.json({ error: 'Nombre y teléfono son obligatorios' }, { status: 400 })
    }

    if (nombre.length > 100 || telefono.length > 20) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    if (mensaje && mensaje.length > 500) {
      return NextResponse.json({ error: 'Mensaje demasiado largo' }, { status: 400 })
    }

    if (/(.)\1{10,}/.test(nombre + telefono + (mensaje || ''))) {
      return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 })
    }

    // Guardar lead en Supabase
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([{ nombre, email, telefono, producto_interes, mensaje }])
      .select()

    if (error) {
      console.error('Lead error:', error)
      return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 })
    }

    // Email notification would go here in the future
    // For now, we just save to the database

    return NextResponse.json({ message: 'Lead guardado correctamente', data }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}