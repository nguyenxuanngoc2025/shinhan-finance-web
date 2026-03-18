'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../../dang-ky-vay/dang-ky-vay.css'
import '../vay-tin-chap/vay-tin-chap.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

const TERM_OPTIONS = [6, 9, 12, 18, 24]

const FAQS = [
  { q: '1. Vay trả góp mua laptop/điện thoại của Shinhan Finance là gì?', a: 'Đây là sản phẩm cho vay tiêu dùng trả góp dành cho khách hàng muốn mua laptop, điện thoại, thiết bị điện tử tại các cửa hàng đối tác của Shinhan Finance. Khách hàng chỉ cần trả trước một phần, phần còn lại trả góp hàng tháng.' },
  { q: '2. Lãi suất vay trả góp laptop/điện thoại là bao nhiêu?', a: 'Lãi suất từ 0% đến tối đa 36%/năm tính trên dư nợ giảm dần, tùy thuộc vào chương trình khuyến mại của từng đối tác và kết quả thẩm định hồ sơ.' },
  { q: '3. Tôi cần trả trước bao nhiêu khi mua trả góp qua Shinhan Finance?', a: 'Tỷ lệ trả trước tối thiểu từ 20% giá trị sản phẩm, tùy chương trình và cửa hàng đối tác cụ thể.' },
  { q: '4. Thời gian xét duyệt hồ sơ vay trả góp mất bao lâu?', a: 'Hồ sơ được xét duyệt nhanh chóng ngay tại cửa hàng, thường chỉ trong vòng 15–30 phút sau khi nộp đủ giấy tờ.' },
  { q: '5. Tôi cần chuẩn bị giấy tờ gì để vay trả góp?', a: 'Chỉ cần CMND/CCCD còn hiệu lực. Một số trường hợp có thể cần thêm hợp đồng lao động hoặc sao kê lương tháng gần nhất.' },
  { q: '6. Có thể mua sản phẩm nào qua hình thức vay trả góp Shinhan Finance?', a: 'Laptop, máy tính bảng, điện thoại smartphone, các thiết bị điện tử — tại hơn 5.000 cửa hàng đối tác toàn quốc.' },
  { q: '7. Tôi có thể trả nợ trước hạn không?', a: 'Có, quý khách có thể tất toán trước hạn bất cứ lúc nào. Phí tất toán trước hạn là 2% trên số tiền tất toán còn lại.' },
  { q: '8. Nếu trả chậm có bị phạt không?', a: 'Có. Khoản thanh toán chậm hạn sẽ bị tính phí phạt và ảnh hưởng đến lịch sử tín dụng CIC của khách hàng.' },
]

function formatVND(n: number) {
  return n.toLocaleString('vi-VN')
}

