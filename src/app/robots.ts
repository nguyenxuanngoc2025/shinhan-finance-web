import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = 'https://shinhanfinance-clone.ngocnguyenxuan.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/(payload)/admin/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
