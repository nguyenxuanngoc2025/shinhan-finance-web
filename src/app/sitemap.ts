import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://tuvanvienshinhan.com'

// Static pages
const staticPages: MetadataRoute.Sitemap = [
  { url: BASE,                              lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
  { url: `${BASE}/san-pham/vay-tin-chap`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/san-pham/the-tin-dung`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/san-pham/vay-tra-gop`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/dang-ky-vay`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
  { url: `${BASE}/mo-the`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
  { url: `${BASE}/tin-tuc`,               lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
  { url: `${BASE}/chinh-sach-bao-mat`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/mien-tru-trach-nhiem`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { db: { schema: 'site_shinhan' } }
    )

    // Lấy tất cả bài published
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    const postPages: MetadataRoute.Sitemap = (posts ?? []).map(post => ({
      url: `${BASE}/tin-tuc/${post.slug}`,
      lastModified: new Date(post.updated_at ?? post.published_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    return [...staticPages, ...postPages]
  } catch {
    // Fallback to static only if DB fails
    return staticPages
  }
}
