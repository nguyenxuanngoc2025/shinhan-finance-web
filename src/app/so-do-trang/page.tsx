import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Sơ đồ trang | Shinhan Finance',
  description: 'Sơ đồ trang web Shinhan Finance Việt Nam — tìm nhanh mọi trang bạn cần.',
}

const SITEMAP = [
  {
    title: 'Sản phẩm',
    links: [
      { label: 'Vay tín chấp cá nhân', href: '/san-pham/vay-tin-chap' },
      { label: 'Vay tiêu dùng trả góp', href: '/san-pham/vay-tra-gop' },
      { label: 'Thẻ tín dụng THE FIRST', href: '/san-pham/the-tin-dung' },
      { label: 'Tất cả sản phẩm', href: '/san-pham' },
    ],
  },
  {
    title: 'Dịch vụ',
    links: [
      { label: 'Đăng ký vay', href: '/dang-ky-vay' },
      { label: 'Mở thẻ tín dụng', href: '/mo-the' },
      { label: 'Hướng dẫn thanh toán', href: '/huong-dan-thanh-toan' },
    ],
  },
  {
    title: 'Thông tin',
    links: [
      { label: 'Tin tức & Khuyến mại', href: '/tin-tuc' },
      { label: 'Câu hỏi thường gặp', href: '/hoi-dap' },
      { label: 'Nghề nghiệp', href: 'https://career.shinhanfinance.com.vn/?locale=vi_VN' },
    ],
  },
  {
    title: 'Pháp lý',
    links: [
      { label: 'Quy tắc ứng xử & đạo đức', href: '/quy-tac-ung-xu' },
      { label: 'Miễn trừ trách nhiệm', href: '/mien-tru-trach-nhiem' },
      { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
      { label: 'Trách nhiệm Xã hội', href: '/trach-nhiem-xa-hoi' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 80, minHeight: '60vh' }}>
        <section className="container" style={{ padding: '48px 60px 80px' }}>
          <h1 className="section-title">Sơ đồ trang</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginTop: 32 }}>
            {SITEMAP.map((group) => (
              <div key={group.title}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--shinhan-blue)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--shinhan-blue)' }}>{group.title}</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith('http') ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 15, transition: 'color 0.2s' }}>{link.label} ↗</a>
                      ) : (
                        <Link href={link.href} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 15, transition: 'color 0.2s' }}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
