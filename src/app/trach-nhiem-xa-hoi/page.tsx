import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Trách nhiệm Xã hội | Shinhan Finance',
  description: 'Hoạt động trách nhiệm xã hội và phát triển bền vững của Shinhan Finance Việt Nam.',
}

export default function TrachNhiemXaHoiPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 80, minHeight: '60vh' }}>
        <section className="container" style={{ padding: '48px 60px 80px', maxWidth: 900 }}>
          <h1 className="section-title">Trách nhiệm Xã hội</h1>

          <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: 15 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '32px 0 16px' }}>Cam kết phát triển bền vững</h2>
            <p>Shinhan Finance Việt Nam luôn đặt trách nhiệm xã hội là một trong những giá trị cốt lõi, hướng tới phát triển bền vững và đóng góp tích cực cho cộng đồng Việt Nam.</p>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '32px 0 16px' }}>Các hoạt động nổi bật</h2>
            <ul style={{ paddingLeft: 20 }}>
              <li style={{ marginBottom: 12 }}><strong>Chương trình &quot;Shinhan vì cộng đồng&quot;:</strong> Hỗ trợ học bổng cho sinh viên có hoàn cảnh khó khăn tại các tỉnh thành trên cả nước.</li>
              <li style={{ marginBottom: 12 }}><strong>Tài chính toàn diện:</strong> Mang dịch vụ tài chính đến với người dân vùng sâu, vùng xa thông qua các chương trình cho vay ưu đãi.</li>
              <li style={{ marginBottom: 12 }}><strong>Bảo vệ môi trường:</strong> Tham gia các hoạt động trồng cây, bảo vệ rừng và giảm thiểu rác thải nhựa.</li>
              <li style={{ marginBottom: 12 }}><strong>Hỗ trợ thiên tai:</strong> Quyên góp và hỗ trợ đồng bào bị ảnh hưởng bởi thiên tai, lũ lụt.</li>
            </ul>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '32px 0 16px' }}>Tầm nhìn</h2>
            <p>Shinhan Finance hướng tới trở thành công ty tài chính hàng đầu Việt Nam không chỉ về hiệu quả kinh doanh mà còn về đóng góp cho cộng đồng và phát triển bền vững.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
