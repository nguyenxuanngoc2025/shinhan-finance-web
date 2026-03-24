'use client'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import '../chinh-sach-bao-mat/policy.css'

export default function MienTruTrachNhiemPage() {
  return (
    <>
      <Header />
      <main className="policy-page">
        <div className="policy-hero">
          <div className="container">
            <nav className="policy-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <span>Miễn trừ trách nhiệm</span>
            </nav>
            <h1>Miễn Trừ Trách Nhiệm</h1>
          </div>
        </div>

        <div className="policy-body">
          <div className="container">
            <div className="policy-content">

              <h2>Điều khoản sử dụng</h2>
              <p>Xin vui lòng xem kỹ những quy định dưới đây trước khi Quý khách tiếp tục truy cập website. Việc truy cập vào website có nghĩa rằng Quý khách đồng ý với những quy định và điều kiện dưới đây.</p>
              <p>Thông tin chúng tôi sử dụng trên website chỉ dành cho mục đích tham khảo và có thể thay đổi mà không cần phải thông báo và không nên sử dụng chúng như những lời khuyên. Shinhan Bank có thể thay đổi các quy định này và cập nhật bất cứ lúc nào; do đó, Quý khách nên truy cập website thường xuyên để có được thông tin mới nhất.</p>

              <h2>Bản quyền và thương hiệu</h2>
              <p>Thông tin và hình ảnh trên website thuộc quyền sở hữu của Shinhan Bank. Việc sao chép, sử dụng phải được Shinhan Bank chấp thuận trước bằng văn bản.</p>

              <h2>Miễn trừ trách nhiệm</h2>
              <p>Tất cả những tư liệu được cung cấp trên website này đều mang tính tham khảo. Do đó, nội dung và hình ảnh sẽ được thay đổi, cập nhật và cải tiến thường xuyên mà không phải thông báo trước.</p>
              <p>Shinhan Bank không bảo đảm về độ chính xác cũng như sự hoàn thiện về thông tin. Chúng tôi không chịu trách nhiệm pháp lý cho những thiệt hại xuất hiện trực tiếp hay gián tiếp từ việc sử dụng hoặc hành động dựa theo những thông tin trên hoặc một số thông tin xuất hiện trên website này.</p>
              <p>Shinhan Bank không chịu trách nhiệm pháp lý về những sai sót, lỗi chính tả do nhập liệu cùng với những sự cố khách quan khác như: nhiễm virus, hành vi phá hoại, ác ý... xảy ra trên website này cũng như các website liên kết, nếu có.</p>

              <h2>Đường link liên kết</h2>
              <p>Shinhan Bank sẽ không chịu trách nhiệm hay có nghĩa vụ pháp lý dưới bất kỳ hình thức nào về nội dung của những website không thuộc Shinhan Bank được liên kết với website, bao gồm các sản phẩm, dịch vụ và những mặt hàng khác được giới thiệu thông qua những website đó.</p>

              <div className="policy-contact-box">
                <h3>Liên hệ</h3>
                <p><strong>Điện thoại / Zalo:</strong> <a href="tel:0969930328">0969 930 328</a></p>
                <p><strong>Email:</strong> <a href="mailto:dvkh@shinhanfinance.com.vn">dvkh@shinhanfinance.com.vn</a></p>
                <p><strong>Địa chỉ:</strong> Tòa nhà Pico Plaza, 20 Cộng Hòa, Phường Bảy Hiền, Quận Tân Bình, TP.HCM</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
