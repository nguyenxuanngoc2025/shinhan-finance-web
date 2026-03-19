'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import '../../dang-ky-vay/dang-ky-vay.css'
import './vay-tin-chap.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

// Default values (overridden by API settings)
const DEFAULT_CONFIG = {
  min_rate: 18,
  max_rate: 49,
  max_amount: 300_000_000,
  min_amount: 10_000_000,
  max_term_months: 48,
  min_term_months: 12,
  term_options: [12, 18, 24, 36, 48],
  max_salary_multiplier: 12,
  min_salary: 6_000_000,
  disbursement_hours: 48,
  early_termination_fee_pct: 2,
  age_range_female: '21-55',
  age_range_male: '21-58',
}

const FAQS = [
  { q: '1. Làm thế nào để Quý khách đăng ký khoản vay tín chấp với Shinhan Finance?', a: 'Quý khách có thể đăng ký trực tuyến trên website, qua ứng dụng iShinhan, hoặc đến trực tiếp các điểm giao dịch của Shinhan Finance trên toàn quốc.' },
  { q: '2. Cách tính tiền lãi vay tín chấp của Shinhan Finance?', a: 'Lãi suất được tính trên dư nợ giảm dần, từ 18%/năm đến tối đa 49%/năm tùy hồ sơ thẩm định.' },
  { q: '3. Làm thế nào để Quý khách biết được Shinhan Finance đã nhận được khoản thanh toán?', a: 'Quý khách sẽ nhận được SMS xác nhận ngay sau khi giao dịch thanh toán được ghi nhận.' },
  { q: '4. Làm thế nào để Quý khách có tài khoản truy cập thông tin trên website của Shinhan Finance?', a: 'Quý khách đăng ký tài khoản iShinhan bằng số điện thoại đã đăng ký khoản vay.' },
  { q: '5. Làm thế nào để Quý khách đăng nhập vào tài khoản truy cập thông tin trên website của Shinhan Finance?', a: 'Truy cập trang web hoặc ứng dụng iShinhan, nhập số điện thoại và mật khẩu đã đăng ký.' },
  { q: '6. Quý khách cần lưu ý gì khi đăng nhập vào tài khoản truy cập thông tin trên website của Shinhan Finance?', a: 'Không chia sẻ mật khẩu với người khác. Đăng xuất sau khi sử dụng trên thiết bị công cộng.' },
  { q: '7. Làm thế nào để quý khách cập nhật thay đổi thông tin cá nhân cho Shinhan Finance?', a: 'Quý khách liên hệ hotline 0969 930 328 hoặc đến trực tiếp các điểm giao dịch.' },
  { q: '8. Làm thế nào để đăng ký vay thêm với Shinhan Finance?', a: 'Quý khách có thể đăng ký vay thêm sau khi đã thanh toán ít nhất 6 kỳ hạn và không có nợ quá hạn.' },
  { q: '9. Bất lợi khi thanh toán trễ hạn hoặc thanh toán thiếu?', a: 'Sẽ bị tính phí phạt trả chậm và ảnh hưởng đến lịch sử tín dụng (CIC).' },
  { q: '10. Phí dịch vụ đang áp dụng tại Shinhan Finance?', a: 'Bao gồm phí giải ngân, phí trả nợ trước hạn (2%), phí phạt trả chậm.' },
  { q: '11. Thủ tục tất toán khoản vay trước hạn', a: 'Liên hệ hotline 0969 930 328 hoặc đến TTDVKH. Phí tất toán 2% trên số tiền tất toán.' },
  { q: '12. Tham khảo Biểu phí, Biểu mẫu, Hợp đồng tại Shinhan Finance', a: 'Tải xuống tại mục Biểu phí trên website shinhanfinance.com.vn.' },
  { q: '13. Tham khảo Điều Khoản Cơ Bản của Hợp Đồng Cho Vay với Shinhan Finance?', a: 'Tham khảo tại mục Điều khoản trên website.' },
  { q: '14. Làm thế nào để ký hợp đồng vay (eSigning) trên iShinhan?', a: 'Đăng nhập ứng dụng iShinhan, vào mục Hợp đồng và làm theo hướng dẫn ký điện tử.' },
]

function formatVND(n: number) {
  return n.toLocaleString('vi-VN')
}

function formatAmount(amount: number): string {
  if (amount >= 1e9) {
    const ty = amount / 1e9
    return ty === Math.floor(ty) ? `${ty} tỷ` : `${ty.toFixed(1)} tỷ`
  }
  if (amount >= 1e6) {
    const trieu = amount / 1e6
    return trieu === Math.floor(trieu) ? `${trieu} triệu` : `${trieu.toFixed(1)} triệu`
  }
  return amount.toLocaleString('vi-VN')
}

