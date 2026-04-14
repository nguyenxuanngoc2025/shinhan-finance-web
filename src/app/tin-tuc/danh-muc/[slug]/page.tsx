import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import '../../news.css'

// ISR: cache 5 phút — không query DB mỗi request
export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  const { data: catData } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', 'post_categories')
    .single()
    
  let catName = slug
  if (catData?.value) {
    const category = (catData.value as any[]).find(c => c.slug === slug)
    if (category) {
      catName = category.label
    }
  }

  return {
    title: `Danh mục: ${catName} | Shinhan Bank`,
    description: `Khám phá các bài viết, tin tức nổi bật trong danh mục ${catName} từ Shinhan Bank.`,
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  // 1. Get Category Name
  let catName = slug
  const { data: catData } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', 'post_categories')
    .single()
    
  if (catData?.value) {
    const category = (catData.value as any[]).find(c => c.slug === slug)
    if (category) {
      catName = category.label
    }
  }

  // 2. Fetch Posts
  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('slug,title,excerpt,cover_image,published_at,created_at')
    .eq('status', 'published')
    .eq('category', slug)
    .order('published_at', { ascending: false })
    .limit(50)

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
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Danh mục: {catName}</span>
            </nav>
            <h1>Danh mục: {catName}</h1>
            <p>Tuyển tập các bài viết thuộc danh mục {catName}</p>
          </div>
        </section>

        {/* Content area */}
        <div className="container" style={{ padding: '3rem 15px' }}>
          {!posts || posts.length === 0 ? (
            <div className="news-empty">
              <i className="fas fa-folder-open"></i>
              <p>Chưa có bài viết trong danh mục này</p>
              <Link href="/tin-tuc" className="btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>Quay lại bản tin</Link>
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
