import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const resend = new Resend(process.env.RESEND_API_KEY)

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
      return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 })
    }

    // Enviar notificación por email
    const { error: emailError } = await resend.emails.send({
      from: 'Química Clean <notificaciones@tudominio.com>',
      to: 'admquimicaclean@gmail.com',
      subject: `Nueva consulta de ${nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1a1a2e; margin: 0 0 20px;">Nueva consulta recibida</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 130px;">Nombre</td>
              <td style="padding: 8px 0; font-weight: 600; color: #111827;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Teléfono</td>
              <td style="padding: 8px 0; font-weight: 600; color: #111827;">${telefono}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Producto</td>
              <td style="padding: 8px 0; color: #111827;">${producto_interes || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Mensaje</td>
              <td style="padding: 8px 0; color: #111827;">${mensaje || '—'}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
            Química Clean · San Miguel de Tucumán
          </div>
        </div>
      `,
    })

    if (emailError) {
      // El lead ya se guardó — solo loguear, no fallar el request
      console.error('Resend error:', emailError)
    }

    return NextResponse.json({ message: 'Lead guardado correctamente', data }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}