// Configuration constants for the application

export const CONFIG = {
  // Brand & UI
  BRAND_NAME: 'Quimica Clean',
  PRIMARY_COLOR: '#e7a73f',
  SECONDARY_COLOR: '#25D366',
  
  // WhatsApp
  WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+543813046228',
  
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  
  // Admin
  ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
  
  // API
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
}

// Navigation links
export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '#productos' },
  { label: 'Categorías', href: '#categorias' },
  { label: 'Contacto', href: '#contacto' },
]

// Categories
export const CATEGORIES = [
  { id: 1, name: 'Limpiadores', icon: '🧹' },
  { id: 2, name: 'Desinfectantes', icon: '🦠' },
  { id: 3, name: 'Detergentes', icon: '🧼' },
  { id: 4, name: 'Especializados', icon: '🔬' },
]
