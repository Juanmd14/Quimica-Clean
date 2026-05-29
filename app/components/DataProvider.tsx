'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Producto, Categoria } from '@/lib/types'

type DataCtx = {
  productos: Producto[]
  categorias: Categoria[]
}

const Ctx = createContext<DataCtx | null>(null)

export function DataProvider({
  productos,
  categorias,
  children,
}: DataCtx & { children: ReactNode }) {
  return <Ctx.Provider value={{ productos, categorias }}>{children}</Ctx.Provider>
}

export function useProductosData(): Producto[] {
  return useContext(Ctx)?.productos ?? []
}

export function useCategoriasData(): Categoria[] {
  return useContext(Ctx)?.categorias ?? []
}
