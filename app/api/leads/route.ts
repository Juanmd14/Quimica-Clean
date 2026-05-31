import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, telefono, producto_interes, mensaje } = body

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
      .insert([{ nombre, telefono, producto_interes, mensaje }])
      .select()

    if (error) {
      console.error('Lead error:', error)
      return NextResponse.json({ error: 'Error al guardar el lead', detail: error.message, code: error.code }, { status: 500 })
    }

    // Notificar al admin por email (no bloquea la respuesta si falla)
    if (resend) {
      resend.emails.send({
        from: 'Quimica Clean <onboarding@resend.dev>',
        to: 'admquimicaclean@gmail.com',
        subject: `Nuevo lead: ${nombre}`,
        html: `
          <h2>Nuevo contacto desde el sitio</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Teléfono:</strong> ${telefono}</p>
          ${producto_interes ? `<p><strong>Producto de interés:</strong> ${producto_interes}</p>` : ''}
          ${mensaje ? `<p><strong>Mensaje:</strong> ${mensaje}</p>` : ''}
          <hr/>
          <p style="color:#888;font-size:12px">Enviado desde quimica-clean.com</p>
        `,
      }).catch(err => console.error('Resend error:', err))
    }

    return NextResponse.json({ message: 'Lead guardado correctamente', data }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}