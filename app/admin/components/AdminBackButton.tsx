'use client'

import Link from 'next/link'
import { useState } from 'react'

const C = {
  card: '#1a2436',
  border: '#2a3a54',
  blue: '#2b7bb8',
  text: '#f1f5f9',
  textMid: '#94a3b8',
}

export default function AdminBackButton({ label = 'Volver al panel' }: { label?: string }) {
  const [hover, setHover] = useState(false)

  return (
    <Link
      href="/admin/dashboard"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: C.card,
        border: `1.5px solid ${hover ? C.blue : C.border}`,
        color: hover ? C.blue : C.text,
        padding: '10px 18px',
        borderRadius: '10px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'DM Sans, sans-serif',
        transition: 'all 0.2s ease',
        transform: hover ? 'translateX(-2px)' : 'translateX(0)',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  )
}
