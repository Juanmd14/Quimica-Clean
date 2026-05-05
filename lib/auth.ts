// Authentication middleware for admin routes

import { cookies } from 'next/headers'

const ADMIN_SESSION_COOKIE = 'admin_session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

/**
 * Verifies if the user has a valid admin session
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_SESSION_COOKIE)
    
    if (!session) return false
    
    try {
      const sessionData = JSON.parse(session.value)
      // Check if session is still valid (24 hours)
      const isValid = Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000
      return isValid
    } catch {
      return false
    }
  } catch {
    return false
  }
}

/**
 * Creates an admin session with a password
 */
export async function createAdminSession(password: string): Promise<boolean> {
  if (password !== ADMIN_PASSWORD) {
    return false
  }

  try {
    const cookieStore = await cookies()
    const sessionData = {
      authenticated: true,
      timestamp: Date.now(),
    }

    cookieStore.set(ADMIN_SESSION_COOKIE, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return true
  } catch {
    return false
  }
}

/**
 * Destroys the admin session
 */
export async function destroyAdminSession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(ADMIN_SESSION_COOKIE)
  } catch (err) {
    console.error('destroyAdminSession failed:', err)
  }
}
