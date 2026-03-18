'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './credit-card.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'

const FEATURES = [
  {
    number: '2%',
    label: 'Phí rút tiền',
    desc: 'Cho các giao dịch rút tiền mặt tại ATM lên đến 100% hạn mức thẻ',
  },
  {
    number: '45',
    label: 'Ngày',
    desc: 'Với chiếc thẻ tín dụng "THE FIRST", bạn sẽ được ưu đãi miễn lãi suất lên đến 45 ngày',
  },
  {
    number: '0%',
    label: 'Lãi suất',
    desc: 'Thỏa sức mua sắm với ưu đãi chuyển đổi trả góp 0% lãi suất',
  },
  {
    number: '0.5%',
    label: 'Điểm thưởng',
    desc: 'Điểm thưởng được tích lũy không giới hạn với 0.5% số tiền giao dịch',
  },
]

const HIGHLIGHTS = [
  'Rút tiền mặt lên đến 100% hạn mức thẻ chỉ với 2% phí rút tiền',
  '"Mua trước, trả sau" với thời gian miễn lãi lên đến 45 ngày',
  'Trả góp linh hoạt với ưu đãi 0% lãi suất',
  'Tích lũy điểm thưởng không giới hạn với 0.5% số tiền giao dịch',
  'Dễ dàng rút tiền mặt bằng thẻ phi vật lý tại quầy giao dịch VPBank sau khi phát hành thẻ thành công trên iShinhan',
  'Quản lý và sử dụng các tính năng thẻ linh hoạt, nhanh chóng qua ứng dụng iShinhan',
]

const DOC_LINKS = [
  { label: 'Biểu phí', href: 'https://shinhanfinance.com.vn/assets/products/Credit-Card-Tariff-T10.2025.pdf' },
  { label: 'Hướng dẫn thanh toán dư nợ thẻ tín dụng Shinhan Finance', href: 'https://shinhanfinance.com.vn/assets/site/HD_thanh-toan-du-no-the_VI-221123.pdf' },
  { label: 'Hướng dẫn tính năng Thanh toán với Google Pay', href: 'https://shinhanfinance.com.vn/assets/products/H%C6%B0%E1%BB%9Bng-d%E1%BA%ABn-t%C3%ADnh-n%C4%83ng-Thanh-to%C3%A1n-v%E1%BB%9Bi-Google-Pay_VI.pdf' },
  { label: 'Hướng dẫn Rút tiền mặt linh hoạt bằng thẻ tín dụng phi vật lý', href: 'https://shinhanfinance.com.vn/assets/promotionTag/Introduction_CW_VirtualCard_FaQ.pdf' },
  { label: 'Hướng dẫn cách mở thẻ tín dụng đơn giản nhanh chóng.', href: '#' },
]

const TRA_GOP_LINKS = [
  { label: 'Quy định chung dịch vụ trả góp', href: 'https://www.shinhanfinance.com.vn/assets/site/Quy-dinh-chung-cua-tra-gop-the-tin-dung-Vi_2023-09-27-022029.pdf' },
  { label: 'Hướng dẫn chuyển đổi trả góp', href: 'https://shinhanfinance.com.vn/assets/products/HD_CHUYEN-DOI-TRA-GOP_vi-v2.pdf' },
]

const ONLINE_SERVICE_LINKS = [
  { label: 'Tạo ePin', href: 'https://shinhanfinance.com.vn/assets/products/HD_tao-ePin-the_vi.pdf' },
  { label: 'Kích hoạt thẻ', href: 'https://shinhanfinance.com.vn/assets/products/HD_kich-hoat-the_vi.pdf' },
  { label: 'Thanh toán qua iShinhan', href: 'https://shinhanfinance.com.vn/assets/products/HD_thanh-toan-the_vi.pdf' },
  { label: 'Tạo và quản lý mã rút tiền mặt linh hoạt với thẻ tín dụng phi vật lý', href: 'https://shinhanfinance.com.vn/assets/promotionTag/Introduction_CW_VirtualCard_iSH_vn.pdf' },
]

