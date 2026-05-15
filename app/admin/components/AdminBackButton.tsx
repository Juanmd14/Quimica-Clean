'use client'

import Link from 'next/link'
import { useState } from 'react'

const C = {
  gold: '#e7a73f',
  goldDark: '#c98c2b',
  white: '#ffffff',
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
        gap: '8px',
        background: hover ? C.gold : 'rgba(231, 167, 63, 0.12)',
        border: `1.5px solid ${hover ? C.gold : 'rgba(231, 167, 63, 0.45)'}`,
        color: hover ? C.white : C.gold,
        padding: '7px 14px 7px 9px',
        borderRadius: '999px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'DM Sans, sans-serif',
        letterSpacing: '0.01em',
        transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: hover ? '0 4px 14px rgba(231, 167, 63, 0.35)' : 'none',
      }}
    >
      <span
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: hover ? C.white : C.gold,
          color: hover ? C.gold : C.white,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
          transform: hover ? 'translateX(-3px)' : 'translateX(0)',
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </span>
      {label}
    </Link>
  )
}
