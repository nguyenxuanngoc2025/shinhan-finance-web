'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NEWS_ARTICLES } from '@/app/tin-tuc/news-data'

type NewsItem = {
  slug: string
  title: string
  excerpt: string
  category: string
  cover_image?: string
  image?: string
  date?: string
  published_at?: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const CATEGORY_LABEL: Record<string, string> = {
  'khuyen-mai': 'Khuyến mại',
  'su-kien': 'Sự kiện',
  'thong-bao': 'Thông báo',
  'blog': 'Blog',
}

const CATEGORY_COLOR: Record<string, string> = {
  'khuyen-mai': '#e85d26',
  'su-kien': '#007bc3',
  'thong-bao': '#28a745',
  'blog': '#6f42c1',
}

export default function NewsSection() {
  const [articles, setArticles] = useState<NewsItem[]>(
    NEWS_ARTICLES.slice(0, 4).map(a => ({ ...a, cover_image: a.image }))
  )

  // Fetch from Supabase API — override hardcode if available
  useEffect(() => {
    fetch('/api/cms/posts')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const published = res.data
            .filter((p: any) => p.status === 'published')
            .slice(0, 4)
          if (published.length > 0) {
            setArticles(published)
          }
        }
      })
      .catch(() => { /* keep fallback */ })
  }, [])

  if (articles.length === 0) return null

  const [main, ...rest] = articles
  const mainImage = main.cover_image || main.image || '/images/news/default.jpg'
  const mainDate = main.published_at || main.date || ''

  return (
    <section className="hn-section" id="tin-tuc" aria-label="Bản tin Shinhan Finance">
      <div className="container">
        {/* Header */}
        <div className="hn-header">
          <div>
            <h2 className="hn-title">Bản tin & Ưu đãi</h2>
            <p className="hn-desc">Tin tức mới nhất, khuyến mại và sự kiện từ Shinhan Finance</p>
          </div>
          <Link href="/tin-tuc" className="hn-view-all">
            Xem tất cả <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {/* Grid: 1 bài lớn trái + 3 bài nhỏ phải */}
        <div className="hn-grid">
          {/* Featured large */}
          <article className="hn-main-card">
            <Link href={`/tin-tuc/${main.slug}`} style={{display:'block', textDecoration:'none'}}>
              <div className="hn-main-image">
                <Image src={mainImage} alt={main.title} width={700} height={395} style={{objectFit:'cover', width:'100%', height:'auto', display:'block'}} />
                <span
                  className="hn-badge"
                  style={{ background: CATEGORY_COLOR[main.category] || '#007bc3' }}
                >
                  {CATEGORY_LABEL[main.category] || main.category}
                </span>
              </div>
            </Link>
            <div className="hn-main-body">
              <span className="hn-date">
                <i className="far fa-calendar-alt"></i> {mainDate ? formatDate(mainDate) : ''}
              </span>
              <h3 className="hn-main-title">
                <Link href={`/tin-tuc/${main.slug}`}>{main.title}</Link>
              </h3>
              <p className="hn-main-excerpt">{main.excerpt}</p>
              <Link href={`/tin-tuc/${main.slug}`} className="hn-readmore">
                Đọc tiếp <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </article>

          {/* 3 bài nhỏ */}
          <div className="hn-list">
            {rest.map((article) => {
              const artImage = article.cover_image || article.image || '/images/news/default.jpg'
              const artDate = article.published_at || article.date || ''
              return (
                <article key={article.slug} className="hn-list-card">
                  <Link href={`/tin-tuc/${article.slug}`} style={{display:'block', flexShrink:0}}>
                    <div className="hn-list-image">
                      <Image src={artImage} alt={article.title} width={88} height={68} style={{objectFit:'cover', width:'88px', height:'68px', display:'block'}} />
                    </div>
                  </Link>
                  <div className="hn-list-body">
                    <div className="hn-list-meta">
                      <span
                        className="hn-badge hn-badge-sm"
                        style={{ background: CATEGORY_COLOR[article.category] || '#007bc3' }}
                      >
                        {CATEGORY_LABEL[article.category] || article.category}
                      </span>
                      <span className="hn-date">
                        <i className="far fa-calendar-alt"></i> {artDate ? formatDate(artDate) : ''}
                      </span>
                    </div>
                    <h4 className="hn-list-title">
                      <Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link>
                    </h4>
                  </div>
                </article>
              )
            })}

            {/* CTA Banner nhỏ cuối */}
            <div className="hn-cta-banner">
              <i className="fas fa-bell"></i>
              <div>
                <strong>Ưu đãi đặc biệt</strong>
                <span>Lãi suất 0% khi mở thẻ THE FIRST trong tháng này</span>
              </div>
              <Link href="/mo-the" className="hn-cta-btn">Mở thẻ ngay</Link>
            </div>
          </div>
        </div>

        {/* Quick tabs */}
        <div className="hn-quick-tabs">
          {[
            { label: 'Khuyến mại', tab: 'khuyen-mai', icon: 'fas fa-tag' },
            { label: 'Sự kiện',    tab: 'su-kien',    icon: 'fas fa-calendar-star' },
            { label: 'Thông báo', tab: 'thong-bao', icon: 'fas fa-bullhorn' },
            { label: 'Blog tài chính', tab: 'blog', icon: 'fas fa-book-open' },
          ].map(({ label, tab, icon }) => (
            <Link key={tab} href={`/tin-tuc?tab=${tab}`} className="hn-quick-tab">
              <i className={icon}></i>
              <span>{label}</span>
              <i className="fas fa-chevron-right hn-chevron"></i>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
