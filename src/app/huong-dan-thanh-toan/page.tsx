'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const METHODS = [
  {
    icon: 'fas fa-university',
    title: 'Chuyển khoản ngân hàng',
    steps: [
      'Đăng nhập Internet Banking / Mobile Banking',
      'Chọn "Chuyển khoản liên ngân hàng"',
      'Nhập số tài khoản Shinhan Bank (thông tin trên hợp đồng)',
      'Nhập số tiền thanh toán và nội dung: Số hợp đồng + Họ tên',
      'Xác nhận và hoàn tất giao dịch',
    ],
  },
  {
    icon: 'fas fa-store',
    title: 'Thanh toán tại cửa hàng đối tác',
    steps: [
      'Đến cửa hàng Nguyễn Kim, CellphoneS, Di Động Việt, Hoàng Hà Mobile',
      'Cung cấp số hợp đồng và CMND/CCCD',
      'Thanh toán bằng tiền mặt hoặc thẻ',
      'Nhận biên lai xác nhận',
    ],
  },
  {
    icon: 'fas fa-wallet',
    title: 'Ví điện tử',
    steps: [
      'Mở ứng dụng MoMo / ZaloPay / VNPay',
      'Chọn "Thanh toán hóa đơn" hoặc "Tài chính"',
      'Tìm "Shinhan Bank"',
      'Nhập số hợp đồng và số tiền thanh toán',
      'Xác nhận thanh toán',
    ],
  },
  {
    icon: 'fas fa-money-bill-wave',
    title: 'Thanh toán tại bưu điện',
    steps: [
      'Mang theo số hợp đồng và CMND/CCCD đến bưu điện gần nhất',
      'Thông báo thanh toán cho Shinhan Bank',
      'Nộp tiền mặt và nhận biên lai',
    ],
  },
]

export default function HuongDanThanhToanPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 80, minHeight: '60vh' }}>
        <section className="container" style={{ padding: '48px 60px 80px', maxWidth: 960 }}>
          <h1 className="section-title">Hướng dẫn thanh toán</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 16, marginBottom: 48, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
            Shinhan Bank cung cấp nhiều phương thức thanh toán nhanh chóng và tiện lợi
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {METHODS.map((m) => (
              <div key={m.title} style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--shinhan-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--shinhan-blue)', marginBottom: 16 }}>
                  <i className={m.icon}></i>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{m.title}</h2>
                <ol style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {m.steps.map((step, i) => (
                    <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: 24, background: 'var(--shinhan-blue-light)', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>
              <strong>Lưu ý:</strong> Vui lòng thanh toán đúng hạn để tránh phát sinh lãi phạt. Hotline hỗ trợ: <a href="tel:0969930328" style={{ color: 'var(--shinhan-blue)', fontWeight: 700 }}>0969 930 328</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
