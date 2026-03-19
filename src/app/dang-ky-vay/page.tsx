'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import './dang-ky-vay.css'

/* ── Steps ─────────────────── */
const STEPS = [
  { icon: 'fas fa-th-list', label: 'Chọn gói vay' },
  { icon: 'fas fa-user-edit', label: 'Thông tin cá nhân' },
  { icon: 'fas fa-file-alt', label: 'Hồ sơ vay' },
  { icon: 'fas fa-check-square', label: 'Kiểm tra lại' },
]

/* ── Products ──────────────── */
const PRODUCTS = [
  {
    id: 'vay-tin-chap',
    name: 'Vay tín chấp cá nhân',
    image: '/images/leadform/card-vay-tin-chap.png',
    features: ['Lãi suất thấp từ 18%/năm', 'Hạn mức vay đến 300 triệu', 'Tùy chọn thanh toán đến 48 tháng'],
    cta: 'Ước tính khoản vay',
    detail: '/san-pham/vay-tin-chap',
    minAmount: 10_000_000, maxAmount: 300_000_000, step: 5_000_000, rate: 0.18,
  },
  {
    id: 'vay-tra-gop',
    name: 'Vay trả góp mua laptop/ điện thoại',
    image: '/images/leadform/card-vay-tra-gop.png',
    features: ['Lãi suất từ 0%/năm', 'Trả trước chỉ từ 20%', 'Xét duyệt 15 phút tại cửa hàng'],
    cta: 'Ước tính khoản vay',
    detail: '/san-pham/vay-tra-gop',
    minAmount: 2_000_000, maxAmount: 50_000_000, step: 1_000_000, rate: 0.36,
  },
  {
    id: 'the-tin-dung',
    name: 'Thẻ tín dụng "THE FIRST"',
    image: '/images/leadform/card-the-tin-dung.png',
    features: [
      'Rút tiền mặt đến 100% hạn mức thẻ',
      'Miễn lãi suất lên đến 45 ngày',
      'Trả góp với ưu đãi 0% lãi suất',
      '0.5% điểm thưởng tích lũy không giới hạn',
    ],
    cta: 'Mở thẻ ngay',
    detail: '/san-pham/the-tin-dung',
    minAmount: 0, maxAmount: 0, step: 0, rate: 0,
  },
]

