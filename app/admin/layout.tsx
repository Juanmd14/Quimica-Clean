'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return // ← no chequear auth en la página de login

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/session')
        const data = await response.json()
        if (!data.authenticated) router.push('/admin/login')
        setAuthenticated(data.authenticated)
      } catch {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router, isLoginPage])

  // En login, mostrar directo sin chequeo
  if (isLoginPage) return <>{children}</>

  if (authenticated === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '18px', color: '#666' }}>
        Cargando...
      </div>
    )
  }

  if (!authenticated) return null

  return <>{children}</>
}