function calcMonthly(amount: number, termMonths: number, annualRatePct: number) {
  const r = annualRatePct / 100 / 12
  const n = termMonths
  if (r === 0) return amount / n
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export default function VayTinChapPage() {
  const router = useRouter()
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loanAmount, setLoanAmount] = useState(DEFAULT_CONFIG.min_amount)
  const [loanTerm, setLoanTerm] = useState(DEFAULT_CONFIG.min_term_months)
  const [salary, setSalary] = useState(0)
  const [activeSection, setActiveSection] = useState('bangtinhh')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Fetch dynamic settings
  const fetchConfig = useCallback(() => {
    fetch('/api/cms/settings?key=loan_products.vay_tin_chap')
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          setConfig(prev => ({ ...prev, ...res.data }))
        }
      })
      .catch(() => { /* keep defaults */ })
  }, [])

  useEffect(() => { fetchConfig() }, [fetchConfig])

  const handleApplyNow = () => {
    const params = new URLSearchParams({
      product: 'vay-tin-chap',
      amount: String(loanAmount),
      term: String(loanTerm),
      salary: String(salary),
    })
    router.push(`/dang-ky-vay?${params.toString()}`)
  }

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

  const monthly = calcMonthly(loanAmount, loanTerm, config.min_rate)

  const navItems = [
    { href: '#bangtinhh', id: 'bangtinhh', label: 'Bảng tính Vay tín chấp cá nhân' },
    { href: '#dacDiem', id: 'dacDiem', label: 'Đặc điểm' },
    { href: '#dieuKien', id: 'dieuKien', label: 'Điều kiện & Thủ tục' },
    { href: '#faq', id: 'faq', label: 'Những câu hỏi thường gặp khi vay tín chấp' },
  ]

  return (
    <>
      <Header />

      <main className="vtc-page">
        {/* ===== HERO ===== */}
        <div className="vtc-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://shinhanfinance.com.vn/-/1600x/nginx-cms/assets/products/Banner-Product-1_2023-04-11-104057.png"
            alt="Vay tín chấp cá nhân Shinhan Finance"
            className="vtc-hero-img"
          />
          <div className="vtc-hero-content">
            <h1>Vay tín chấp cá nhân</h1>
            <p className="vtc-hero-sub">Hiện thực hóa mọi kế hoạch tài chính</p>
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
                  <span>Lãi suất thấp từ {config.min_rate}%/năm</span>
                </div>
                <div className="vtc-hl-item">
                  <span className="vtc-hl-check"><i className="fas fa-check-circle"></i></span>
                  <span>Hạn mức vay đến {formatAmount(config.max_amount)}</span>
                </div>
                <div className="vtc-hl-item">
                  <span className="vtc-hl-check"><i className="fas fa-check-circle"></i></span>
                  <span>Tùy chọn thanh toán đến {config.max_term_months} tháng</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STICKY NAV (scroll-spy anchor links) ===== */}
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
              {/* Salary row */}
              <div className="lf-est-salary-row">
                <div className="lf-est-salary-block">
                  <label>Thu nhập hàng tháng (VNĐ) *</label>
                  <input
                    type="text" className="lf-est-salary-input"
                    placeholder="0"
                    value={salary ? formatVND(salary) : ''}
                    onChange={e => setSalary(Number(e.target.value.replace(/\D/g, '')))}
                  />
                </div>
                <div className="lf-est-salary-arrow"><i className="fas fa-exchange-alt"></i></div>
                <div className="lf-est-salary-block">
                  <label>Có thể vay tối đa* (VNĐ)</label>
                  <div className="lf-est-max-value">{formatVND(salary > 0 ? Math.min(salary * config.max_salary_multiplier, config.max_amount) : config.max_amount)}</div>
                </div>
              </div>

              <div className="lf-est-layout">
                <div className="lf-est-left">
                  <div className="lf-est-amount-box">{formatVND(loanAmount)}</div>
                  <div className="lf-est-slider-row">
                    <span className="lf-est-slider-label">Bạn cần vay<br />(VNĐ)</span>
                    <div className="lf-est-slider-col">
                      <input
                        type="range" className="lf-slider"
                        min={config.min_amount}
                        max={salary > 0 ? Math.min(salary * config.max_salary_multiplier, config.max_amount) : config.max_amount}
                        step={5_000_000} value={loanAmount}
                        onChange={e => setLoanAmount(Number(e.target.value))}
                      />
                      <div className="lf-range-labels">
                        <span>{formatVND(config.min_amount)}</span>
                        <span>{formatVND(salary > 0 ? Math.min(salary * config.max_salary_multiplier, config.max_amount) : config.max_amount)}</span>
                      </div>
                    </div>
                  </div>
                  <select className="lf-est-term-select" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}>
                    {config.term_options.map(t => <option key={t} value={t}>{t} tháng</option>)}
                  </select>
                  <div className="lf-est-slider-row">
                    <span className="lf-est-slider-label">Trong thời<br />gian</span>
                    <div className="lf-est-slider-col">
                      <input
                        type="range" className="lf-slider"
                        min={0} max={config.term_options.length - 1} step={1}
                        value={config.term_options.indexOf(loanTerm) >= 0 ? config.term_options.indexOf(loanTerm) : 0}
                        onChange={e => setLoanTerm(config.term_options[Number(e.target.value)])}
                      />
                      <div className="lf-range-labels"><span>{config.term_options[0]}</span><span>{config.term_options[config.term_options.length - 1]}</span></div>
                    </div>
                  </div>
                  <div className="lf-est-rate">
                    <span>Lãi suất minh họa tối thiểu (%/năm)*</span>
                    <strong>{config.min_rate}%</strong>
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
                      &gt;&gt; Vay
                    </button>
                    <p className="lf-result-note">
                      * Thông tin và kết quả chỉ mang tính tham khảo. Khoản vay được xét duyệt sẽ tùy thuộc vào điều kiện và hồ sơ cụ thể của từng trường hợp.
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
            <h2 className="vtc-section-title">Đặc điểm</h2>
            <ul className="vtc-plain-list">
              <li>Lãi suất tối thiểu từ <strong>{config.min_rate}%/năm</strong> đến tối đa <strong>{config.max_rate}%/năm</strong> tính trên dư nợ giảm dần (phụ thuộc kết quả thẩm định).</li>
              <li>Khoản vay lên đến <strong>{config.max_salary_multiplier} lần thu nhập</strong> hàng tháng và tối đa <strong>{formatAmount(config.max_amount)} đồng</strong>, cho mục đích tiêu dùng, phục vụ đời sống.</li>
              <li>Thời hạn vay từ tối thiểu <strong>{config.min_term_months} tháng</strong> đến tối đa <strong>{config.max_term_months} tháng</strong>.</li>
              <li>Giải ngân trong vòng <strong>{config.disbursement_hours} giờ</strong> sau khi đăng ký hồ sơ.</li>
            </ul>
            <div className="vtc-example-box">
              <p>Ví dụ: Với khoản vay tín chấp <strong>60 triệu đồng</strong>, kỳ hạn vay <strong>12 tháng</strong>, lãi suất <strong>{config.min_rate}%/năm</strong> trên dư nợ giảm dần. Khoản thanh toán hàng tháng (bao gồm gốc và lãi) của bạn sẽ là <strong>{formatVND(Math.round(calcMonthly(60_000_000, 12, config.min_rate)))} VNĐ</strong>.</p>
            </div>
          </div>
        </section>

        {/* ===== SECTION: ĐIỀU KIỆN ===== */}
        <section id="dieuKien" className="vtc-section">
          <div className="vtc-section-inner vtc-dieu-kien-layout">
            <div className="vtc-dk-left">
              <h2 className="vtc-section-title">Điều kiện & Thủ tục</h2>
              <ul className="vtc-condition-list">
                <li><span>Chỉ áp dụng cho Khách hàng đi làm hưởng lương</span></li>
                <li><span>Độ tuổi: Nữ [{config.age_range_female}], Nam [{config.age_range_male}]</span></li>
                <li><span>Thu nhập tối thiểu {formatVND(config.min_salary)} đồng/tháng</span></li>
                <li><span>Quốc tịch: Công dân Việt Nam</span></li>
              </ul>
            </div>
            <div className="vtc-dk-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://shinhanfinance.com.vn/-/714x/nginx-cms/assets/products/Eligibility.png"
                alt="Điều kiện vay tín chấp"
                className="vtc-dk-img"
              />
            </div>
          </div>
        </section>

        {/* ===== SECTION: FAQ ===== */}
        <section id="faq" className="vtc-section vtc-section-alt">
          <div className="vtc-section-inner">
            <h2 className="vtc-section-title">Những câu hỏi thường gặp khi vay tín chấp</h2>
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

        {/* ===== BOTTOM BANNER ===== */}
        <div className="vtc-bottom-banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://shinhanfinance.com.vn/-/2140x/nginx-cms/assets/products/Personal-Loan-Vay-t%C3%ADn-ch%E1%BA%A5p-test.jpg"
            alt="Vay tín chấp Shinhan Finance"
            className="vtc-bottom-banner-img"
          />
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </>
  )
}
