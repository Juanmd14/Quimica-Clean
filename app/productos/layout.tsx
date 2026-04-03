import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Productos | Química Clean',
  description: 'Catálogo completo de productos de limpieza concentrados y materias primas de Química Clean para mayoristas y revendedores.',
}

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
