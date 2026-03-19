'use client'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import './policy.css'

export default function ChinhSachBaoMatPage() {
  return (
    <>
      <Header />
      <main className="policy-page">
        <div className="policy-hero">
          <div className="container">
            <nav className="policy-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <span>Chính sách bảo mật</span>
            </nav>
            <h1>Chính Sách Bảo Mật</h1>
            <p>Cập nhật lần cuối: 01/01/2025</p>
          </div>
        </div>

        <div className="policy-body">
          <div className="container">
            <div className="policy-content">
              <p className="policy-intro">
                Chính sách bảo mật này được áp dụng đối với tất cả người dùng khi truy cập website và sử dụng các dịch vụ do Shinhan Finance cung cấp. Chúng tôi cam kết bảo vệ quyền lợi của bạn và tuân thủ các quy định về bảo vệ thông tin cá nhân theo pháp luật Việt Nam. Việc bạn sử dụng website và các dịch vụ của chúng tôi đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với các điều khoản trong chính sách bảo mật này.
              </p>

              <h2>1. Thông tin thu thập</h2>
              <h3>1.1. Các loại thông tin thu thập</h3>
              <p>Chúng tôi thu thập và xử lý các loại thông tin sau từ người dùng khi sử dụng dịch vụ của Shinhan Finance:</p>
              <ul>
                <li><strong>Thông tin cá nhân:</strong> Họ tên, giới tính, ngày tháng năm sinh, số điện thoại, email, số chứng minh nhân dân (CMND), căn cước công dân (CCCD), địa chỉ nhà, nghề nghiệp, quốc tịch, thông tin tài khoản ngân hàng, thông tin thẻ tín dụng.</li>
                <li><strong>Thông tin giao dịch:</strong> Lịch sử giao dịch, các dịch vụ bạn đã yêu cầu, thông tin thanh toán và giao dịch.</li>
                <li><strong>Thông tin thiết bị và hoạt động:</strong> Địa chỉ IP, thông tin trình duyệt, hệ điều hành, các trang web đã truy cập, các hành động bạn thực hiện khi sử dụng dịch vụ.</li>
              </ul>

              <h3>1.2. Phương thức thu thập thông tin</h3>
              <ul>
                <li><strong>Thông qua biểu mẫu đăng ký:</strong> Chúng tôi thu thập thông tin cá nhân từ người dùng khi bạn điền vào các biểu mẫu đăng ký trên website hoặc khi bạn sử dụng dịch vụ trực tuyến của chúng tôi.</li>
                <li><strong>Thông qua các kênh giao tiếp khác:</strong> Chúng tôi thu thập thông tin qua các cuộc gọi điện thoại, email, tin nhắn hoặc các cuộc trò chuyện trực tiếp với khách hàng.</li>
                <li><strong>Cookies và công cụ theo dõi:</strong> Website của chúng tôi sử dụng cookies và các công cụ phân tích web để theo dõi hành vi người dùng và cải thiện trải nghiệm của bạn.</li>
              </ul>

              <h2>2. Mục đích thu thập thông tin</h2>
              <p>Chúng tôi thu thập thông tin cá nhân của bạn vì các mục đích sau:</p>
              <ul>
                <li><strong>Cung cấp dịch vụ:</strong> Để xử lý các giao dịch tài chính và cung cấp các dịch vụ mà bạn yêu cầu.</li>
                <li><strong>Hỗ trợ khách hàng:</strong> Để trả lời câu hỏi của bạn, giải quyết các vấn đề bạn gặp phải trong quá trình sử dụng dịch vụ.</li>
                <li><strong>Cải thiện dịch vụ:</strong> Để nâng cao chất lượng dịch vụ của chúng tôi thông qua việc phân tích dữ liệu người dùng.</li>
                <li><strong>Bảo mật và phòng ngừa gian lận:</strong> Để bảo vệ các giao dịch và ngăn ngừa các hành vi lừa đảo, tội phạm tài chính.</li>
                <li><strong>Gửi thông tin marketing:</strong> Nếu bạn đã đồng ý, chúng tôi sẽ gửi thông tin về các sản phẩm, dịch vụ mới, khuyến mại và các chương trình ưu đãi mà bạn có thể quan tâm.</li>
              </ul>

              <h2>3. Chia sẻ thông tin cá nhân</h2>
              <p>Chúng tôi cam kết không chia sẻ, bán hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào mà không có sự đồng ý của bạn, trừ các trường hợp sau:</p>
              <ul>
                <li><strong>Với các đối tác hoặc nhà cung cấp dịch vụ:</strong> Để cung cấp các dịch vụ hỗ trợ bạn, như dịch vụ thanh toán, bảo mật. Những đối tác này chỉ được phép sử dụng thông tin của bạn trong phạm vi cần thiết để thực hiện nhiệm vụ của họ.</li>
                <li><strong>Theo yêu cầu của cơ quan pháp lý:</strong> Chúng tôi sẽ chia sẻ thông tin của bạn khi có yêu cầu từ cơ quan nhà nước có thẩm quyền.</li>
                <li><strong>Trong trường hợp chuyển nhượng quyền sở hữu:</strong> Thông tin cá nhân của bạn có thể được chuyển giao cho bên nhận quyền sở hữu mới.</li>
              </ul>

              <h2>4. Bảo vệ thông tin cá nhân</h2>
              <p>Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi các hành vi truy cập trái phép, sử dụng hoặc tiết lộ. Các biện pháp bảo mật bao gồm:</p>
              <ul>
                <li><strong>Mã hóa thông tin:</strong> Chúng tôi sử dụng công nghệ mã hóa để bảo vệ thông tin của bạn trong quá trình truyền tải qua mạng.</li>
                <li><strong>Chế độ xác thực hai lớp:</strong> Để đảm bảo rằng chỉ có bạn mới có thể truy cập vào tài khoản của mình.</li>
                <li><strong>Hệ thống tường lửa và giám sát an ninh:</strong> Để phát hiện và ngăn ngừa các hành vi xâm nhập trái phép.</li>
              </ul>

              <h2>5. Quyền lợi của người dùng</h2>
              <p>Theo quy định của pháp luật Việt Nam về bảo vệ dữ liệu cá nhân, bạn có quyền:</p>
              <ul>
                <li><strong>Quyền truy cập:</strong> Bạn có quyền yêu cầu chúng tôi cung cấp thông tin về dữ liệu cá nhân mà chúng tôi đang lưu trữ.</li>
                <li><strong>Quyền sửa đổi:</strong> Bạn có quyền yêu cầu chúng tôi sửa đổi hoặc cập nhật thông tin cá nhân của bạn nếu thông tin đó không chính xác.</li>
                <li><strong>Quyền xóa bỏ:</strong> Bạn có quyền yêu cầu chúng tôi xóa bỏ thông tin cá nhân của bạn trong trường hợp không còn cần thiết.</li>
                <li><strong>Quyền hạn chế xử lý:</strong> Bạn có thể yêu cầu chúng tôi ngừng xử lý thông tin cá nhân của bạn trong một số tình huống nhất định.</li>
                <li><strong>Quyền phản đối:</strong> Bạn có thể phản đối việc sử dụng thông tin của mình cho mục đích marketing.</li>
              </ul>

              <h2>6. Thời gian lưu trữ thông tin</h2>
              <p>Chúng tôi chỉ lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để thực hiện các mục đích thu thập hoặc theo yêu cầu của pháp luật. Sau khi hết thời gian lưu trữ, thông tin cá nhân của bạn sẽ được xóa bỏ hoặc ẩn danh hóa.</p>

              <h2>7. Quản lý Cookies</h2>
              <p>Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng và thu thập dữ liệu phân tích web. Bạn có thể quản lý hoặc tắt cookies trong cài đặt trình duyệt của mình. Tuy nhiên, nếu bạn tắt cookies, một số tính năng trên website có thể không hoạt động đúng cách.</p>

              <h2>8. Cập nhật chính sách bảo mật</h2>
              <p>Chúng tôi có thể cập nhật chính sách bảo mật này để phản ánh các thay đổi trong các dịch vụ của chúng tôi hoặc yêu cầu của pháp luật. Mọi thay đổi sẽ có hiệu lực ngay sau khi được đăng tải trên website và sẽ được thông báo rõ ràng cho người dùng.</p>

              <h2>9. Liên hệ với chúng tôi</h2>
              <p>Nếu bạn có bất kỳ thắc mắc nào liên quan đến chính sách bảo mật này, vui lòng liên hệ:</p>
              <ul>
                <li><strong>Điện thoại / Zalo:</strong> <a href="tel:0969930328">0969 930 328</a></li>
                <li><strong>Email:</strong> <a href="mailto:dvkh@shinhanfinance.com.vn">dvkh@shinhanfinance.com.vn</a></li>
                <li><strong>Địa chỉ:</strong> Tòa nhà Pico Plaza, 20 Cộng Hòa, Phường Bảy Hiền, Quận Tân Bình, TP.HCM</li>
              </ul>

              <h2>10. Điều khoản áp dụng</h2>
              <p>Chính sách bảo mật này được điều chỉnh và tuân thủ theo quy định của pháp luật Việt Nam, bao gồm các quy định trong Luật An toàn thông tin mạng, Luật Bảo vệ quyền lợi người tiêu dùng và các văn bản pháp lý liên quan khác.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
