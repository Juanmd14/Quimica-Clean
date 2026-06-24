'use client'

import dynamic from 'next/dynamic'

export type ChatContext =
  | { type: 'home' }
  | { type: 'catalog' }
  | { type: 'product'; name: string; id: number }

const WhatsAppChat = dynamic(
  () => import('./WhatsAppChat').then(m => ({ default: m.WhatsAppChat })),
  { ssr: false },
)

export default function WhatsAppChatLazy({ context }: { context?: ChatContext }) {
  return <WhatsAppChat context={context} />
}
