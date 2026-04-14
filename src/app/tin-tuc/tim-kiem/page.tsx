import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import '../news.css'

// Search page: mỗi user query đều khác nhau — dùng dynamic để cho phép queryParam
export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  
  return {
    title: `Tìm kiếm: ${q || ''} | Shinhan Bank`,
    description: `Kết quả tìm kiếm cho "${q}" từ Shinhan Bank.`,
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  let posts: any[] = []

  if (query) {
    const { data } = await supabaseAdmin
      .from('posts')
      .select('slug,title,excerpt,cover_image,published_at,created_at')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(50)

    if (data) {
      posts = data
    }
  }

  return (
    <>
      <Header />
      <main className="news-page">
        {/* Hero */}
        <section className="news-hero">
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <nav aria-label="Breadcrumb" style={{ marginBottom: 12, fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Trang chủ</Link>
              <span>›</span>
              <Link href="/tin-tuc" style={{ color: 'white', textDecoration: 'none' }}>Tin tức</Link>
              <span>›</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Tìm kiếm</span>
            </nav>
            <h1>Tìm kiếm</h1>
            <p>Kết quả tìm kiếm cho từ khóa: "{query}"</p>
          </div>
        </section>

        {/* Content area */}
        <div className="container" style={{ padding: '3rem 15px' }}>
          
          <form action="/tin-tuc/tim-kiem" method="GET" style={{ marginBottom: 40, display: 'flex', gap: 10, maxWidth: 500 }}>
            <input 
              type="text" 
              name="q" 
              defaultValue={query} 
              placeholder="Nhập từ khóa tìm kiếm..." 
              required
              style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #ccc', outline: 'none', fontSize: 16 }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '12px 24px', borderRadius: 8 }}>Tìm kiếm</button>
          </form>

          {!query ? (
            <div className="news-empty" style={{ padding: '60px 0', minHeight: 400 }}>
              <i className="fas fa-search" style={{ fontSize: 40, color: '#ccc', marginBottom: 20 }}></i>
              <p>Vui lòng nhập từ khóa để tìm kiếm bài viết.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="news-empty" style={{ padding: '60px 0', minHeight: 400 }}>
              <i className="fas fa-search" style={{ fontSize: 40, color: '#ccc', marginBottom: 20 }}></i>
              <p>Không tìm thấy bài viết nào phù hợp với từ khóa "{query}"</p>
            </div>
          ) : (
            <div className="news-grid">
              {posts.map(article => (
                <article key={article.slug} className="news-card">
                  <Link href={`/tin-tuc/${article.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="news-card-image">
                      <Image 
                        src={article.cover_image || '/images/news/default.jpg'} 
                        alt={article.title} 
                        fill 
                        sizes="(max-width:768px) 100vw, 33vw" 
                        style={{ objectFit: 'cover' }} 
                      />
                    </div>
                  </Link>
                  <div className="news-card-body">
                    <span className="news-card-date">{formatDate(article.published_at || article.created_at)}</span>
                    <h3 className="news-card-title">
                      <Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className="news-card-excerpt">{article.excerpt}</p>
                    <Link href={`/tin-tuc/${article.slug}`} className="news-card-readmore">
                      Đọc tiếp <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
