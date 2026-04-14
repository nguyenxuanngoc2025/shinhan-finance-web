import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import '../news.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import { NEWS_ARTICLES, type NewsCategory } from '../news-data'
import { supabaseAdmin } from '@/lib/supabase'
import TableOfContents from '@/components/TableOfContents'
import ShareButtons from '@/components/ShareButtons'

// Allow slugs not in generateStaticParams to be rendered on-demand (SSR)
export const dynamicParams = true
// ISR: cache 5 phút — không force SSR từng request
export const revalidate = 300

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  'khuyen-mai': 'Khuyến mại',
  'su-kien': 'Sự kiện',
  'thong-bao': 'Thông báo',
  'blog': 'Blog',
}

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  'khuyen-mai': '#e8a54b',
  'su-kien': '#007BC3',
  'thong-bao': '#e53935',
  'blog': '#43a047',
}

type Props = {
  params: Promise<{ slug: string }>
}

type ArticleData = {
  slug: string
  title: string
  excerpt: string
  content: string
  category: NewsCategory
  date: string
  image: string
  tags?: string[]
}

// Fetch single post by slug — dùng supabaseAdmin (service role), không fetch all
async function getCmsPostBySlug(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('slug,title,excerpt,content,cover_image,category,published_at,created_at,tags')
      .eq('status', 'published')
      .eq('slug', slug)
      .single()
    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

// Fetch recent published posts (for related section) — giới hạn 20 bài
async function getRecentCmsPosts(limit = 20) {
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('slug,title,excerpt,cover_image,category,published_at,tags')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

// Fetch all slugs for generateStaticParams (chỉ lấy slug field)
async function getAllCmsSlugs() {
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('slug')
      .eq('status', 'published')
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

// Convert CMS post to article format
function cmsToArticle(cmsPost: any, hardcoded?: any): ArticleData {
  let content = ''
  if (typeof cmsPost.content === 'string') {
    // Raw HTML string (legacy)
    content = cmsPost.content
  } else if (cmsPost.content && typeof cmsPost.content === 'object' && !Array.isArray(cmsPost.content)) {
    // Object format: {html: "...", type: "html"} — standard format post-migration
    content = cmsPost.content.html || cmsPost.content.text || cmsPost.content.body || ''
  } else if (Array.isArray(cmsPost.content)) {
    content = cmsPost.content.map((c: any) => c.text || c.html || '').join('')
  }

  // BUG #1 FIX: Strip any remaining full HTML document wrappers (frontier defense)
  // In case a new post sneaks through with <!DOCTYPE html>
  if (content.includes('<!DOCTYPE') || content.match(/<html[\s>]/i)) {
    // Try to extract <body> content
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch && bodyMatch[1]) {
      content = bodyMatch[1].trim()
    } else {
      // Strip all document wrappers
      content = content
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<html[^>]*>/gi, '')
        .replace(/<\/html>/gi, '')
        .replace(/<head>[\s\S]*?<\/head>/gi, '')
        .replace(/<\/?body[^>]*>/gi, '')
        .trim()
    }
  }

  // If CMS content is empty, use hardcoded content as fallback
  if (!content && hardcoded) {
    content = hardcoded.content
  }

  return {
    slug: cmsPost.slug,
    title: cmsPost.title,
    excerpt: cmsPost.excerpt || hardcoded?.excerpt || '',
    content,
    category: (cmsPost.category || hardcoded?.category || 'blog') as NewsCategory,
    date: cmsPost.published_at || cmsPost.created_at || hardcoded?.date || '',
    // Ảnh đại diện: ưu tiên cover_image → fallback lấy ảnh đầu tiên trong content (chỉ để hiển thị)
    image: cmsPost.cover_image || (() => {
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
      return imgMatch ? imgMatch[1] : (hardcoded?.image || '/images/news/default.jpg')
    })(),
    tags: Array.isArray(cmsPost.tags) ? cmsPost.tags : [],
  }
}

// Get article by slug — query trực tiếp thay vì fetch all
async function getArticle(slug: string): Promise<ArticleData | null> {
  const cmsPost = await getCmsPostBySlug(slug)
  const hardcoded = NEWS_ARTICLES.find(a => a.slug === slug)

  if (cmsPost) return cmsToArticle(cmsPost, hardcoded)
  return hardcoded || null
}

// Get related articles — score based on tag overlap, fallback to category
async function getRelatedArticles(category: string, currentSlug: string, currentTags: string[] = []): Promise<ArticleData[]> {
  const cmsPosts = await getRecentCmsPosts(50)
  
  const scoredPosts = cmsPosts
    .filter((p: any) => p.slug !== currentSlug)
    .map((p: any) => {
      let score = 0
      const pTags = Array.isArray(p.tags) ? p.tags : []
      if (currentTags.length > 0) {
        score += currentTags.filter(t => pTags.includes(t)).length * 10
      }
      if (p.category === category) {
        score += 5
      }
      return { post: p, score }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => cmsToArticle(item.post))
    
  // If not enough related via score, fallback to recent
  if (scoredPosts.length < 3) {
    const existingSlugs = new Set([...scoredPosts.map(p => p.slug), currentSlug])
    const fallbacks = cmsPosts
      .filter((p: any) => !existingSlugs.has(p.slug))
      .slice(0, 3 - scoredPosts.length)
      .map((p: any) => cmsToArticle(p))
    return [...scoredPosts, ...fallbacks]
  }

  return scoredPosts
}

export async function generateStaticParams() {
  // Include hardcoded slugs only.
  // We DELIBERATELY do not pre-render all CMS slugs here to prevent OOM
  // crashes on the VPS during 'next build' for hundreds of articles.
  // Instead, CMS articles will be generated on-demand (ISR) upon first visit
  // because export const dynamicParams = true.
  const params = NEWS_ARTICLES.map(article => ({ slug: article.slug }))

  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Không tìm thấy bài viết' }
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://tuvanvienshinhan.com'
  return {
    title: `${article.title} | Shinhan Bank`,
    description: article.excerpt,
    alternates: { canonical: `${siteUrl}/tin-tuc/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
      type: 'article',
      publishedTime: article.date,
      locale: 'vi_VN',
      siteName: 'Shinhan Bank Việt Nam',
    },
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://tuvanvienshinhan.com'

  // Schema.org: BreadcrumbList + Article
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Tin tức', item: `${siteUrl}/tin-tuc` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${siteUrl}/tin-tuc/${slug}` },
    ],
  }
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Organization', name: 'Shinhan Bank Việt Nam' },
    publisher: {
      '@type': 'Organization', name: 'Shinhan Bank Việt Nam',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/images/logo/logo-header.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/tin-tuc/${slug}` },
  }

  // Related articles: dùng getRelatedArticles hỗ trợ tags-based
  const related = await getRelatedArticles(article.category, slug, article.tags)

  return (
    <>
      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Header />
      <main className="news-page">
        <section className="news-detail">
          <div className="container">
            {/* Breadcrumb nav visible */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: 12, fontSize: 13, color: '#6b7280', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: '#007BC3', textDecoration: 'none' }}>Trang chủ</Link>
              <span>›</span>
              <Link href="/tin-tuc" style={{ color: '#007BC3', textDecoration: 'none' }}>Tin tức</Link>
              <span>›</span>
              <span style={{ color: '#374151' }}>{article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title}</span>
            </nav>
            <Link href="/tin-tuc" className="news-detail-back">
              <i className="fas fa-arrow-left"></i> Quay lại Bản tin
            </Link>

            <div className="news-detail-header">
              <span
                className="news-detail-category"
                style={{ background: CATEGORY_COLORS[article.category] || '#43a047' }}
              >
                {CATEGORY_LABELS[article.category] || article.category}
              </span>
              <h1 className="news-detail-title">{article.title}</h1>
              <span className="news-detail-date">{article.date ? formatDate(article.date) : ''}</span>
            </div>

            <TableOfContents selector=".news-detail-content" />

            <div
              className="news-detail-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <ShareButtons title={article.title} text={article.excerpt} />

            {/* Related articles */}
            {related.length > 0 && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 60, marginBottom: 24, color: '#333' }}>
                  Bài viết liên quan
                </h2>
                <div className="news-grid" style={{ paddingTop: 0 }}>
                  {related.map(r => (
                    <article key={r.slug} className="news-card">
                      <Link href={`/tin-tuc/${r.slug}`} style={{display:'block', textDecoration:'none'}}>
                        <div className="news-card-image">
                          <Image src={r.image} alt={r.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{objectFit:'cover'}} />
                        </div>
                      </Link>
                      <div className="news-card-body">
                        <span className="news-card-date">{formatDate(r.date)}</span>
                        <h3 className="news-card-title">
                          <Link href={`/tin-tuc/${r.slug}`}>{r.title}</Link>
                        </h3>
                        <p className="news-card-excerpt">{r.excerpt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}

