'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/session')
        const data = await response.json()
        
        if (!data.authenticated) {
          router.push('/admin/login')
        }
        
        setAuthenticated(data.authenticated)
      } catch (err) {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router])

  if (authenticated === null) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666',
      }}>
        Cargando...
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
