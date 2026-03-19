'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './news.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import { NEWS_ARTICLES, CATEGORIES, type NewsCategory } from './news-data'

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

// Convert hardcoded articles to unified format
function hardcodedToItems(): ArticleItem[] {
  return NEWS_ARTICLES.map(a => ({
    slug: a.slug, title: a.title, excerpt: a.excerpt, category: a.category, date: a.date, image: a.image,
  }))
}

// Inner component đọc searchParams — phải nằm trong Suspense
function NewsPageInner() {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') ?? 'tat-ca'
  const [activeTab, setActiveTab] = useState<string>(
    VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'tat-ca'
  )
  const [articles, setArticles] = useState<ArticleItem[]>(hardcodedToItems())

  // Fetch from CMS API — override hardcoded if available
  useEffect(() => {
    fetch('/api/cms/posts')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          type RawPost = { slug: string; title: string; excerpt?: string; category?: string; published_at?: string; created_at?: string; cover_image?: string; status: string }
          const published = (res.data as RawPost[])
            .filter(p => p.status === 'published')
            .map(p => ({
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt || '',
              category: p.category || 'blog',
              date: p.published_at || p.created_at || '',
              image: p.cover_image || '/images/news/default.jpg',
            }))
          if (published.length > 0) {
            setArticles(published)
          }
        }
      })
      .catch(() => { /* keep fallback */ })
  }, [])

  const derivedTab = VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'tat-ca'
  const effectiveTab = derivedTab !== activeTab && derivedTab !== 'tat-ca' ? derivedTab : activeTab

  const filtered = effectiveTab === 'tat-ca'
    ? articles
    : articles.filter(a => a.category === effectiveTab)

  const articlesByCategory = SECTION_CATEGORIES.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    articles: articles.filter(a => a.category === cat),
  })).filter(g => g.articles.length > 0)

  return (
    <main className="news-page">
      {/* Hero */}
      <section className="news-hero">
        <div className="container">
          <h1>Bản tin</h1>
          <p>Tin tức, khuyến mại và sự kiện mới nhất từ Shinhan Finance</p>
        </div>
      </section>

      {/* Category tabs */}
      <nav className="news-tabs">
        <div className="container">
          <div className="news-tabs-list">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`news-tab${effectiveTab === cat.id ? ' active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content area */}
      <div className="container">
        {effectiveTab === 'tat-ca' ? (
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
                  <button
                    className="news-section-more"
                    onClick={() => setActiveTab(group.category)}
                  >
                    Xem tiếp <i className="fas fa-chevron-right"></i>
                  </button>
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
  )
}

export default function NewsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="news-page">
          <section className="news-hero">
            <div className="container"><h1>Bản tin</h1></div>
          </section>
        </main>
      }>
        <NewsPageInner />
      </Suspense>
      <Footer />
      <FloatingButtons />
    </>
  )
}