const FAQS = [
  { q: '1. Làm thế nào để Quý khách đăng ký khoản vay tín chấp với Shinhan Finance?', a: 'Quý khách có thể đăng ký trực tuyến trên website, qua ứng dụng iShinhan, hoặc đến trực tiếp các điểm giao dịch của Shinhan Finance trên toàn quốc.' },
  { q: '2. Cách tính tiền lãi vay tín chấp của Shinhan Finance?', a: 'Lãi suất được tính trên dư nợ giảm dần, từ 18%/năm đến tối đa 49%/năm tùy hồ sơ thẩm định. Công thức: Lãi hàng tháng = Dư nợ hiện tại × (Lãi suất năm / 12).' },
  { q: '3. Làm thế nào để Quý khách biết được Shinhan Finance đã nhận được khoản thanh toán?', a: 'Quý khách sẽ nhận được SMS xác nhận ngay sau khi giao dịch thanh toán được ghi nhận, hoặc kiểm tra trên ứng dụng iShinhan.' },
  { q: '4. Làm thế nào để Quý khách có tài khoản truy cập thông tin trên website của Shinhan Finance?', a: 'Quý khách đăng ký tài khoản iShinhan bằng số điện thoại đã đăng ký khoản vay. Hệ thống sẽ gửi mã OTP để xác thực.' },
  { q: '5. Làm thế nào để Quý khách đăng nhập vào tài khoản truy cập thông tin trên website của Shinhan Finance?', a: 'Truy cập trang web hoặc ứng dụng iShinhan, nhập số điện thoại và mật khẩu đã đăng ký để đăng nhập.' },
  { q: '6. Quý khách cần lưu ý gì khi đăng nhập vào tài khoản truy cập thông tin trên website của Shinhan Finance?', a: 'Không chia sẻ mật khẩu với người khác. Đăng xuất sau khi sử dụng trên thiết bị công cộng. Đổi mật khẩu định kỳ.' },
  { q: '7. Làm thế nào để quý khách cập nhật thay đổi thông tin cá nhân cho Shinhan Finance?', a: 'Quý khách liên hệ hotline 0969 930 328 hoặc đến trực tiếp các điểm giao dịch để yêu cầu cập nhật thông tin.' },
  { q: '8. Làm thế nào để đăng ký vay thêm với Shinhan Finance?', a: 'Quý khách có thể đăng ký vay thêm sau khi đã thanh toán ít nhất 6 kỳ hạn và không có nợ quá hạn.' },
  { q: '9. Bất lợi khi thanh toán trễ hạn hoặc thanh toán thiếu?', a: 'Sẽ bị tính phí phạt trả chậm và ảnh hưởng đến lịch sử tín dụng (CIC), gây khó khăn khi vay vốn trong tương lai.' },
  { q: '10. Phí dịch vụ đang áp dụng tại Shinhan Finance?', a: 'Bao gồm phí giải ngân, phí trả nợ trước hạn (2% trên số tiền trả trước), phí phạt trả chậm. Xem Biểu phí chi tiết tại website.' },
  { q: '11. Thủ tục tất toán khoản vay trước hạn', a: 'Liên hệ hotline 0969 930 328 hoặc đến Trung tâm dịch vụ khách hàng. Phí tất toán trước hạn là 2% trên số tiền tất toán.' },
  { q: '12. Tham khảo Biểu phí, Biểu mẫu, Hợp đồng tại Shinhan Finance', a: 'Quý khách có thể tải xuống tại mục Biểu phí trên website shinhanfinance.com.vn hoặc liên hệ hotline để được hỗ trợ.' },
  { q: '13. Tham khảo Điều Khoản Cơ Bản của Hợp Đồng Cho Vay với Shinhan Finance?', a: 'Tham khảo tại mục Điều khoản trên website hoặc yêu cầu nhân viên tư vấn gửi bản copy qua email.' },
  { q: '15. Lãi suất cho vay bình quân đang áp dụng tại Shinhan Finance là bao nhiêu?', a: 'Lãi suất bình quân dao động từ 18%/năm đến 49%/năm tính trên dư nợ giảm dần, tùy thuộc vào kết quả thẩm định hồ sơ.' },
]

const REASONS = [
  { icon: 'fas fa-gift', text: 'Giải pháp hấp dẫn' },
  { icon: 'fas fa-percentage', text: 'Lãi suất tối ưu' },
  { icon: 'fas fa-hand-holding-usd', text: 'Hạn mức vay lớn' },
  { icon: 'fas fa-clock', text: 'Linh hoạt thời gian vay' },
]

const TERM_OPTIONS = [12, 18, 24, 36, 48]
const LOAN_PURPOSES = [
  'Sửa chữa, xây dựng nhà ở', 'Mua sắm thiết bị gia đình',
  'Chi phí y tế / sức khỏe', 'Học phí / giáo dục',
  'Du lịch / nghỉ dưỡng', 'Kinh doanh nhỏ lẻ', 'Chi tiêu cá nhân khác',
]

