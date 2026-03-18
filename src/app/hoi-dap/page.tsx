'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const FAQS = [
  {
    category: 'Vay tín chấp',
    items: [
      { q: 'Vay tín chấp là gì?', a: 'Vay tín chấp là hình thức vay tiền không cần tài sản thế chấp, chỉ cần CMND/CCCD và chứng minh thu nhập.' },
      { q: 'Hạn mức vay tối đa là bao nhiêu?', a: 'Hạn mức vay tín chấp tại Shinhan Finance lên đến 300 triệu đồng, tùy thuộc vào thu nhập và lịch sử tín dụng.' },
      { q: 'Thời gian xét duyệt mất bao lâu?', a: 'Thời gian xét duyệt từ 15 phút đến 24 giờ làm việc sau khi nhận đầy đủ hồ sơ.' },
      { q: 'Cần những giấy tờ gì?', a: 'CMND/CCCD, bảng lương hoặc giấy xác nhận thu nhập, sổ hộ khẩu hoặc giấy tạm trú.' },
    ],
  },
  {
    category: 'Thẻ tín dụng',
    items: [
      { q: 'Thẻ THE FIRST có phí thường niên không?', a: 'Miễn phí thường niên năm đầu tiên. Các năm sau miễn phí khi đạt doanh số chi tiêu tối thiểu.' },
      { q: 'Hạn mức thẻ tín dụng là bao nhiêu?', a: 'Hạn mức thẻ từ 5 triệu đến 100 triệu đồng, tùy thu nhập và đánh giá tín dụng.' },
      { q: 'Thời gian miễn lãi suất bao lâu?', a: 'Miễn lãi suất lên đến 45 ngày cho các giao dịch thanh toán.' },
    ],
  },
  {
    category: 'Thanh toán',
    items: [
      { q: 'Có những phương thức thanh toán nào?', a: 'Chuyển khoản ngân hàng, thanh toán tại cửa hàng đối tác, ví điện tử (MoMo, ZaloPay, VNPay), và bưu điện.' },
      { q: 'Thanh toán chậm có bị phạt không?', a: 'Có, thanh toán sau ngày đáo hạn sẽ phát sinh phí phạt trả chậm theo quy định trong hợp đồng.' },
      { q: 'Có thể tất toán trước hạn không?', a: 'Có, bạn có thể tất toán toàn bộ dư nợ trước hạn. Liên hệ hotline 0969 930 328 để được hỗ trợ.' },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #eee' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', paddingRight: 16 }}>{q}</span>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'}`} style={{ color: 'var(--shinhan-blue)', fontSize: 13, flexShrink: 0 }}></i>
      </button>
      {open && (
        <div style={{ padding: '0 0 18px', fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', animation: 'fadeIn 0.3s ease' }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function HoiDapPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 80, minHeight: '60vh' }}>
        <section className="container" style={{ padding: '48px 60px 80px', maxWidth: 880 }}>
          <h1 className="section-title">Câu hỏi thường gặp</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 16, marginBottom: 48 }}>
            Những thắc mắc phổ biến từ khách hàng Shinhan Finance
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {FAQS.map((group) => (
              <div key={group.category}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--shinhan-blue)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--shinhan-blue)' }}>
                  {group.category}
                </h2>
                <div>
                  {group.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: 24, background: 'var(--shinhan-blue-light)', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>
              Chưa tìm thấy câu trả lời? Liên hệ hotline <a href="tel:0969930328" style={{ color: 'var(--shinhan-blue)', fontWeight: 700 }}>0969 930 328</a> hoặc email <a href="mailto:dvkh@shinhanfinance.com.vn" style={{ color: 'var(--shinhan-blue)' }}>dvkh@shinhanfinance.com.vn</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
