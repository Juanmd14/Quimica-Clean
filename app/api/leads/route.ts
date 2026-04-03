import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Enviar email de notificación al admin
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Química Clean <onboarding@resend.dev>',
          to: 'admquimicaclean@gmail.com',
          subject: `📬 Nuevo Lead: ${nombre}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #e7a73f 0%, #c8882a 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">Nuevo Lead Recibido</h1>
              </div>
              
              <div style="background: #f8f9fb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a2332;">Nombre:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #4a5568;">${nombre}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a2332;">Teléfono:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #4a5568;"><a href="tel:${telefono}" style="color: #2b7bb8; text-decoration: none;">${telefono}</a></td>
                  </tr>
                  ${email ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a2332;">Email:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #4a5568;"><a href="mailto:${email}" style="color: #2b7bb8; text-decoration: none;">${email}</a></td>
                  </tr>
                  ` : ''}
                  ${producto_interes ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a2332;">Producto Interés:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #4a5568;">${producto_interes}</td>
                  </tr>
                  ` : ''}
                  ${mensaje ? `
                  <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #1a2332; vertical-align: top;">Mensaje:</td>
                    <td style="padding: 12px 0; color: #4a5568;">${mensaje.replace(/\n/g, '<br>')}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <div style="background: white; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <a href="https://quimica-clean.com" style="display: inline-block; background: #2b7bb8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 12px;">
                  Ver en el admin
                </a>
                <p style="color: #8a9ab0; font-size: 12px; margin: 0;">
                  Lead recibido el ${new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Email error:', emailError)
        // No bloqueamos el request si falla el email
      }
    }

    return NextResponse.json({ message: 'Lead guardado correctamente', data }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}