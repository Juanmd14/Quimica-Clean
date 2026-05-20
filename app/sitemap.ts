import type { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { categories } from '@/app/components/constants'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://quimica-clean.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/productos`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const categoryUrls: MetadataRoute.Sitemap = categories.map(c => ({
    url: `${BASE}/productos?cat=${encodeURIComponent(c.name)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  let productUrls: MetadataRoute.Sitemap = []
  try {
    const { data } = await getSupabaseAdmin()
      .from('productos')
      .select('id')
      .eq('activo', true)
    if (data) {
      productUrls = (data as { id: number }[]).map(p => ({
        url: `${BASE}/productos/${p.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
    }
  } catch {
    // Fail silently — sitemap should still work without DB
  }

  return [...staticUrls, ...categoryUrls, ...productUrls]
}
