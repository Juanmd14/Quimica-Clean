'use client'

import dynamic from 'next/dynamic'

const WhatsAppChat = dynamic(
  () => import('./WhatsAppChat').then(m => ({ default: m.WhatsAppChat })),
  { ssr: false }
)

export default function WhatsAppChatLazy() {
  return <WhatsAppChat />
}
