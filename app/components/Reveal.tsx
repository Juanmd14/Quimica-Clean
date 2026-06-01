'use client'

import { useInView } from '@/lib/hooks'

export function Reveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.15, once: true })

  return (
    <div
      ref={ref}
      className={`qc-reveal${inView ? ' qc-reveal-in' : ''}${className ? ' ' + className : ''}`}
      style={{ animationDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </div>
  )
}
