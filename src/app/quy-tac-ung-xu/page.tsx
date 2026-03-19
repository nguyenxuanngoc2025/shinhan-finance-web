'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function QuyTacUngXuPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 80, minHeight: '60vh' }}>
        <section className="container" style={{ padding: '48px 60px 80px', maxWidth: 900 }}>
          <h1 className="section-title">Quy tắc ứng xử &amp; đạo đức</h1>

          <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: 15 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '32px 0 16px' }}>1. Mục đích</h2>
            <p>Bộ Quy tắc ứng xử và đạo đức kinh doanh này nhằm thiết lập các tiêu chuẩn hành vi cho toàn bộ nhân viên, cán bộ quản lý và đối tác của Shinhan Finance Việt Nam, đảm bảo hoạt động kinh doanh luôn tuân thủ pháp luật và các chuẩn mực đạo đức cao nhất.</p>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '32px 0 16px' }}>2. Nguyên tắc cốt lõi</h2>
            <ul style={{ paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}><strong>Trung thực và minh bạch:</strong> Mọi giao dịch được thực hiện minh bạch, rõ ràng.</li>
              <li style={{ marginBottom: 8 }}><strong>Tôn trọng khách hàng:</strong> Đặt quyền lợi khách hàng lên hàng đầu.</li>
              <li style={{ marginBottom: 8 }}><strong>Tuân thủ pháp luật:</strong> Hoạt động đúng quy định pháp luật Việt Nam.</li>
              <li style={{ marginBottom: 8 }}><strong>Bảo mật thông tin:</strong> Cam kết bảo vệ thông tin cá nhân khách hàng.</li>
              <li style={{ marginBottom: 8 }}><strong>Trách nhiệm xã hội:</strong> Đóng góp tích cực cho cộng đồng và xã hội.</li>
            </ul>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '32px 0 16px' }}>3. Phạm vi áp dụng</h2>
            <p>Áp dụng cho tất cả nhân viên, cộng tác viên, đối tác kinh doanh và nhà cung cấp của Shinhan Finance tại Việt Nam.</p>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '32px 0 16px' }}>4. Cam kết với khách hàng</h2>
            <p>Shinhan Finance cam kết cung cấp dịch vụ tài chính chất lượng cao, đảm bảo lãi suất và phí minh bạch, hỗ trợ khách hàng 24/7 và giải quyết khiếu nại trong thời gian sớm nhất.</p>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '32px 0 16px' }}>5. Liên hệ</h2>
            <p>Mọi thắc mắc về Bộ Quy tắc, vui lòng liên hệ:</p>
            <p><strong>Hotline:</strong> 0969 930 328</p>
            <p><strong>Email:</strong> dvkh@shinhanfinance.com.vn</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
