'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import '../san-pham/the-tin-dung/credit-card.css'
import '../dang-ky-vay/dang-ky-vay.css'
import './mo-the.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

/* ── Data bê từ the-tin-dung ── */
const FEATURES = [
  { number: '2%',   label: 'Phí rút tiền',  desc: 'Cho các giao dịch rút tiền mặt tại ATM lên đến 100% hạn mức thẻ' },
  { number: '45',   label: 'Ngày',           desc: 'Với chiếc thẻ tín dụng "THE FIRST", bạn sẽ được ưu đãi miễn lãi suất lên đến 45 ngày' },
  { number: '0%',   label: 'Lãi suất',       desc: 'Thỏa sức mua sắm với ưu đãi chuyển đổi trả góp 0% lãi suất' },
  { number: '0.5%', label: 'Điểm thưởng',    desc: 'Điểm thưởng được tích lũy không giới hạn với 0.5% số tiền giao dịch' },
]

const HIGHLIGHTS = [
  'Rút tiền mặt lên đến 100% hạn mức thẻ chỉ với 2% phí rút tiền',
  '"Mua trước, trả sau" với thời gian miễn lãi lên đến 45 ngày',
  'Trả góp linh hoạt với ưu đãi 0% lãi suất',
  'Tích lũy điểm thưởng không giới hạn với 0.5% số tiền giao dịch',
  'Dễ dàng rút tiền mặt bằng thẻ phi vật lý tại quầy giao dịch VPBank sau khi phát hành thẻ thành công trên iShinhan',
  'Quản lý và sử dụng các tính năng thẻ linh hoạt, nhanh chóng qua ứng dụng iShinhan',
]

const CONDITIONS = [
  { icon: 'fas fa-user',           text: 'Khách hàng nữ: Độ tuổi từ 21 đến 55, khách hàng nam: Độ tuổi từ 21 đến 58' },
  { icon: 'fas fa-money-bill-wave',text: 'Thu nhập tối thiểu: 4.0 triệu đồng/tháng' },
  { icon: 'fas fa-map-marker-alt', text: 'Nơi sinh sống: TP. HCM, Hà Nội, Đà Nẵng và các tỉnh thành/khu vực có hỗ trợ của Shinhan Finance' },
  { icon: 'fas fa-briefcase',      text: 'Công việc: đi làm hưởng lương' },
]

const FAQS = [
  { q: 'Hạn mức và thời hạn sử dụng của thẻ tín dụng Shinhan Finance THE FIRST?', a: 'Hạn mức thẻ tín dụng tùy thuộc vào thu nhập và hồ sơ tín dụng của bạn. Thời hạn sử dụng thẻ là 3 năm kể từ ngày phát hành.' },
  { q: 'Ngày thanh toán dư nợ thẻ tín dụng là ngày nào?', a: 'Ngày đến hạn thanh toán được ghi trên sao kê hàng tháng, thường là 15 ngày sau ngày chốt sao kê.' },
  { q: 'Tôi có thể kích hoạt thẻ tín dụng bằng phương thức nào?', a: 'Bạn có thể kích hoạt thẻ qua ứng dụng iShinhan hoặc gọi đến Hotline 0969 930 328.' },
  { q: 'Tôi có thể tạo ePin bằng phương thức nào?', a: 'Bạn có thể tạo ePin qua ứng dụng iShinhan theo hướng dẫn trong mục Dịch vụ thẻ online.' },
  { q: 'Làm thế nào để tôi thanh toán dư nợ thẻ tín dụng?', a: 'Bạn có thể thanh toán qua iShinhan, chuyển khoản ngân hàng, hoặc tại các điểm giao dịch Shinhan Finance.' },
  { q: 'Những lưu ý giúp quý khách sử dụng thẻ tín dụng an toàn?', a: 'Không chia sẻ thông tin thẻ, kiểm tra sao kê thường xuyên, thiết lập giới hạn giao dịch trên iShinhan.' },
  { q: 'Tôi sẽ thanh toán bằng thẻ tín dụng ra sao tại các địa điểm mua sắm?', a: 'Quẹt thẻ tại máy POS hoặc sử dụng tính năng contactless (chạm thanh toán) tại các cửa hàng có hỗ trợ Visa/Mastercard.' },
  { q: 'Làm thế nào để rút tiền mặt tại máy ATM?', a: 'Đưa thẻ vào máy ATM, nhập mã PIN (ePin), chọn số tiền cần rút. Phí rút tiền là 2% trên số tiền giao dịch.' },
  { q: 'Tôi muốn mua hàng và thanh toán trực tuyến bằng thẻ tín dụng', a: 'Nhập thông tin thẻ (số thẻ, ngày hết hạn, CVV) tại trang thanh toán của website/ứng dụng mua sắm trực tuyến.' },
  { q: 'Phí Rút Tiền Mặt Thẻ Tín Dụng Shinhan Finance', a: 'Phí rút tiền mặt là 2% trên số tiền giao dịch. Bạn có thể rút tiền mặt tại ATM lên đến 100% hạn mức thẻ.' },
  { q: 'Cách Đăng Ký Mở Thẻ Tín Dụng Online Shinhan Finance', a: 'Đăng ký trực tuyến trên website Shinhan Finance hoặc ứng dụng iShinhan. Chuẩn bị CCCD và giấy tờ chứng minh thu nhập.' },
  { q: 'Cách Thanh Toán Dư Nợ Thẻ Tín Dụng', a: 'Thanh toán qua ứng dụng iShinhan, chuyển khoản ngân hàng đến tài khoản Shinhan Finance, hoặc tại các điểm giao dịch.' },
]

