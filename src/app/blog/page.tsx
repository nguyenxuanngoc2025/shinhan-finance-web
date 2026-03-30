import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import '../tin-tuc/news.css'
import { supabaseAdmin } from '@/lib/supabase'
import BlogPagination from './BlogPagination'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog Tài chính | Shinhan Bank',
  description: 'Kiến thức tài chính cá nhân, mẹo vay vốn, quản lý chi tiêu và cập nhật thị trường mỗi ngày từ Shinhan Bank Việt Nam.',
  alternates: { canonical: 'https://tuvanvienshinhan.com/blog' },
  openGraph: {
    title: 'Blog Tài chính | Shinhan Bank',
    description: 'Kiến thức tài chính cá nhân và cập nhật thị trường mỗi ngày.',
    type: 'website',
    locale: 'vi_VN',
  },
}

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
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || '1'))
  const limit = 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  let posts: BlogPost[] = []
  let totalPages = 1

  try {
    const { data, error, count } = await supabaseAdmin
      .from('posts')
      .select('id,slug,title,excerpt,category,cover_image,published_at,created_at,author', { count: 'exact' })
      .eq('status', 'published')
      .eq('category', 'blog')
      .order('published_at', { ascending: false })
      .range(from, to)

    if (!error && data) {
      posts = data as BlogPost[]
      totalPages = Math.ceil((count || 0) / limit)
    }
  } catch {
    // fallback empty
  }

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
          {posts.length === 0 ? (
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
                <BlogPagination currentPage={page} totalPages={totalPages} />
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
