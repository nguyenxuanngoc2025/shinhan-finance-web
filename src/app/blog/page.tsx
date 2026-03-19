'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import '../tin-tuc/news.css'

type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  cover_image: string
  published_at: string
  created_at: string
  author: string
  keyword_target: string
  source: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/cms/posts?status=published&page=${page}&limit=12`)
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          setPosts(res.data)
          setTotalPages(res.pagination?.totalPages || 1)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  return (
    <>
      <Header />
      <main className="news-page">
        {/* Hero */}
        <section className="news-hero" style={{ background: 'linear-gradient(135deg, #0d2e5c 0%, #1a5ba8 100%)' }}>
          <div className="container">
            <h1>Blog Tài chính</h1>
            <p>Tin tức, kiến thức tài chính cá nhân và cập nhật thị trường mỗi ngày</p>
          </div>
        </section>

        {/* Posts grid */}
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
          {loading ? (
            <div className="news-empty">
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#007bc3' }}></i>
              <p>Đang tải bài viết...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="news-empty">
              <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p>Chưa có bài viết nào trong Blog</p>
              <p style={{ fontSize: '0.9rem', color: '#999' }}>Hệ thống sẽ tự động đăng bài viết mới mỗi ngày</p>
            </div>
          ) : (
            <>
              <div className="news-grid">
                {posts.map(post => (
                  <article key={post.id} className="news-card">
                    <Link href={`/tin-tuc/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                      <div className="news-card-image">
                        <Image
                          src={post.cover_image || '/images/news/default.jpg'}
                          alt={post.title}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </Link>
                    <div className="news-card-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="news-card-date">{formatDate(post.published_at || post.created_at)}</span>
                        {post.author && (
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>• {post.author}</span>
                        )}
                      </div>
                      <h3 className="news-card-title">
                        <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="news-card-excerpt">{post.excerpt}</p>
                      <Link href={`/tin-tuc/${post.slug}`} className="news-card-readmore">
                        Đọc tiếp <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem'
                }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd',
                      background: page === 1 ? '#f5f5f5' : '#fff', cursor: page === 1 ? 'default' : 'pointer'
                    }}
                  >
                    ← Trước
                  </button>
                  <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                    Trang {page}/{totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd',
                      background: page === totalPages ? '#f5f5f5' : '#fff', cursor: page === totalPages ? 'default' : 'pointer'
                    }}
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA Section */}
        <section style={{
          background: 'linear-gradient(135deg, #0d2e5c 0%, #1a5ba8 100%)',
          padding: '3rem 0', textAlign: 'center', color: '#fff'
        }}>
          <div className="container">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Bạn cần tư vấn tài chính?</h2>
            <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>Đăng ký ngay để nhận ưu đãi lãi suất tốt nhất</p>
            <Link href="/dang-ky-vay" style={{
              display: 'inline-block', padding: '12px 32px',
              background: '#e85d26', color: '#fff', borderRadius: '8px',
              fontWeight: 600, textDecoration: 'none', fontSize: '1rem'
            }}>
              Đăng ký vay ngay <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
