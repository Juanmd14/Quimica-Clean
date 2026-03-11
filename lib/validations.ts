// Zod validation schemas

import { z } from 'zod'

// Product Validation
export const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  category: z.string().min(1, 'Debes seleccionar una categoría'),
  image_url: z.string().url('Debes proporcionar una URL válida'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
})

export type CreateProductInput = z.infer<typeof productSchema>

// Login Validation
export const loginSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Contact Form Validation
export const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  phone: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

// Order Validation
export const orderSchema = z.object({
  product_id: z.string(),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
})

export type OrderInput = z.infer<typeof orderSchema>
