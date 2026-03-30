import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = 'https://tuvanvienshinhan.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/admin-login/', '/(payload)/admin/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