const CONDITIONS = [
  { icon: 'fas fa-user', text: 'Khách hàng nữ: Độ tuổi từ 21 đến 55, khách hàng nam: Độ tuổi từ 21 đến 58' },
  { icon: 'fas fa-money-bill-wave', text: 'Thu nhập tối thiểu: 4.0 triệu đồng/tháng' },
  { icon: 'fas fa-map-marker-alt', text: 'Nơi sinh sống: TP. HCM, Hà Nội, Đà Nẵng và các tỉnh thành/khu vực có hỗ trợ của Shinhan Finance' },
  { icon: 'fas fa-briefcase', text: 'Công việc: đi làm hưởng lương' },
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
  { q: 'Những thông tin quý khách cần lưu ý khi đọc sao kê thẻ tín dụng', a: 'Kiểm tra số dư nợ, ngày chốt sao kê, ngày đến hạn thanh toán, số tiền thanh toán tối thiểu và chi tiết các giao dịch trong kỳ.' },
  { q: 'Những lợi ích của mua hàng trả góp?', a: 'Trả góp 0% lãi suất cho nhiều kỳ hạn, giúp bạn quản lý chi tiêu hiệu quả mà không cần thanh toán toàn bộ ngay lập tức.' },
  { q: 'Làm thế nào để tôi có thể chuyển đổi các giao dịch thành trả góp', a: 'Sử dụng ứng dụng iShinhan, chọn giao dịch cần chuyển đổi và chọn kỳ hạn trả góp phù hợp. Hoặc liên hệ Hotline 0969 930 328.' },
  { q: 'Trong trường hợp tôi tất toán trước hạn khoản trả góp thì có bị tính phí không?', a: 'Có, phí tất toán trước hạn sẽ được áp dụng theo quy định của Shinhan Finance. Chi tiết vui lòng xem Biểu phí.' },
  { q: 'Lãi và phí phạt cho trường hợp thanh toán trễ hạn là bao nhiêu?', a: 'Lãi suất và phí phạt trễ hạn được quy định trong Biểu phí thẻ tín dụng. Vui lòng thanh toán đúng hạn để tránh phát sinh chi phí.' },
  { q: 'Điều kiện, điều khoản và hướng dẫn sử dụng thẻ tín dụng THE FIRST', a: 'Vui lòng tham khảo chi tiết điều kiện, điều khoản trong tài liệu Hợp đồng thẻ tín dụng hoặc liên hệ Hotline 0969 930 328.' },
  { q: 'Cách Thanh Toán Dư Nợ Thẻ Tín Dụng', a: 'Thanh toán qua ứng dụng iShinhan, chuyển khoản ngân hàng đến tài khoản Shinhan Finance, hoặc tại các điểm giao dịch.' },
  { q: 'Phí Rút Tiền Mặt Thẻ Tín Dụng Shinhan Finance', a: 'Phí rút tiền mặt là 2% trên số tiền giao dịch. Bạn có thể rút tiền mặt tại ATM lên đến 100% hạn mức thẻ.' },
  { q: 'Cách Đăng Ký Mở Thẻ Tín Dụng Online Shinhan Finance', a: 'Đăng ký trực tuyến trên website Shinhan Finance hoặc ứng dụng iShinhan. Chuẩn bị CCCD và giấy tờ chứng minh thu nhập.' },
]

