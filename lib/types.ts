// Data Models Types

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  description?: string
}

export interface Order {
  id: string
  user_id: string
  products: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  quantity: number
  price: number
}

export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface AdminSession {
  authenticated: boolean
  email?: string
  timestamp: number
}