const PROVINCES = [
  'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Đồng Nai',
  'Cần Thơ', 'Hải Phòng', 'An Giang', 'Bà Rịa - Vũng Tàu',
]

// Phone validation (same as dang-ky-vay)
const PHONE_REGEX = /^(03|05|07|08|09)\d{8}$/
function validatePhone(v: string) {
  if (!v) return 'Vui lòng nhập số điện thoại'
  if (!PHONE_REGEX.test(v)) return 'Số điện thoại không hợp lệ (10 số, đầu 03x/05x/07x/08x/09x)'
  return ''
}

export default function MoThePage() {
  const [step, setStep] = useState(1)        // 1 = form, 2 = confirm
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [refCode, setRefCode] = useState('')

  const [formData, setFormData] = useState({
    fullName: '', phone: '', province: '', income: '',
  })

  // 3D tilt for card image (bê từ the-tin-dung)
  const cardRef = useRef<HTMLDivElement>(null)
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateY = ((x - centerX) / centerX) * 15
    const rotateX = ((centerY - y) / centerY) * 15
    el.style.transform = `perspective(667px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])
  const handleCardMouseLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(667px) rotateX(0deg) rotateY(0deg)'
  }, [])

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validatePhone(formData.phone)
    if (err) { setPhoneError(err); return }
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirm = () => {
    setShowSuccessModal(true)
    setRefCode(Date.now().toString().slice(-6))
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
    setStep(1)
    setFormData({ fullName: '', phone: '', province: '', income: '' })
  }

  return (
    <>
      <Header />
      <main className="cc-page">

        {/* ===== SECTION 1: HERO TITLE + FEATURES ===== */}
        <section className="cc-features mo-the-hero-section" style={{ paddingTop: '84px' }}>
          <div className="container">
            {/* Title điểm nhấn */}
            <div className="mo-the-hero-title">
              <span className="mo-the-brand">THE FIRST</span>
              <span className="mo-the-separator">—</span>
              <span className="mo-the-subtitle">Giải pháp tài chính thẻ tín dụng hoàn hảo</span>
            </div>
            {/* 4 cards scale 60% */}
            <div className="cc-features-grid mo-the-features-sm">
              {FEATURES.map((f, i) => (
                <div key={i} className="cc-feature-card">
                  <div className="cc-feature-number">
                    <span className="cc-feature-big">{f.number}</span>
                    <span className="cc-feature-label">{f.label}</span>
                  </div>
                  <p className="cc-feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: FORM ĐĂNG KÝ MỞ THẺ — bê cấu trúc từ dang-ky-vay ===== */}
        <section className="lf-form-section">
          <div className="lf-container">
            <h2 className="lf-form-hero-title">
              {step === 1 ? 'Thông tin đăng ký mở thẻ tín dụng THE FIRST' : 'Kiểm tra lại thông tin đăng ký'}
            </h2>
            <p className="lf-form-disclaimer">
              Bằng việc cung cấp thông tin cá nhân, bạn cam kết đã đọc, hiểu rõ và đồng ý các nội dung của Thông báo{' '}
              <a href="#">xử lý dữ liệu cá nhân</a> và <a href="#">chính sách bảo mật</a> của Shinhan Finance.
            </p>

            {step === 1 && (
              <form className="lf-shinhan-form" onSubmit={handleSubmitStep1}>
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
                        maxLength={10} inputMode="numeric"
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
                        {PROVINCES.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Thu nhập */}
                <div className="lf-sf-block">
                  <h3 className="lf-sf-block-title">Thông tin nghề nghiệp</h3>
                  <div className="lf-sf-grid">
                    <div className="lf-sf-field">
                      <label>Thu nhập hàng tháng (VNĐ)</label>
                      <input type="text" placeholder="8,000,000"
                        value={formData.income}
                        onChange={e => setFormData({ ...formData, income: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="lf-sf-actions">
                  <button type="submit" className="lf-sf-submit">
                    Tiếp tục <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="lf-shinhan-form">
                {/* Summary */}
                <div className="lf-sf-summary">
                  <div className="lf-sf-sum-row">
                    <div className="lf-sf-sum-item">
                      <span className="lf-sf-sum-label">Sản phẩm</span>
                      <span className="lf-sf-sum-val">Thẻ tín dụng THE FIRST</span>
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
                    {formData.income && (
                      <div className="lf-sf-sum-item">
                        <span className="lf-sf-sum-label">Thu nhập</span>
                        <span className="lf-sf-sum-val">{formData.income}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lf-sf-actions" style={{ gap: '12px', flexWrap: 'wrap' }}>
                  <button type="button" className="lf-sf-submit-outline" onClick={() => setStep(1)}>
                    <i className="fas fa-arrow-left"></i> Chỉnh sửa
                  </button>
                  <button type="button" className="lf-sf-submit" onClick={handleConfirm}>
                    <i className="fas fa-paper-plane"></i> Xác nhận & Gửi
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===== SECTION 3: ĐẶC TÍNH THẺ + ĐIỀU KIỆN — bê từ the-tin-dung ===== */}
        <section className="cc-details">
          <div className="container">
            <h2 className="cc-section-title">Đặc tính thẻ tín dụng THE FIRST</h2>
            <div className="cc-details-content">
              <div className="cc-details-text">
                <p><strong>Thẻ tín dụng</strong> là công cụ tài chính hữu ích giúp bạn dễ dàng thanh toán các giao dịch mua sắm, giải trí, và quản lý tài chính cá nhân một cách linh hoạt.</p>
                <p>Với nhiều <strong>ưu đãi vượt trội</strong>, thẻ tín dụng THE FIRST mang đến cho bạn trải nghiệm thanh toán dễ dàng cùng những quyền lợi hấp dẫn:</p>
                <ul className="cc-highlights">
                  {HIGHLIGHTS.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                {/* Nội dung điều kiện mở thẻ */}
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '32px', marginBottom: '12px' }}>Điều Kiện Mở Thẻ</h3>
                <ul className="cc-cond-list">
                  {CONDITIONS.map((c, i) => (
                    <li key={i}>
                      <i className={c.icon}></i>
                      <span>{c.text}</span>
                    </li>
                  ))}
                </ul>

                <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '24px', marginBottom: '12px' }}>Thủ tục mở thẻ THE FIRST</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Chuẩn bị hồ sơ:</p>
                <ul className="cc-cond-list">
                  <li><i className="fas fa-id-card"></i><span>CCCD còn hiệu lực.</span></li>
                  <li><i className="fas fa-file-alt"></i><span>Giấy tờ chứng minh thu nhập (hợp đồng lao động, sao kê lương, v.v.).</span></li>
                </ul>
              </div>
              <div className="cc-details-image"
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <Image src="/images/credit-card/the-first-cards.png" alt="THE FIRST Card" width={480} height={320} style={{objectFit:'contain', width:'100%', height:'auto'}} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: FAQ — bê quy cách từ dang-ky-vay ===== */}
        <section className="lf-section lf-faq-section">
          <div className="lf-container">
            <div className="lf-faq-header">
              <h2>Một số câu hỏi thường gặp</h2>
              <Link href="/san-pham/the-tin-dung" className="lf-link-all">Xem tất cả FAQs</Link>
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

      </main>
      <Footer />
      <FloatingButtons />

      {/* ── Success Modal — bê từ dang-ky-vay ── */}
      {showSuccessModal && (
        <div className="lf-modal-overlay" onClick={handleCloseModal}>
          <div className="lf-modal-box" onClick={e => e.stopPropagation()}>
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
              Cảm ơn bạn đã đăng ký thẻ tín dụng <strong>THE FIRST</strong>.<br />
              Chuyên viên Shinhan Finance sẽ liên hệ trong vòng <strong>24 giờ</strong> làm việc.
            </p>

            <div className="lf-modal-info">
              <span><i className="fas fa-phone-alt"></i> {formData.phone}</span>
              {formData.province && <span><i className="fas fa-map-marker-alt"></i> {formData.province}</span>}
            </div>

            <button className="lf-modal-btn" onClick={handleCloseModal}>
              <i className="fas fa-home"></i> Về trang chủ
            </button>
            <p className="lf-modal-note">Mã tham chiếu: SHF-CC-{refCode}</p>
          </div>
        </div>
      )}
    </>
  )
}
