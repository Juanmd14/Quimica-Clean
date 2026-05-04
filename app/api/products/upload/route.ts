import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdminAuth } from '@/lib/adminMiddleware'

export async function POST(request: NextRequest) {
  const authCheck = await requireAdminAuth()
  if (authCheck.error) return authCheck.response

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const filename = `${Date.now()}-${file.name}`

    const { data, error } = await supabaseAdmin.storage
      .from('productos')
      .upload(filename, bytes, { contentType: 'image/webp', upsert: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('productos')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 })
  }
}
