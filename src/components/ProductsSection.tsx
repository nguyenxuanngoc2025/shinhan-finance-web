'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LoanCalculator from './LoanCalculator'

type Tab = 'financial' | 'needs'

// Fallback products
const FALLBACK_PRODUCTS = [
  {
    id: 'loan',
    icon: 'fas fa-file-invoice-dollar',
    name: 'Vay tín chấp',
    title: 'Vay tín chấp cá nhân',
    image: '/images/products/loan.png',
    features: ['Lãi suất thấp từ 18%/năm', 'Hạn mức vay đến 300 triệu', 'Tùy chọn thanh toán đến 48 tháng'],
    cta: 'Vay ngay',
    ctaLink: '/dang-ky-vay',
    more: '/san-pham/vay-tin-chap',
  },
  {
    id: 'card',
    icon: 'far fa-credit-card',
    name: 'Thẻ Tín Dụng',
    title: 'Thẻ tín dụng THE FIRST',
    image: '/images/products/card.png',
    features: ['Rút tiền mặt đến 100% hạn mức thẻ', 'Miễn lãi suất lên đến 45 ngày', '0.5% điểm thưởng tích lũy không giới hạn'],
    cta: 'Mở thẻ ngay',
    ctaLink: '/san-pham/the-tin-dung',
    more: '/san-pham/the-tin-dung',
  },
]

type ProductItem = {
  id: string
  icon: string
  name: string
  title: string
  image: string
  features: string[]
  cta: string
  ctaLink: string
  more: string
}

const NEEDS = [
  { key: 'motorbike', icon: 'fas fa-motorcycle', text: 'Tôi muốn mua xe máy', link: '/dang-ky-vay' },
  { key: 'credit-card', icon: 'far fa-credit-card', text: 'Tôi muốn Thẻ tín dụng', link: '/dang-ky-vay' },
  { key: 'furniture', icon: 'fas fa-couch', text: 'Tôi muốn mua nội thất', link: '/dang-ky-vay' },
  { key: 'laptop', icon: 'fas fa-laptop', text: 'Tôi muốn vay mua laptop', link: '/dang-ky-vay' },
]

export default function ProductsSection() {
  const [tab, setTab] = useState<Tab>('financial')
  const [activeProdIdx, setActiveProdIdx] = useState(0)
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductItem[]>(FALLBACK_PRODUCTS)

  const router = useRouter()

  // Fetch from Supabase API
  useEffect(() => {
    fetch('/api/cms/products')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const SHORT_NAMES: Record<string, string> = {
            'vay-tin-chap': 'Vay tín chấp',
            'the-tin-dung': 'Thẻ Tín Dụng',
          }
          const mapped = res.data.map((p: any) => ({
            id: p.slug || p.id,
            icon: p.icon || 'fas fa-box',
            name: SHORT_NAMES[p.slug] || p.name,
            title: p.description || p.name,
            image: p.content?.image || '/images/products/loan.png',
            features: p.content?.features || [],
            cta: p.slug === 'the-tin-dung' ? 'Mở thẻ ngay' : 'Vay ngay',
            ctaLink: p.slug === 'the-tin-dung' ? '/san-pham/the-tin-dung' : '/dang-ky-vay',
            more: `/san-pham/${p.slug}`,
          }))
          if (mapped.length > 0) setProducts(mapped)
        }
      })
      .catch(() => { /* keep fallback */ })
  }, [])

  const prod = products[activeProdIdx] || products[0]

  const handleNeedClick = (needKey: string) => {
    if (needKey === 'credit-card') {
      router.push('/san-pham/the-tin-dung')
      return
    }
    setSelectedNeed(needKey)
  }

  const handleCloseCalc = () => { setSelectedNeed(null) }

  return (
    <section className="products-section" id="products">
      <div className="container">
        <h2 className="section-title">Shinhan Finance</h2>

        {/* Tab buttons */}
        <div className="product-tabs">
          <button className={`tab-btn${tab === 'financial' ? ' active' : ''}`} onClick={() => { setTab('financial'); setSelectedNeed(null); }}>
            Sản phẩm Tài chính
          </button>
          <button className={`tab-btn${tab === 'needs' ? ' active' : ''}`} onClick={() => { setTab('needs'); setSelectedNeed(null); }}>
            Bạn đang cần gì?
          </button>
        </div>

        {/* Tab 1: Sản phẩm Tài chính */}
        {tab === 'financial' && (
          <div className="tab-content active" id="tab-financial">
            <div className="product-categories">
              {products.map((p, idx) => (
                <button key={p.id} className={`cat-btn${activeProdIdx === idx ? ' active' : ''}`} onClick={() => setActiveProdIdx(idx)}>
                  <div className="cat-icon"><i className={p.icon}></i></div>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            <div className="product-card active">
              <div className="product-card-image">
                <Image src={prod.image} alt={prod.title} width={520} height={325} style={{objectFit:'cover', width:'100%', height:'100%', display:'block'}} />
              </div>
              <div className="product-card-info">
                <h3>{prod.title}</h3>
                <ul className="product-features">
                  {prod.features.map((f, i) => (
                    <li key={i}>
                      <span className="feature-check"><i className="fas fa-check-circle"></i></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={prod.ctaLink} className="btn-primary-full">{prod.cta}</Link>
                <Link href={prod.more} className="btn-link-center">Xem thêm</Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bạn đang cần gì? */}
        {tab === 'needs' && !selectedNeed && (
          <div className="tab-content active" id="tab-needs">
            <div className="needs-layout">
              <div className="needs-banner">
                <Image src="/images/products/needs-banner.jpg" alt="Thoải mái sống, sao phải mơ?" className="needs-banner-img" fill sizes="(max-width:768px) 100vw, 40vw" style={{objectFit:'cover'}} />
                <div className="needs-banner-content">
                  <h3 className="needs-banner-title">Thoải mái sống,<br/>Sao phải mơ?</h3>
                </div>
              </div>
              <div className="needs-grid-2">
                {NEEDS.map((n, i) => (
                  <button key={i} className="need-card-icon" onClick={() => handleNeedClick(n.key)}>
                    <div className="need-icon-circle"><i className={n.icon}></i></div>
                    <span>{n.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loan Calculator */}
        {tab === 'needs' && selectedNeed && (
          <div className="tab-content active">
            <LoanCalculator needType={selectedNeed} onClose={handleCloseCalc} />
          </div>
        )}
      </div>
    </section>
  )
}