export default function CreditCardPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // 3D tilt effect for card image (like original site)
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

  return (
    <>
      <Header />
      <main className="cc-page">
      {/* ===== HERO SECTION ===== */}
      <section className="cc-hero">
        <div className="cc-hero-content">
          <div className="cc-hero-text">
            <h1 className="cc-hero-title">
              Giải pháp tài chính<br />
              thẻ tín dụng hoàn hảo
            </h1>
            <p className="cc-hero-desc">
              <em>Với chiếc thẻ tín dụng đa năng THE FIRST, bạn sẽ được tận hưởng nhiều ưu đãi khi chi tiêu và dễ dàng rút tiền mặt lên đến 100% hạn mức thẻ</em>
            </p>
            <Link href="/mo-the" className="cc-hero-cta">
              Mở thẻ ngay
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SUB NAV TABS (giống trang gốc) ===== */}
      <nav className="cc-subnav">
        <div className="container">
          <div className="cc-subnav-list">
            <Link href="/" className="cc-subnav-item">Trang chủ</Link>
            <Link href="/#products" className="cc-subnav-item active">Sản phẩm</Link>
            <Link href="/tin-tuc" className="cc-subnav-item">Khuyến mãi</Link>
            <Link href="#" className="cc-subnav-item">Shinhan Zone</Link>
          </div>
        </div>
      </nav>

      {/* ===== ƯU ĐIỂM VƯỢT TRỘI ===== */}
      <section className="cc-features">
        <div className="container">
          <h2 className="cc-section-title">Ưu điểm vượt trội</h2>
          <div className="cc-features-grid">
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

      {/* ===== ĐẶC TÍNH THẺ ===== */}
      <section className="cc-details">
        <div className="container">
          <h2 className="cc-section-title">Đặc tính thẻ tín dụng THE FIRST</h2>
          <div className="cc-details-content">
            <div className="cc-details-text">
              <p><strong>Thẻ tín dụng</strong> là công cụ tài chính hữu ích giúp bạn dễ dàng thanh toán các giao dịch mua sắm, giải trí, và quản lý tài chính cá nhân một cách linh hoạt. Nếu bạn đang tìm hiểu về <strong>thẻ tín dụng</strong> và cách sử dụng nó hiệu quả, thì thẻ tín dụng THE FIRST từ Shinhan Finance chính là lựa chọn tuyệt vời.</p>
              <p>Với nhiều <strong>ưu đãi vượt trội</strong>, thẻ tín dụng THE FIRST mang đến cho bạn trải nghiệm thanh toán dễ dàng cùng những quyền lợi hấp dẫn:</p>
              <ul className="cc-highlights">
                {HIGHLIGHTS.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <p className="cc-details-intro">Hãy cùng Shinhan Finance tìm hiểu rõ hơn về thẻ tín dụng THE FIRST thông qua các thông tin dưới đây.</p>
            </div>
            <div
              className="cc-details-image"
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <Image src="/images/credit-card/the-first-cards.png" alt="THE FIRST Card" width={480} height={320} style={{objectFit:'contain', width:'100%', height:'auto'}} />
            </div>
          </div>
          <div className="cc-docs-row">
            {DOC_LINKS.map((d, i) => (
              <a key={i} href={d.href} className="cc-doc-link" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-file-pdf"></i> {d.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DỊCH VỤ THẺ ===== */}
      <section className="cc-services">
        <div className="container">
          <h2 className="cc-section-title">Dịch vụ thẻ</h2>
          <div className="cc-services-grid">
            {/* Dịch vụ trả góp */}
            <div className="cc-service-block">
              <div className="cc-service-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h3>Dịch vụ trả góp bằng thẻ tín dụng</h3>
              <p>Thỏa sức mua sắm với ưu đãi chuyển đổi trả góp 0% lãi suất chỉ bằng 1 chạm:</p>
              <ul className="cc-service-links">
                {TRA_GOP_LINKS.map((l, i) => (
                  <li key={i}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-file-pdf"></i> {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="https://shinhanfinance.com.vn/installment" className="cc-service-more" target="_blank" rel="noopener noreferrer">
                Xem thêm <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            {/* Dịch vụ thẻ online */}
            <div className="cc-service-block">
              <div className="cc-service-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Dịch vụ thẻ online trên ứng dụng iShinhan</h3>
              <p>Quản lý thẻ tín dụng dễ dàng ngay trên điện thoại:</p>
              <ul className="cc-service-links">
                {ONLINE_SERVICE_LINKS.map((l, i) => (
                  <li key={i}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-file-pdf"></i> {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MỞ THẺ DỄ DÀNG + QUẢN LÝ CHI TIÊU ===== */}
      <section className="cc-benefits">
        <div className="container">
          <div className="cc-benefits-grid">
            <div className="cc-benefit-block">
              <div className="cc-benefit-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3>Mở Thẻ Dễ Dàng - Thủ Tục Đơn Giản</h3>
              <p>Với thủ tục đơn giản và nhiều ưu đãi hấp dẫn, mở thẻ tín dụng online tại Shinhan Finance không còn là việc khó khăn. Hãy tận dụng những lợi ích mà thẻ tín dụng Shinhan Finance mang lại để quản lý chi tiêu hiệu quả và tiết kiệm chi phí.</p>
            </div>
            <div className="cc-benefit-block">
              <div className="cc-benefit-icon">
                <i className="fas fa-gift"></i>
              </div>
              <h3>Quản Lý Chi Tiêu Hiệu Quả - Nhận Ngay Ưu Đãi Hấp Dẫn</h3>
              <p>Thẻ tín dụng THE FIRST không chỉ giúp bạn quản lý chi tiêu hiệu quả mà còn nhận được nhiều ưu đãi hấp dẫn từ các đối tác lớn như Grab, Shopee, ZaloPay, và Momo...</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ĐIỀU KIỆN & THỦ TỤC ===== */}
      <section className="cc-conditions">
        <div className="container">
          <h2 className="cc-section-title">Điều kiện &amp; Thủ tục</h2>
          <div className="cc-conditions-grid">
            <div className="cc-cond-block">
              <h3>Điều Kiện Mở Thẻ Tín Dụng Shinhan Finance</h3>
              <p>Để có thể làm thẻ tín dụng Shinhan Finance, bạn cần đáp ứng một số điều kiện:</p>
              <ul className="cc-cond-list">
                {CONDITIONS.map((c, i) => (
                  <li key={i}>
                    <i className={c.icon}></i>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cc-cond-block">
              <h3>Thủ tục mở thẻ THE FIRST</h3>
              <p>Chuẩn bị hồ sơ:</p>
              <ul className="cc-cond-list">
                <li><i className="fas fa-id-card"></i><span>CCCD còn hiệu lực.</span></li>
                <li><i className="fas fa-file-alt"></i><span>Giấy tờ chứng minh thu nhập (hợp đồng lao động, sao kê lương, v.v.).</span></li>
              </ul>
              <p style={{marginTop: '16px'}}>Đăng ký:</p>
              <ul className="cc-cond-list">
                <li><i className="fas fa-globe"></i><span>Trực tuyến trên website Shinhan Finance hoặc ứng dụng iShinhan.</span></li>
                <li><i className="fas fa-building"></i><span>Đến trực tiếp các chi nhánh/điểm giao dịch Shinhan Finance để được tư vấn.</span></li>
              </ul>
              <Link href="/mo-the" className="cc-apply-btn">Mở thẻ ngay</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CÂU HỎI THƯỜNG GẶP ===== */}
      <section className="cc-faq">
        <div className="container">
          <h2 className="cc-section-title">Câu hỏi thường gặp</h2>
          <div className="cc-faq-wrapper">
            <div className="cc-faq-list">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className={`cc-faq-item${openFaq === i ? ' open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="cc-faq-q">
                    <span>{faq.q}</span>
                    <i className={`fas fa-${openFaq === i ? 'minus' : 'plus'}`}></i>
                  </div>
                  {openFaq === i && (
                    <div className="cc-faq-a">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