function formatVND(n: number) {
  return n.toLocaleString('vi-VN')
}
function calcMonthly(amount: number, termMonths: number, annualRate: number) {
  if (!amount || !termMonths || !annualRate) return 0
  const r = annualRate / 12
  const n = termMonths
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function DangKyVayInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const calcRef = useRef<HTMLDivElement>(null)
  const [salary, setSalary] = useState(0)

  // step only changes for steps 1,2,3 (form flow). Step 0 = landing page with all sections
  const [step, setStep] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null)
  const [loanAmount, setLoanAmount] = useState(10_000_000)
  const [loanTerm, setLoanTerm] = useState(12)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Đọc query params từ trang sản phẩm (vay-tin-chap, v.v.) → pre-fill và nhảy thẳng step 1
  useEffect(() => {
    const productId = searchParams.get('product')
    const amount    = searchParams.get('amount')
    const term      = searchParams.get('term')
    const salaryVal = searchParams.get('salary')
    if (!productId) return

    const found = PRODUCTS.find(p => p.id === productId)
    if (found) {
      setSelectedProduct(found)
      if (amount)    setLoanAmount(Number(amount))
      if (term)      setLoanTerm(Number(term))
      if (salaryVal) setSalary(Number(salaryVal))
      // jump straight to step 1 (thông tin cá nhân)
      setStep(1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [formData, setFormData] = useState({
    purpose: '', fullName: '', phone: '', province: '',
    occupation: '', company: '',
    incomeSource: 'luong', // default: đi làm hưởng lương
  })
  const [phoneError, setPhoneError] = useState('')
  const [purposeTouched, setPurposeTouched] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [refCode, setRefCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Validate Vietnamese phone number
  const validatePhone = (v: string) => {
    if (!v) return 'Vui lòng nhập số điện thoại'
    if (!/^(03|05|07|08|09)\d{8}$/.test(v))
      return 'Số điện thoại không hợp lệ (10 số, đầu số 03x/05x/07x/08x/09x)'
    return ''
  }

  const calcProduct = selectedProduct || PRODUCTS[0]
  const monthly = calcMonthly(loanAmount, loanTerm, calcProduct.rate)

  // When a product is selected, scroll to calculator
  const handleSelectProduct = (p: typeof PRODUCTS[0]) => {
    if (p.id === 'the-tin-dung') {
      router.push('/mo-the')
      return
    }
    setSelectedProduct(p)
    setLoanAmount(p.minAmount)
    setLoanTerm(12)
    // scroll to calculator after render
    setTimeout(() => {
      calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Click >> Vay → go to step 1 (form)
  const handleGoToForm = () => {
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Header />
      <main className="lf-page">
        {/* ======== STICKY PROGRESS BAR ======== */}
        <div className="lf-progress">
          <div className="lf-progress-inner">
            {STEPS.map((s, i, arr) => (
              <div key={i} className="lf-prog-wrap">
                <button
                  className={`lf-prog-step${step > i ? ' done' : ''}${step === i ? ' active' : ''}`}
                  onClick={() => { if (i < step) { setStep(i); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
                  disabled={i > step}
                >
                  <div className="lf-prog-circle">
                    {step > i ? <i className="fas fa-check"></i> : <i className={s.icon}></i>}
                  </div>
                  <span className="lf-prog-label">{s.label}</span>
                </button>
                {i < arr.length - 1 && (
                  <div className={`lf-prog-line${step > i ? ' done' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back + Quay lại Trang chủ */}
        <div className="lf-topbar">
          <div className="lf-container lf-topbar-inner">
            {step > 0 ? (
              <button className="lf-back" onClick={() => { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                <i className="fas fa-arrow-left"></i>
              </button>
            ) : (
              <Link href="/" className="lf-back"><i className="fas fa-arrow-left"></i></Link>
            )}
            <Link href="/" className="lf-home-link">Quay lại Trang chủ</Link>
          </div>
        </div>

        {/* ======== TOP SECTION — changes by step ======== */}


        {/* STEP 0: Product Cards + Calculator */}
        {step === 0 && (
          <>
            {/* Product Cards */}
            <section className="lf-cards-section">
              <div className="lf-container">
                <div className={`lf-products-grid${selectedProduct ? ' has-selection' : ''}`}>
                  {PRODUCTS.map(p => (
                    <div
                      className={`lf-product-card${selectedProduct?.id === p.id ? ' selected' : ''}`}
                      key={p.id}
                    >
                      <div className="lf-prod-img-wrap">
                        <Image src={p.image} alt={p.name} className="lf-prod-img" fill sizes="(max-width:768px) 100vw, 33vw" style={{objectFit:'cover'}} />
                      </div>
                      <div className="lf-prod-body">
                        <h2 className="lf-prod-name">{p.name}</h2>
                        <ul className="lf-prod-features">
                          {p.features.map((f, i) => (
                            <li key={i}><i className="fas fa-check-circle"></i>{f}</li>
                          ))}
                        </ul>
                        <button className="lf-btn-select" onClick={() => handleSelectProduct(p)}>
                          {p.cta}
                        </button>
                        <Link href={p.detail} className="lf-btn-detail">Chi tiết</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Calculator */}
            {selectedProduct && selectedProduct.id !== 'the-tin-dung' && (
              <section className="lf-estimate-section" ref={calcRef}>
                <div className="lf-container">
                  <div className="lf-est-widget">
                    <button className="lf-est-close" onClick={() => setSelectedProduct(null)} aria-label="Đóng">
                      <i className="fas fa-times"></i>
                    </button>
                    <h2 className="lf-section-head">Ước tính khoản vay</h2>
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
                        <div className="lf-est-max-value">{formatVND(salary > 0 ? Math.min(salary * 12, selectedProduct.maxAmount) : selectedProduct.maxAmount)}</div>
                      </div>
                    </div>
                    <div className="lf-est-layout">
                      <div className="lf-est-left">
                        <div className="lf-est-amount-box">{formatVND(loanAmount)}</div>
                        <div className="lf-est-slider-row">
                          <span className="lf-est-slider-label">Bạn cần vay<br/>(VNĐ)</span>
                          <div className="lf-est-slider-col">
                            <input
                              type="range" className="lf-slider"
                              min={selectedProduct.minAmount}
                              max={salary > 0 ? Math.min(salary * 12, selectedProduct.maxAmount) : selectedProduct.maxAmount}
                              step={selectedProduct.step} value={loanAmount}
                              onChange={e => setLoanAmount(Number(e.target.value))}
                            />
                            <div className="lf-range-labels">
                              <span>{formatVND(selectedProduct.minAmount)}</span>
                              <span>{formatVND(salary > 0 ? Math.min(salary * 12, selectedProduct.maxAmount) : selectedProduct.maxAmount)}</span>
                            </div>
                          </div>
                        </div>
                        <select className="lf-est-term-select" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}>
                          {TERM_OPTIONS.map(t => <option key={t} value={t}>{t} tháng</option>)}
                        </select>
                        <div className="lf-est-slider-row">
                          <span className="lf-est-slider-label">Trong thời<br/>gian</span>
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
                          <strong>{(selectedProduct.rate * 100).toFixed(0)}%</strong>
                        </div>
                      </div>
                      <div className="lf-est-right">
                        <div className="lf-result-card">
                          <div className="lf-result-label">Ước tính khoản thanh toán hàng kỳ (VNĐ)</div>
                          <div className="lf-result-amount">
                            <i className="fas fa-tag"></i>
                            {formatVND(Math.round(monthly))}*
                          </div>
                          <button className="lf-result-cta" onClick={handleGoToForm}>&gt;&gt; Vay</button>
                          <p className="lf-result-note">
                            * Thông tin và kết quả chỉ mang tính tham khảo. Khoản vay được xét duyệt sẽ tùy thuộc vào điều kiện và hồ sơ cụ thể của từng trường hợp.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lf-est-see-all">
                    <Link href="/san-pham" className="lf-link-all">Xem tất cả</Link>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* STEP 1: Thông tin cá nhân — matching original Shinhan design */}
        {step === 1 && (
          <section className="lf-form-section">
            <div className="lf-container">
              <h2 className="lf-form-hero-title">Chào bạn, vui lòng điền thông tin dưới đây</h2>
              <p className="lf-form-disclaimer">
                Bằng việc cung cấp thông tin cá nhân, bạn cam kết đã đọc, hiểu rõ và và đồng ý các nội dung của Thông báo{' '}
                <a href="#">xử lý dữ liệu cá nhân</a> và <a href="#">chính sách bảo mật</a> của Shinhan Finance.
                Bạn đồng ý cho Shinhan Finance tư vấn thêm các sản phẩm phù hợp với nhu cầu và thực trạng hồ sơ hiện tại của mình.
              </p>

              <form className="lf-shinhan-form" onSubmit={(e) => { e.preventDefault(); setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                {/* Thông tin gói vay */}
                <div className="lf-sf-block">
                  <h3 className="lf-sf-block-title">Thông tin gói vay</h3>
                  <div className="lf-sf-loan-row">
                    <div className="lf-sf-field">
                      <label>Sản phẩm *</label>
                      <div className="lf-sf-select-btn">
                        {selectedProduct?.name || 'Vay tín chấp cá nhân'}
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                    <div className={`lf-sf-field${purposeTouched && !formData.purpose ? ' lf-sf-field--error' : ''}`}>
                      <label>Mục đích vay *</label>
                      <select required value={formData.purpose}
                        onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                        onBlur={() => setPurposeTouched(true)}
                      >
                        <option value="">— Chọn mục đích —</option>
                        {LOAN_PURPOSES.map(p => <option key={p}>{p}</option>)}
                      </select>
                      {purposeTouched && !formData.purpose && (
                        <span className="lf-sf-error">Vui lòng chọn mục đích vay</span>
                      )}
                    </div>
                    <div className="lf-sf-field">
                      <label>Thu nhập hàng tháng (VNĐ) *</label>
                      <input
                        type="text" placeholder="30,000,000" required
                        value={salary ? formatVND(salary) : ''}
                        onChange={e => setSalary(Number(e.target.value.replace(/\D/g, '')))}
                      />
                    </div>
                    <div className="lf-sf-field">
                      <label>Khoản vay dự kiến (VNĐ) *</label>
                      <input
                        type="text" required
                        value={formatVND(loanAmount)}
                        onChange={e => setLoanAmount(Number(e.target.value.replace(/\D/g, '')))}
                      />
                    </div>
                    <div className="lf-sf-field">
                      <label>Thời hạn vay *</label>
                      <select value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}>
                        {TERM_OPTIONS.map(t => <option key={t} value={t}>{t} tháng</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="lf-sf-block">
                  <h3 className="lf-sf-block-title">Thông tin cá nhân</h3>
                  <div className="lf-sf-grid">
                    <div className="lf-sf-field">
                      <label>Họ và tên *</label>
                      <input type="text" placeholder="Nguyễn Văn A" required
                        value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                    </div>
                    <div className={`lf-sf-field${phoneError ? ' lf-sf-field--error' : phoneError === '' && formData.phone ? ' lf-sf-field--ok' : ''}`}>
                      <label>Số điện thoại *</label>
                      <input
                        type="tel" placeholder="09xxxxxxxx" required
                        maxLength={10}
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={e => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setFormData({ ...formData, phone: digits })
                          setPhoneError(validatePhone(digits))
                        }}
                        onBlur={() => setPhoneError(validatePhone(formData.phone))}
                      />
                      {phoneError && <span className="lf-sf-error">{phoneError}</span>}
                      {!phoneError && formData.phone.length === 10 && (
                        <span className="lf-sf-ok"><i className="fas fa-check-circle"></i> Hợp lệ</span>
                      )}
                    </div>
                    <div className="lf-sf-field">
                      <label>Tỉnh/Thành phố *</label>
                      <select required value={formData.province} onChange={e => setFormData({ ...formData, province: e.target.value })}>
                        <option value="">— Chọn —</option>
                        <option>TP. Hồ Chí Minh</option><option>Hà Nội</option><option>Đà Nẵng</option>
                        <option>Bình Dương</option><option>Đồng Nai</option><option>Cần Thơ</option>
                        <option>Hải Phòng</option><option>An Giang</option><option>Bà Rịa - Vũng Tàu</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="lf-sf-actions">
                  <button type="submit" className="lf-sf-submit">
                    Tiếp tục <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* STEP 2: Hồ sơ vay — pre-fill dữ liệu từ bước 1 */}
        {step === 2 && (
          <section className="lf-form-section">
            <div className="lf-container">
              <h2 className="lf-form-hero-title">Hồ sơ vay</h2>

              {/* Tóm tắt read-only */}
              <div className="lf-sf-summary">
                <div className="lf-sf-sum-row">
                  <div className="lf-sf-sum-item">
                    <span className="lf-sf-sum-label">Sản phẩm</span>
                    <span className="lf-sf-sum-val">{selectedProduct?.name || 'Vay tín chấp cá nhân'}</span>
                  </div>
                  <div className="lf-sf-sum-item">
                    <span className="lf-sf-sum-label">Khoản vay</span>
                    <span className="lf-sf-sum-val blue">{formatVND(loanAmount)} đ</span>
                  </div>
                  <div className="lf-sf-sum-item">
                    <span className="lf-sf-sum-label">Thời hạn</span>
                    <span className="lf-sf-sum-val">{loanTerm} tháng</span>
                  </div>
                  <div className="lf-sf-sum-item">
                    <span className="lf-sf-sum-label">Thanh toán/tháng</span>
                    <span className="lf-sf-sum-val blue">{formatVND(Math.round(monthly))} đ</span>
                  </div>
                  <div className="lf-sf-sum-item">
                    <span className="lf-sf-sum-label">Họ và tên</span>
                    <span className="lf-sf-sum-val">{formData.fullName}</span>
                  </div>
                  <div className="lf-sf-sum-item">
                    <span className="lf-sf-sum-label">Số điện thoại</span>
                    <span className="lf-sf-sum-val">{formData.phone}</span>
                  </div>
                  <div className="lf-sf-sum-item">
                    <span className="lf-sf-sum-label">Tỉnh/Thành phố</span>
                    <span className="lf-sf-sum-val">{formData.province}</span>
                  </div>
                </div>
              </div>

              <form className="lf-shinhan-form" onSubmit={handleSubmit}>
                {/* Nguồn thu nhập — đặt trước thông tin công việc */}
                <div className="lf-sf-block">
                  <h3 className="lf-sf-block-title">Nguồn thu nhập</h3>
                  <p className="lf-sf-radio-label">Nguồn thu nhập *</p>
                  <div className="lf-sf-radio-group">
                    {[
                      { val: 'luong',         label: 'Đi làm hưởng lương' },
                      { val: 'ho-kinh-doanh', label: 'Chủ hộ kinh doanh' },
                      { val: 'tu-do',         label: 'Kinh doanh tự do' },
                    ].map(opt => (
                      <label key={opt.val} className={`lf-sf-radio-item${formData.incomeSource === opt.val ? ' active' : ''}`}>
                        <input
                          type="radio" name="incomeSource" value={opt.val}
                          checked={formData.incomeSource === opt.val}
                          onChange={() => setFormData({ ...formData, incomeSource: opt.val })}
                        />
                        <span className="lf-sf-radio-circle"></span>
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Thông tin công việc */}
                <div className="lf-sf-block">
                  <h3 className="lf-sf-block-title">Thông tin công việc</h3>
                  <div className="lf-sf-loan-row">
                    <div className="lf-sf-field">
                      <label>Nghề nghiệp *</label>
                      <select required value={formData.occupation} onChange={e => setFormData({ ...formData, occupation: e.target.value })}>
                        <option value="">— Chọn —</option>
                        <option>Nhân viên văn phòng</option>
                        <option>Kinh doanh tự do</option>
                        <option>Công nhân</option>
                        <option>Sinh viên</option>
                        <option>Nội trợ</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div className="lf-sf-field">
                      <label>Thu nhập hàng tháng (VNĐ) *</label>
                      <input type="text" required
                        placeholder="Ví dụ: 15,000,000"
                        defaultValue={salary ? formatVND(salary) : ''}
                        onChange={e => setSalary(Number(e.target.value.replace(/\D/g, '')))} />
                    </div>
                    <div className="lf-sf-field">
                      <label>Mục đích vay *</label>
                      <select required value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })}>
                        <option value="">— Chọn —</option>
                        {LOAN_PURPOSES.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="lf-sf-field">
                      <label>Tên công ty / nơi làm việc</label>
                      <input type="text" placeholder="Công ty ABC"
                        value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                    </div>
                    <div className="lf-sf-field">
                      <label>Email</label>
                      <input type="email" placeholder="example@email.com" />
                    </div>
                  </div>
                </div>

                <div className="lf-sf-actions">
                  <button type="submit" className="lf-sf-submit">
                    Tiếp tục <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* STEP 3: Kiểm tra lại thông tin */}
        {step === 3 && selectedProduct && (
          <section className="lf-form-section">
            <div className="lf-container">
              <h2 className="lf-form-hero-title">Kiểm tra lại thông tin</h2>
              <p className="lf-form-disclaimer">
                Vui lòng kiểm tra kỹ thông tin trước khi gửi. Bạn có thể quay lại chỉnh sửa nếu cần.
              </p>

              <div className="lf-shinhan-form">
                {/* Card 1: Gói vay */}
                <div className="lf-sf-block">
                  <h3 className="lf-sf-block-title">Gói vay đã chọn</h3>
                  <div className="lf-sf-loan-row">
                    <div className="lf-sf-field">
                      <label>Sản phẩm</label>
                      <div className="lf-confirm-val">{selectedProduct.name}</div>
                    </div>
                    <div className="lf-sf-field">
                      <label>Số tiền vay</label>
                      <div className="lf-confirm-val blue">{formatVND(loanAmount)} đ</div>
                    </div>
                    <div className="lf-sf-field">
                      <label>Thời hạn</label>
                      <div className="lf-confirm-val">{loanTerm} tháng</div>
                    </div>
                    <div className="lf-sf-field">
                      <label>Thanh toán/tháng (ước tính)</label>
                      <div className="lf-confirm-val blue">{formatVND(Math.round(monthly))} đ*</div>
                    </div>
                    {formData.purpose && (
                      <div className="lf-sf-field">
                        <label>Mục đích vay</label>
                        <div className="lf-confirm-val">{formData.purpose}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 2: Thông tin cá nhân */}
                <div className="lf-sf-block">
                  <h3 className="lf-sf-block-title">Thông tin cá nhân</h3>
                  <div className="lf-sf-grid">
                    <div className="lf-sf-field">
                      <label>Họ và tên</label>
                      <div className="lf-confirm-val">{formData.fullName || '—'}</div>
                    </div>
                    <div className="lf-sf-field">
                      <label>Số điện thoại</label>
                      <div className="lf-confirm-val">{formData.phone || '—'}</div>
                    </div>
                    <div className="lf-sf-field">
                      <label>Tỉnh/Thành phố</label>
                      <div className="lf-confirm-val">{formData.province || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Hồ sơ công việc */}
                <div className="lf-sf-block">
                  <h3 className="lf-sf-block-title">Hồ sơ công việc</h3>
                  <div className="lf-sf-loan-row">
                    <div className="lf-sf-field">
                      <label>Nguồn thu nhập</label>
                      <div className="lf-confirm-val">
                        {formData.incomeSource === 'luong' ? 'Đi làm hưởng lương'
                          : formData.incomeSource === 'ho-kinh-doanh' ? 'Chủ hộ kinh doanh'
                          : formData.incomeSource === 'tu-do' ? 'Kinh doanh tự do' : '—'}
                      </div>
                    </div>
                    <div className="lf-sf-field">
                      <label>Nghề nghiệp</label>
                      <div className="lf-confirm-val">{formData.occupation || '—'}</div>
                    </div>
                    <div className="lf-sf-field">
                      <label>Thu nhập hàng tháng</label>
                      <div className="lf-confirm-val">{salary ? formatVND(salary) + ' đ' : '—'}</div>
                    </div>
                    {formData.company && (
                      <div className="lf-sf-field">
                        <label>Công ty / Nơi làm việc</label>
                        <div className="lf-confirm-val">{formData.company}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lf-sf-actions" style={{ gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button" className="lf-sf-submit-outline"
                    onClick={() => setStep(2)}
                  >
                    <i className="fas fa-arrow-left"></i> Chỉnh sửa
                  </button>
                  <button
                    type="button" className="lf-sf-submit"
                    disabled={submitting}
                    onClick={async () => {
                      setSubmitting(true)
                      setSubmitError('')
                      try {
                        const res = await fetch('/api/cms/leads/submit', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            form_type: 'loan',
                            full_name: formData.fullName,
                            phone: formData.phone,
                            loan_amount: String(loanAmount),
                            loan_term: String(loanTerm),
                            product_name: selectedProduct?.name || '',
                            province: formData.province,
                            income: String(salary),
                            purpose: formData.purpose,
                            occupation: formData.occupation,
                            company: formData.company,
                            income_source: formData.incomeSource,
                          }),
                        })
                        const result = await res.json()
                        if (result.success) {
                          setRefCode(result.data?.id?.slice(-6) || Date.now().toString().slice(-6))
                          setShowSuccessModal(true)
                        } else {
                          setSubmitError(result.error || 'Có lỗi xảy ra')
                        }
                      } catch {
                        setSubmitError('Không thể gửi đăng ký. Vui lòng thử lại.')
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                  >
                    {submitting ? (
                      <><i className="fas fa-spinner fa-spin"></i> Đang gửi...</>
                    ) : (
                      <><i className="fas fa-paper-plane"></i> Xác nhận & Gửi đăng ký</>
                    )}
                  </button>
                </div>

                {submitError && (
                  <p style={{ fontSize: '13px', color: '#c62828', marginTop: '8px', textAlign: 'center' }}>
                    ⚠️ {submitError}
                  </p>
                )}

                <p style={{ fontSize: '11px', color: '#999', marginTop: '12px', textAlign: 'right' }}>
                  * Kết quả ước tính, khoản vay thực tế phụ thuộc vào hồ sơ được duyệt.
                </p>
              </div>
            </div>
          </section>
        )}


        {/* ======== LUÔN HIỂN THỊ: FAQ + Lý do ======== */}

        {/* FAQ */}
        <section className="lf-section lf-faq-section">
          <div className="lf-container">
            <div className="lf-faq-header">
              <h2>Một số câu hỏi thường gặp</h2>
              <Link href="#" className="lf-link-all">Xem tất cả FAQs</Link>
            </div>
            <div className="lf-faq-list">
              {FAQS.map((faq, i) => (
                <div key={i} className={`lf-faq-item${openFaq === i ? ' open' : ''}`}>
                  <button className="lf-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <i className={`fas ${openFaq === i ? 'fa-minus' : 'fa-plus'}`}></i>
                  </button>
                  <div className="lf-faq-a"><p>{faq.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lý do bạn nên vay */}
        <section className="lf-section lf-reasons">
          <div className="lf-container">
            <div className="lf-reasons-layout">
              <h2 className="lf-reasons-title">Lý do bạn nên vay tại<br />Shinhan Finance</h2>
              <div className="lf-reasons-grid">
                {REASONS.map((r, i) => (
                  <div className="lf-reason-card" key={i}>
                    <div className="lf-reason-icon"><i className={r.icon}></i></div>
                    <span>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />

      {/* ── Success Modal ── */}
      {showSuccessModal && (
        <div className="lf-modal-overlay" onClick={() => { setShowSuccessModal(false); setStep(0); setSelectedProduct(null) }}>
          <div className="lf-modal-box" onClick={e => e.stopPropagation()}>
            {/* Animated check */}
            <div className="lf-modal-icon">
              <svg viewBox="0 0 52 52" className="lf-modal-checksvg">
                <circle cx="26" cy="26" r="25" fill="none" className="lf-modal-circle" />
                <path d="M14 27 l8 8 l16-16" fill="none" className="lf-modal-check" />
              </svg>
            </div>

            <h2 className="lf-modal-title">Đăng ký thành công!</h2>
            {formData.fullName && (
              <p className="lf-modal-name">Xin chào, <strong>{formData.fullName}</strong></p>
            )}
            <p className="lf-modal-msg">
              Cảm ơn bạn đã tin tưởng <strong>Shinhan Finance</strong>.<br />
              Chuyên viên của chúng tôi sẽ liên hệ với bạn trong vòng <strong>24 giờ</strong> làm việc.
            </p>

            <div className="lf-modal-info">
              <span><i className="fas fa-phone-alt"></i> {formData.phone}</span>
              {formData.province && <span><i className="fas fa-map-marker-alt"></i> {formData.province}</span>}
            </div>

            <button
              className="lf-modal-btn"
              onClick={() => { setShowSuccessModal(false); setStep(0); setSelectedProduct(null) }}
            >
              <i className="fas fa-home"></i> Về trang chủ
            </button>
            <p className="lf-modal-note">Mã tham chiếu: SHF-{refCode}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default function DangKyVayPage() {
  return (
    <Suspense fallback={
      <main className="lf-page">
        <div className="lf-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p>Đang tải...</p>
        </div>
      </main>
    }>
      <DangKyVayInner />
    </Suspense>
  )
}
