'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import './products.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import LoanCalculator from '@/components/LoanCalculator'

const PRODUCTS = [
  {
    id: 'loan',
    icon: 'fas fa-file-invoice-dollar',
    name: 'Vay tín chấp',
    title: 'Vay tín chấp cá nhân',
    desc: 'Giải pháp tài chính linh hoạt, thủ tục đơn giản, giải ngân nhanh chóng. Không cần tài sản thế chấp.',
    image: '/images/products/loan.png',
    features: [
      'Lãi suất thấp từ 18%/năm',
      'Hạn mức vay đến 300 triệu',
      'Tùy chọn thanh toán đến 48 tháng',
      'Không cần tài sản thế chấp',
    ],
    cta: 'Đăng ký vay ngay',
    ctaLink: '/dang-ky-vay',
    more: '/san-pham/vay-tin-chap',
    accent: '#007BC3',
  },
  {
    id: 'card',
    icon: 'far fa-credit-card',
    name: 'Thẻ Tín Dụng',
    title: 'Thẻ tín dụng THE FIRST',
    desc: 'Thẻ tín dụng đa năng với nhiều ưu đãi hấp dẫn, thanh toán tiện lợi mọi nơi, tích điểm không giới hạn.',
    image: '/images/products/card.png',
    features: [
      'Rút tiền mặt đến 100% hạn mức thẻ',
      'Miễn lãi suất lên đến 45 ngày',
      '0.5% điểm thưởng tích lũy không giới hạn',
      'Miễn phí thường niên năm đầu',
    ],
    cta: 'Mở thẻ ngay',
    ctaLink: '/san-pham/the-tin-dung',
    more: '/san-pham/the-tin-dung',
    accent: '#00b9ef',
  },
]

const NEEDS = [
  { key: 'motorbike', icon: 'fas fa-motorcycle', text: 'Tôi muốn mua xe máy', link: '/dang-ky-vay' },
  { key: 'credit-card', icon: 'far fa-credit-card', text: 'Tôi muốn Thẻ tín dụng', link: '/san-pham/the-tin-dung' },
  { key: 'furniture', icon: 'fas fa-couch', text: 'Tôi muốn mua nội thất', link: '/dang-ky-vay' },
  { key: 'laptop', icon: 'fas fa-laptop', text: 'Tôi muốn vay mua laptop', link: '/dang-ky-vay' },
]

export default function ProductsPage() {
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null)
  const router = useRouter()

  const handleNeedClick = (needKey: string) => {
    if (needKey === 'credit-card') {
      router.push('/san-pham/the-tin-dung')
      return
    }
    setSelectedNeed(needKey)
  }

  // Dynamic products with settings from API
  const [products, setProducts] = useState(PRODUCTS)

  useEffect(() => {
    fetch('/api/cms/settings?key=loan_products')
      .then(r => r.json())
      .then(res => {
        if (!res.data) return
        const cfg = res.data
        setProducts(prev => prev.map(p => {
          if (p.id === 'loan' && cfg.vay_tin_chap) {
            const c = cfg.vay_tin_chap
            return { ...p, features: [
              `Lãi suất thấp từ ${c.min_rate}%/năm`,
              `Hạn mức vay đến ${c.max_amount >= 1e6 ? c.max_amount / 1e6 + ' triệu' : c.max_amount}`,
              `Tùy chọn thanh toán đến ${c.max_term_months} tháng`,
              'Không cần tài sản thế chấp',
            ]}
          }
          if (p.id === 'card' && cfg.the_tin_dung) {
            const c = cfg.the_tin_dung
            return { ...p, features: [
              `Rút tiền mặt đến ${c.cash_advance_pct}% hạn mức thẻ`,
              `Miễn lãi suất lên đến ${c.interest_free_days} ngày`,
              `${c.reward_points_pct}% điểm thưởng tích lũy không giới hạn`,
              'Miễn phí thường niên năm đầu',
            ]}
          }
          return p
        }))
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <Header />
      <main className="sp-page">
        {/* Hero */}
        <section className="sp-hero">
          <div className="container">
            <h1>Sản phẩm tài chính</h1>
            <p>Giải pháp tài chính toàn diện, đồng hành cùng bạn trong mọi kế hoạch</p>
          </div>
        </section>

        {/* Section 1: Product cards side by side */}
        <section className="sp-cards-section">
          <div className="container">
            <div className="sp-cards-grid">
              {products.map(prod => (
                <div key={prod.id} className="sp-product-card">
                  <div className="sp-card-visual">
                    <Image src={prod.image} alt={prod.title} fill sizes="(max-width:768px) 100vw, 50vw" style={{objectFit:'contain'}} />
                  </div>
                  <div className="sp-card-content">
                    <div className="sp-card-icon" style={{ background: prod.accent }}>
                      <i className={prod.icon}></i>
                    </div>
                    <h2 className="sp-card-title">{prod.title}</h2>
                    <p className="sp-card-desc">{prod.desc}</p>
                    <ul className="sp-card-features">
                      {prod.features.map((f, i) => (
                        <li key={i}>
                          <i className="fas fa-check" style={{ color: prod.accent }}></i>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="sp-card-actions">
                      <Link href={prod.ctaLink} className="sp-btn-primary" style={{ background: prod.accent }}>
                        {prod.cta}
                      </Link>
                      <Link href={prod.more} className="sp-btn-link">
                        Tìm hiểu thêm <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Bạn đang cần gì? */}
        <section className="sp-needs-section">
          <div className="container">
            <h2 className="sp-section-title">Bạn đang cần gì?</h2>
            <p className="sp-section-sub">Chọn nhu cầu của bạn, chúng tôi sẽ tìm giải pháp phù hợp nhất</p>

            {!selectedNeed ? (
              <div className="sp-needs-layout">
                {/* Banner left */}
                <div className="sp-needs-banner">
                  <Image
                    src="/images/products/needs-banner.jpg"
                    alt="Thoải mái sống, sao phải mơ?"
                    className="sp-needs-banner-img"
                    fill
                    sizes="(max-width:768px) 100vw, 40vw"
                    style={{objectFit:'cover'}}
                  />
                  <div className="sp-needs-banner-overlay">
                    <h3>Thoải mái sống,<br/>Sao phải mơ?</h3>
                  </div>
                </div>

                {/* Grid right */}
                <div className="sp-needs-grid">
                  {NEEDS.map(n => (
                    <button
                      key={n.key}
                      className="sp-need-card"
                      onClick={() => handleNeedClick(n.key)}
                    >
                      <div className="sp-need-icon">
                        <i className={n.icon}></i>
                      </div>
                      <span>{n.text}</span>
                      <i className="fas fa-chevron-right sp-need-arrow"></i>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <LoanCalculator
                needType={selectedNeed}
                onClose={() => setSelectedNeed(null)}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