function calcMonthly(amount: number, termMonths: number, annualRate = 0.36) {
  const r = annualRate / 12
  const n = termMonths
  if (r === 0) return amount / n
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export default function VayTraGopPage() {
  const router = useRouter()
  const [productPrice, setProductPrice] = useState(10_000_000)
  const [downPayment, setDownPayment] = useState(2_000_000)
  const [loanTerm, setLoanTerm] = useState(12)
  const [activeSection, setActiveSection] = useState('bangtinhh')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const loanAmount = Math.max(productPrice - downPayment, 0)
  const monthly = calcMonthly(loanAmount, loanTerm)
  const downPercent = productPrice > 0 ? Math.round((downPayment / productPrice) * 100) : 20

  useEffect(() => {
    const sectionIds = ['bangtinhh', 'dacDiem', 'dieuKien', 'faq']
    const observers: IntersectionObserver[] = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-30% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleApplyNow = () => {
    const params = new URLSearchParams({
      product: 'vay-tra-gop',
      amount: String(loanAmount),
      term: String(loanTerm),
      salary: '0',
    })
    router.push(`/dang-ky-vay?${params.toString()}`)
  }

  const navItems = [
    { href: '#bangtinhh', id: 'bangtinhh', label: 'Bảng tính Vay trả góp' },
    { href: '#dacDiem',   id: 'dacDiem',   label: 'Đặc điểm' },
    { href: '#dieuKien',  id: 'dieuKien',  label: 'Điều kiện & Ưu đãi' },
    { href: '#faq',       id: 'faq',       label: 'Câu hỏi thường gặp' },
  ]

  return (
    <>
      <Header />

      <main className="vtc-page">
        {/* ===== HERO ===== */}
        <div className="vtc-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://shinhanfinance.com.vn/-/1600x/nginx-cms/assets/products/Banner-Product-5.png"
            alt="Vay trả góp mua laptop điện thoại Shinhan Finance"
            className="vtc-hero-img"
          />
          <div className="vtc-hero-content">
            <h1>Vay trả góp mua laptop/ điện thoại</h1>
            <p className="vtc-hero-sub">Sở hữu ngay, trả góp nhẹ nhàng</p>
          </div>
        </div>

        {/* ===== ƯU ĐIỂM VƯỢT TRỘI ===== */}
        <section className="vtc-highlights">
          <div className="vtc-highlights-inner">
            <div className="vtc-highlights-card">
              <div className="vtc-highlights-title">Ưu điểm vượt trội</div>
              <div className="vtc-highlights-items">
                <div className="vtc-hl-item">
                  <span className="vtc-hl-check"><i className="fas fa-check-circle"></i></span>
                  <span>Lãi suất ưu đãi từ 0%/năm</span>
                </div>
                <div className="vtc-hl-item">
                  <span className="vtc-hl-check"><i className="fas fa-check-circle"></i></span>
                  <span>Trả trước chỉ từ 20% giá trị</span>
                </div>
                <div className="vtc-hl-item">
                  <span className="vtc-hl-check"><i className="fas fa-check-circle"></i></span>
                  <span>Xét duyệt nhanh — 15 phút tại cửa hàng</span>
                </div>
                <div className="vtc-hl-item">
                  <span className="vtc-hl-check"><i className="fas fa-check-circle"></i></span>
                  <span>Hơn 5.000 cửa hàng đối tác toàn quốc</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STICKY NAV ===== */}
        <nav className="vtc-tabs-nav">
          <div className="vtc-tabs-nav-inner">
            {navItems.map(item => (
              <a key={item.href} href={item.href}
                className={`vtc-tab-btn${activeSection === item.id ? ' active' : ''}`}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ===== SECTION: BẢNG TÍNH ===== */}
        <section id="bangtinhh" className="vtc-section">
          <div className="vtc-section-inner">
            <div className="lf-est-widget">

              {/* Giá sản phẩm + trả trước */}
              <div className="lf-est-salary-row">
                <div className="lf-est-salary-block">
                  <label>Giá sản phẩm (VNĐ)</label>
                  <input
                    type="text" className="lf-est-salary-input"
                    placeholder="10,000,000"
                    value={productPrice ? formatVND(productPrice) : ''}
                    onChange={e => setProductPrice(Number(e.target.value.replace(/\D/g, '')))}
                  />
                </div>
                <div className="lf-est-salary-arrow"><i className="fas fa-minus"></i></div>
                <div className="lf-est-salary-block">
                  <label>Trả trước ({downPercent}%)</label>
                  <input
                    type="text" className="lf-est-salary-input"
                    placeholder="2,000,000"
                    value={downPayment ? formatVND(downPayment) : ''}
                    onChange={e => {
                      const v = Number(e.target.value.replace(/\D/g, ''))
                      setDownPayment(Math.min(v, productPrice))
                    }}
                  />
                </div>
              </div>

              <div className="lf-est-layout">
                <div className="lf-est-left">
                  <div className="lf-est-amount-box">{formatVND(loanAmount)}</div>
                  <div className="lf-est-slider-row">
                    <span className="lf-est-slider-label">Số tiền<br />vay (VNĐ)</span>
                    <div className="lf-est-slider-col">
                      <input
                        type="range" className="lf-slider"
                        min={2_000_000} max={50_000_000} step={500_000}
                        value={Math.min(loanAmount, 50_000_000)}
                        onChange={e => {
                          const newLoan = Number(e.target.value)
                          setDownPayment(Math.max(productPrice - newLoan, 0))
                        }}
                      />
                      <div className="lf-range-labels">
                        <span>{formatVND(2_000_000)}</span>
                        <span>{formatVND(50_000_000)}</span>
                      </div>
                    </div>
                  </div>

                  <select className="lf-est-term-select" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}>
                    {TERM_OPTIONS.map(t => <option key={t} value={t}>{t} tháng</option>)}
                  </select>
                  <div className="lf-est-slider-row">
                    <span className="lf-est-slider-label">Thời<br />hạn</span>
                    <div className="lf-est-slider-col">
                      <input
                        type="range" className="lf-slider"
                        min={0} max={TERM_OPTIONS.length - 1} step={1}
                        value={TERM_OPTIONS.indexOf(loanTerm) >= 0 ? TERM_OPTIONS.indexOf(loanTerm) : 0}
                        onChange={e => setLoanTerm(TERM_OPTIONS[Number(e.target.value)])}
                      />
                      <div className="lf-range-labels"><span>{TERM_OPTIONS[0]}</span><span>{TERM_OPTIONS[TERM_OPTIONS.length - 1]}</span></div>
                    </div>
                  </div>
                  <div className="lf-est-rate">
                    <span>Lãi suất minh họa tối thiểu (%/năm)*</span>
                    <strong>0% – 36%</strong>
                  </div>
                </div>

                <div className="lf-est-right">
                  <div className="lf-result-card">
                    <div className="lf-result-label">Ước tính khoản thanh toán hàng kỳ (VNĐ)</div>
                    <div className="lf-result-amount">
                      <i className="fas fa-tag"></i>
                      {formatVND(Math.round(monthly))}*
                    </div>
                    <button onClick={handleApplyNow} className="lf-result-cta">
                      &gt;&gt; Đăng ký ngay
                    </button>
                    <p className="lf-result-note">
                      * Thông tin và kết quả chỉ mang tính tham khảo. Khoản vay được xét duyệt tùy thuộc điều kiện hồ sơ cụ thể.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION: ĐẶC ĐIỂM ===== */}
        <section id="dacDiem" className="vtc-section vtc-section-alt">
          <div className="vtc-section-inner">
            <h2 className="vtc-section-title">Đặc điểm sản phẩm</h2>
            <ul className="vtc-plain-list">
              <li>Hình thức vay tiêu dùng trả góp tại <strong>hơn 5.000 cửa hàng đối tác</strong> trên toàn quốc.</li>
              <li>Lãi suất ưu đãi từ <strong>0%/năm</strong> (theo chương trình đối tác) đến tối đa <strong>36%/năm</strong> tính trên dư nợ giảm dần.</li>
              <li>Khoản vay từ <strong>2 triệu</strong> đến tối đa <strong>50 triệu đồng</strong> (hoặc đến 100% giá trị sản phẩm tùy chương trình).</li>
              <li>Tỷ lệ trả trước tối thiểu <strong>20%</strong> giá trị sản phẩm.</li>
              <li>Thời hạn vay linh hoạt từ <strong>6 tháng</strong> đến <strong>24 tháng</strong>.</li>
              <li>Xét duyệt <strong>ngay tại cửa hàng</strong> trong 15–30 phút, mang hàng về ngay trong ngày.</li>
              <li>Chỉ cần <strong>CMND/CCCD</strong> còn hiệu lực — không cần tài sản thế chấp.</li>
            </ul>
            <div className="vtc-example-box">
              <p>Ví dụ: Mua laptop trị giá <strong>20.000.000 đồng</strong>, trả trước <strong>4.000.000 đồng</strong> (20%), vay <strong>16.000.000 đồng</strong>, kỳ hạn <strong>12 tháng</strong>, lãi suất <strong>36%/năm</strong>. Khoản thanh toán hàng tháng ước tính khoảng <strong>1.656.720 VNĐ</strong>.</p>
            </div>
          </div>
        </section>

        {/* ===== SECTION: ĐIỀU KIỆN & ƯU ĐÃI ===== */}
        <section id="dieuKien" className="vtc-section">
          <div className="vtc-section-inner vtc-dieu-kien-layout">
            <div className="vtc-dk-left">
              <h2 className="vtc-section-title">Điều kiện & Ưu đãi</h2>
              <h3 className="vtc-dk-subtitle">Điều kiện vay</h3>
              <ul className="vtc-condition-list">
                <li><span>Công dân Việt Nam, từ <strong>18 tuổi</strong> trở lên</span></li>
                <li><span>Có CMND/CCCD còn hiệu lực</span></li>
                <li><span>Không yêu cầu có tài khoản ngân hàng hay thu nhập chứng minh</span></li>
                <li><span>Được áp dụng cho cả khách hàng đi làm hưởng lương và kinh doanh tự do</span></li>
              </ul>
              <h3 className="vtc-dk-subtitle" style={{ marginTop: '24px' }}>Ưu đãi hoàn tiền</h3>
              <ul className="vtc-condition-list">
                <li><span>Hoàn lại tiền lãi kỳ đầu — tối đa <strong>600.000 đồng</strong></span></li>
                <li><span>Áp dụng khi vay từ 6 triệu đến 100 triệu đồng</span></li>
                <li><span>Điều kiện: thanh toán đầy đủ đúng hạn kỳ đầu, hợp đồng còn hiệu lực</span></li>
              </ul>
            </div>
            <div className="vtc-dk-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://shinhanfinance.com.vn/-/714x/nginx-cms/assets/products/Eligibility.png"
                alt="Điều kiện vay trả góp Shinhan Finance"
                className="vtc-dk-img"
              />
            </div>
          </div>
        </section>

        {/* ===== SECTION: FAQ ===== */}
        <section id="faq" className="vtc-section vtc-section-alt">
          <div className="vtc-section-inner">
            <h2 className="vtc-section-title">Câu hỏi thường gặp về vay trả góp</h2>
            <div className="vtc-faq-grid">
              {FAQS.map((f, i) => (
                <div
                  className={`vtc-faq-grid-item${openFaq === i ? ' open' : ''}`}
                  key={i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="vtc-faq-q">
                    <span>{f.q}</span>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                  <div className="vtc-faq-a">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section className="vtg-cta-section">
          <div className="vtg-cta-inner">
            <div className="vtg-cta-icons">
              <span><i className="fas fa-laptop"></i></span>
              <span><i className="fas fa-mobile-alt"></i></span>
              <span><i className="fas fa-tablet-alt"></i></span>
            </div>
            <h2 className="vtg-cta-title">Sở hữu ngay hôm nay</h2>
            <p className="vtg-cta-desc">
              Đăng ký vay trả góp online — xét duyệt nhanh <strong>15 phút</strong> tại cửa hàng,<br />
              mang sản phẩm về ngay trong ngày.
            </p>
            <div className="vtg-cta-badges">
              <span><i className="fas fa-check"></i> Lãi suất từ 0%</span>
              <span><i className="fas fa-check"></i> Trả trước từ 20%</span>
              <span><i className="fas fa-check"></i> Chỉ cần CMND/CCCD</span>
            </div>
            <button onClick={handleApplyNow} className="vtg-cta-btn">
              Đăng ký vay ngay <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  )
}
