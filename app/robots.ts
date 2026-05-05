import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    ],
    sitemap: 'https://quimica-clean.com/sitemap.xml',
    host: 'https://quimica-clean.com',
  }
}
