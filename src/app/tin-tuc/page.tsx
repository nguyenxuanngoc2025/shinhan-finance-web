import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import './news.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import { NEWS_ARTICLES, CATEGORIES, type NewsCategory } from './news-data'
import { supabaseAdmin } from '@/lib/supabase'
import NewsTabs from './NewsTabs'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tin tức & Khuyến mãi | Shinhan Bank',
  description: 'Cập nhật tin tức, khuyến mãi, sự kiện và thông báo mới nhất từ Shinhan Bank Việt Nam. Ưu đãi vay tín chấp, thẻ tín dụng THE FIRST.',
  alternates: { canonical: 'https://tuvanvienshinhan.com/tin-tuc' },
  openGraph: {
    title: 'Tin tức & Khuyến mãi | Shinhan Bank',
    description: 'Cập nhật tin tức, khuyến mãi, sự kiện mới nhất từ Shinhan Bank Việt Nam.',
    type: 'website',
    locale: 'vi_VN',
  },
}

type ArticleItem = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
}

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  'khuyen-mai': 'Khuyến mại',
  'su-kien': 'Sự kiện',
  'thong-bao': 'Thông báo',
  'blog': 'Blog',
}

const SECTION_CATEGORIES: NewsCategory[] = ['thong-bao', 'su-kien', 'khuyen-mai', 'blog']
const VALID_TABS = ['tat-ca', 'khuyen-mai', 'su-kien', 'thong-bao', 'blog']

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function NewsCard({ article }: { article: ArticleItem }) {
  return (
    <article className="news-card">
      <Link href={`/tin-tuc/${article.slug}`} style={{display:'block', textDecoration:'none'}}>
        <div className="news-card-image">
          <Image src={article.image} alt={article.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{objectFit:'cover'}} />
        </div>
      </Link>
      <div className="news-card-body">
        <span className="news-card-date">{formatDate(article.date)}</span>
        <h3 className="news-card-title">
          <Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="news-card-excerpt">{article.excerpt}</p>
        <Link href={`/tin-tuc/${article.slug}`} className="news-card-readmore">
          Đọc tiếp <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </article>
  )
}

// Fetch articles server-side
async function getArticles(): Promise<ArticleItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('slug,title,excerpt,cover_image,category,published_at,created_at,status')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(100)

    if (error || !data || data.length === 0) return hardcodedToItems()

    const published = data
      .filter(p => p.cover_image)
      .map(p => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || '',
        category: p.category || 'blog',
        date: p.published_at || p.created_at || '',
        image: p.cover_image || '/images/news/default.jpg',
      }))

    return published.length > 0 ? published : hardcodedToItems()
  } catch {
    return hardcodedToItems()
  }
}

function hardcodedToItems(): ArticleItem[] {
  return NEWS_ARTICLES.map(a => ({
    slug: a.slug, title: a.title, excerpt: a.excerpt, category: a.category, date: a.date, image: a.image,
  }))
}

type Props = {
  searchParams: Promise<{ tab?: string }>
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams
  const tab = VALID_TABS.includes(params.tab || '') ? params.tab! : 'tat-ca'
  const articles = await getArticles()

  const filtered = tab === 'tat-ca'
    ? articles
    : articles.filter(a => a.category === tab)

  const articlesByCategory = SECTION_CATEGORIES.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    articles: articles.filter(a => a.category === cat),
  })).filter(g => g.articles.length > 0)

  return (
    <>
      <Header />
      <main className="news-page">
        {/* Hero */}
        <section className="news-hero">
          <div className="container">
            <h1>Bản tin</h1>
            <p>Tin tức, khuyến mại và sự kiện mới nhất từ Shinhan Bank</p>
          </div>
        </section>

        {/* Category tabs — client component for interactivity */}
        <NewsTabs activeTab={tab} categories={CATEGORIES} />

        {/* Content area */}
        <div className="container">
          {tab === 'tat-ca' ? (
            <>
              {/* Featured: 3 bài mới nhất */}
              <section className="news-featured">
                <div className="news-featured-grid">
                  {articles.slice(0, 3).map(article => (
                    <NewsCard key={article.slug} article={article} />
                  ))}
                </div>
              </section>

              {/* Sections by category */}
              {articlesByCategory.map(group => (
                <section key={group.category} className="news-section">
                  <div className="news-section-header">
                    <h2 className="news-section-title">{group.label}</h2>
                    <Link
                      href={`/tin-tuc?tab=${group.category}`}
                      className="news-section-more"
                    >
                      Xem tiếp <i className="fas fa-chevron-right"></i>
                    </Link>
                  </div>
                  <div className="news-section-content">
                    {group.articles.slice(0, 1).map(article => (
                      <NewsCard key={article.slug} article={article} />
                    ))}
                  </div>
                </section>
              ))}
            </>
          ) : (
            <>
              {filtered.length === 0 ? (
                <div className="news-empty">
                  <i className="fas fa-newspaper"></i>
                  <p>Chưa có bài viết trong danh mục này</p>
                </div>
              ) : (
                <div className="news-grid">
                  {filtered.map(article => (
                    <NewsCard key={article.slug} article={article} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
