// Helper to protect admin API routes

import { verifyAdminSession } from './auth'
import { NextResponse } from 'next/server'

/**
 * Middleware para verificar que solo admins accedan a ciertas rutas
 */
export async function requireAdminAuth() {
  const isAuthenticated = await verifyAdminSession()
  
  if (!isAuthenticated) {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'No autorizado. Debes estar autenticado como admin.' },
        { status: 401 }
      ),
    }
  }

  return { error: false }
}
