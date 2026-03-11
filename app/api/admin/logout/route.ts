// Admin Logout API Route

import { destroyAdminSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    await destroyAdminSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}
