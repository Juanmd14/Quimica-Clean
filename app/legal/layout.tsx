import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal | Química Clean',
  description: 'Políticas de privacidad, términos de uso y avisos legales de Química Clean.',
  robots: 'noindex, follow',
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
