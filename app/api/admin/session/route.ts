// Check Admin Session API Route

import { verifyAdminSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession()
    return NextResponse.json({ authenticated: isAuthenticated })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}
