import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import '../news.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import { NEWS_ARTICLES, type NewsCategory } from '../news-data'

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

// Fetch post from CMS API (server-side)
async function getPostFromCMS(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005'
    const res = await fetch(`${baseUrl}/api/cms/posts`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const { data } = await res.json()
    return data?.find((p: any) => p.slug === slug) || null
  } catch {
    return null
  }
}

// Merge CMS data with hardcoded fallback
async function getArticle(slug: string) {
  // Try CMS first
  const cmsPost = await getPostFromCMS(slug)
  // Also get hardcoded version
  const hardcoded = NEWS_ARTICLES.find(a => a.slug === slug)

  if (cmsPost) {
    // Convert CMS post format to article format
    let content = ''
    if (typeof cmsPost.content === 'string') {
      content = cmsPost.content
    } else if (Array.isArray(cmsPost.content)) {
      content = cmsPost.content.map((c: any) => c.text || c.html || '').join('')
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
      image: cmsPost.cover_image || hardcoded?.image || '/images/news/default.jpg',
    }
  }

  // Fallback to hardcoded
  return hardcoded || null
}

export async function generateStaticParams() {
  return NEWS_ARTICLES.map(article => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Không tìm thấy bài viết' }
  return {
    title: `${article.title} | Shinhan Finance`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
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

  // Related articles: try CMS first, fallback hardcoded
  const related = NEWS_ARTICLES
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3)

  return (
    <>
      <Header />
      <main className="news-page">
        <section className="news-detail">
          <div className="container">
            <Link href="/tin-tuc" className="news-detail-back">
              <i className="fas fa-arrow-left"></i> Quay lại Bản tin
            </Link>

            <div className="news-detail-header">
              <span
                className="news-detail-category"
                style={{ background: CATEGORY_COLORS[article.category] }}
              >
                {CATEGORY_LABELS[article.category]}
              </span>
              <h1 className="news-detail-title">{article.title}</h1>
              <span className="news-detail-date">{article.date ? formatDate(article.date) : ''}</span>
            </div>

            <Image
              src={article.image}
              alt={article.title}
              className="news-detail-cover"
              width={900}
              height={480}
              style={{objectFit:'cover', width:'100%', height:'auto'}}
              priority
            />

            <div
              className="news-detail-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

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
