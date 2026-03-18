import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://shinhanfinance-clone.ngocnguyenxuan.com'
  const now = new Date().toISOString()

  return [
    // ── Trang chủ ──
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },

    // ── Sản phẩm ──
    { url: `${base}/san-pham/vay-tin-chap`,   lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/san-pham/the-tin-dung`,   lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/san-pham/vay-tra-gop`,    lastModified: now, changeFrequency: 'weekly', priority: 0.8 },

    // ── Đăng ký ──
    { url: `${base}/dang-ky-vay`,             lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/mo-the`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.85 },

    // ── Tin tức ──
    { url: `${base}/tin-tuc`,                 lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/tin-tuc?tab=khuyen-mai`,  lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${base}/tin-tuc?tab=su-kien`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/tin-tuc?tab=thong-bao`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/tin-tuc?tab=blog`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.65 },

    // ── Chính sách / Pháp lý ──
    { url: `${base}/chinh-sach-bao-mat`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/mien-tru-trach-nhiem`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]
}
