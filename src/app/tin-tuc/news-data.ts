export type NewsCategory = 'khuyen-mai' | 'su-kien' | 'thong-bao' | 'blog'

export interface NewsArticle {
  slug: string
  title: string
  excerpt: string
  content: string
  category: NewsCategory
  date: string
  image: string
}

export const CATEGORIES: { id: NewsCategory | 'tat-ca'; label: string }[] = [
  { id: 'tat-ca', label: 'Tất cả' },
  { id: 'thong-bao', label: 'Thông báo' },
  { id: 'su-kien', label: 'Sự kiện' },
  { id: 'khuyen-mai', label: 'Khuyến mại' },
  { id: 'blog', label: 'Blog' },
]

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'bat-deal-le-bat-uu-dai-cung-the-first',
    title: 'Bật deal lễ, bắt ưu đãi cùng THE FIRST',
    excerpt: 'Lễ vui rộn ràng, săn thêm deal mới! Nhằm giúp Khách hàng khởi động cho kỳ nghỉ lễ rực rỡ sắp tới, Shinhan Bank kết hợp cùng Mobile World Group (MWG) mang đến ưu đãi mua sắm 1.000.000 VNĐ và lãi suất 0%.',
    content: `<p>Lễ vui rộn ràng, săn thêm deal mới!</p>
<p>Nhằm giúp Khách hàng khởi động cho kỳ nghỉ lễ rực rỡ sắp tới, Shinhan Bank kết hợp cùng Mobile World Group (MWG) mang đến ưu đãi mua sắm 1.000.000 VNĐ và lãi suất 0% khi Khách hàng chuyển đổi trả góp thành công bằng thẻ tín dụng THE FIRST.</p>
<p>Cụ thể, từ ngày 14/03/2026 đến hết ngày 30/04/2026, Quý khách sẽ được giảm trực tiếp 1.000.000 VNĐ và hưởng lãi suất 0% khi mua sắm các sản phẩm điện máy, điện tử và chuyển đổi trả góp thành công bằng thẻ tín dụng THE FIRST. Áp dụng khi khách hàng thực hiện thanh toán qua hệ thống cửa hàng và website của MWG với hoá đơn từ 10.000.000 VNĐ. Nắm bắt cơ hội ngay!</p>
<h3>Lưu ý:</h3>
<ul>
<li>Thanh toán 100% đơn hàng qua thẻ tín dụng THE FIRST và chuyển đổi trả góp thành công.</li>
<li>Áp dụng khi thanh toán tại hệ thống cửa hàng và website chính thức của MWG (Thế Giới Di Động, Điện Máy Xanh, và Topzone).</li>
<li>Mỗi chủ thẻ được sử dụng 02 lượt ưu đãi/ chương trình.</li>
</ul>
<p>Với thẻ tín dụng THE FIRST, khách hàng sẽ được tận hưởng những ưu đãi tài chính vượt trội, mọi giao dịch đều thực hiện nhanh chóng và bảo mật tuyệt đối. Kết hợp thanh toán tiện lợi cùng nhiều phương thức thanh toán mới trên nền tảng tài chính số iShinhan.</p>
<p>Nhanh tay mua sắm những món đồ công nghệ hiện đại tại MWG với ưu đãi có hạn! Hãy cùng thẻ tín dụng THE FIRST đón một kỳ nghỉ lễ mua sắm thông minh, tiết kiệm tối đa.</p>`,
    category: 'khuyen-mai',
    date: '2026-03-12',
    image: '/images/news/bat-deal-le.png',
  },
  {
    slug: 'thanh-toan-nhanh-gon-bat-tron-deal-hoi-tai-ishinhan',
    title: 'Thanh toán nhanh gọn, bắt trọn deal hời tại iShinhan',
    excerpt: 'Kỳ thanh toán của bạn đến rồi! Hãy để iShinhan đồng hành cùng bạn quét sạch mọi khoản vay/ dư nợ thẻ tín dụng vừa nhanh chóng, an toàn, còn nhận được ưu đãi 20.000 VNĐ thật hời từ Zalopay.',
    content: `<p>Kỳ thanh toán của bạn đến rồi! Hãy để iShinhan đồng hành cùng bạn quét sạch mọi khoản vay/ dư nợ thẻ tín dụng vừa nhanh chóng, an toàn, còn nhận được ưu đãi 20.000 VNĐ thật hời từ Zalopay.</p>
<p>Cụ thể, từ ngày 01/02/2026 đến hết ngày 31/03/2026, Khách hàng sẽ được tặng 20.000 VNĐ khi nhập mã SVFC20K cho giao dịch thanh toán khoản vay hoặc dư nợ thẻ tín dụng có giá trị từ 1.000.000 VNĐ trên nền tảng tài chính số iShinhan.</p>
<h3>Lưu ý:</h3>
<ul>
<li>Ưu đãi chỉ được áp dụng 01 lần / khách hàng / tháng.</li>
<li>Ưu đãi không áp dụng cho phương thức thanh toán Zalopay QR Đa Năng.</li>
</ul>
<h3>Hướng dẫn các bước thanh toán:</h3>
<ul>
<li>Bước 1: Đăng nhập iShinhan, chọn "Thẻ tín dụng" HOẶC "Khoản vay" đến hạn thanh toán.</li>
<li>Bước 2: Chọn thanh toán bằng ví điện tử Zalopay và làm theo hướng dẫn.</li>
<li>Bước 3: Tại màn hình xác nhận giao dịch bấm chọn "Ưu đãi" >> Chọn ô "Nhập mã ưu đãi" >> Nhập mã ưu đãi phù hợp >> Xác nhận.</li>
<li>Bước 4: Kiểm tra số tiền cần thanh toán và bấm "Xác nhận giao dịch" để hoàn thành.</li>
</ul>
<p>Tải/ cập nhật iShinhan ngay hôm nay để trải nghiệm thanh toán mượt mà và không bỏ lỡ ưu đãi hấp dẫn từ Shinhan Bank.</p>`,
    category: 'khuyen-mai',
    date: '2026-01-28',
    image: '/images/news/thanh-toan-ishinhan.jpg',
  },
  {
    slug: 'shinhan-finance-duoc-vinh-danh-don-vi-tieu-bieu',
    title: 'Shinhan Bank được vinh danh "Đơn vị tiêu biểu trong hoạt động khai thác thông tin tín dụng năm 2025"',
    excerpt: 'Ngày 30/1/2026, Công ty Tài chính TNHH Một Thành Viên Shinhan Việt Nam (Shinhan Bank) đã vinh dự được xướng tên nhận giải thưởng "Đơn vị tiêu biểu trong hoạt động khai thác thông tin tín dụng năm 2025".',
    content: `<p>Ngày 30/1/2026, Công ty Tài chính TNHH Một Thành Viên Shinhan Việt Nam (Shinhan Bank) đã vinh dự được xướng tên nhận giải thưởng "Đơn vị tiêu biểu trong hoạt động khai thác thông tin tín dụng năm 2025". Sự kiện nằm trong khuôn khổ Hội nghị sơ kết Đề án phát triển Trung tâm Thông tin Tín dụng Quốc gia Việt Nam (CIC) giai đoạn 2022 - 2025.</p>
<p>Giải thưởng năm nay có ý nghĩa đặc biệt khi 2025 là năm bản lề, đánh dấu sự hoàn thành giai đoạn đầu của Đề án phát triển CIC và mở ra định hướng chiến lược đến năm 2030. Đáng chú ý, đây là lần thứ 3 Shinhan Bank được vinh danh tại hạng mục uy tín này.</p>
<h3>Đáp ứng chuẩn mực dữ liệu mới trong kỷ nguyên số</h3>
<p>Trong bối cảnh năm 2025 được xác định là năm ngành Ngân hàng đẩy mạnh chuyển đổi số và tinh gọn bộ máy, Shinhan Bank đã nỗ lực không ngừng để thích ứng với các quy định mới. Điểm nhấn của năm qua là việc triển khai Thông tư 15/2023/TT-NHNN, đặt ra yêu cầu cao hơn hẳn về chất lượng, tính kịp thời và độ chuẩn xác của dữ liệu báo cáo.</p>
<h3>Đồng hành xây dựng hệ sinh thái dữ liệu mở</h3>
<p>Không chỉ dừng lại ở thành tích năm 2025, giải thưởng này là động lực để Shinhan Bank tiếp tục chiến lược phát triển bền vững trong giai đoạn mới. Shinhan Bank cam kết sẽ tiếp tục ứng dụng các giải pháp công nghệ hiện đại trong phân tích và xếp hạng tín dụng.</p>`,
    category: 'su-kien',
    date: '2026-02-04',
    image: '/images/news/vinh-danh-cic.png',
  },
  {
    slug: 'thong-bao-nghi-tet-nguyen-dan-2026',
    title: 'THÔNG BÁO NGHỈ TẾT NGUYÊN ĐÁN 2026',
    excerpt: 'Công ty Tài chính TNHH MTV Shinhan Việt Nam (Shinhan Bank) trân trọng thông báo đến Quý Khách hàng lịch nghỉ Tết Nguyên đán 2026.',
    content: `<p>Công ty Tài chính TNHH MTV Shinhan Việt Nam (Shinhan Bank) trân trọng thông báo đến Quý Khách hàng lịch nghỉ Tết Nguyên đán 2026 như sau:</p>
<ul>
<li><strong>Thời gian nghỉ lễ:</strong> Từ Thứ Hai, ngày 16/02/2026 đến hết Thứ Bảy, ngày 21/2/2026.</li>
<li><strong>Thời gian hoạt động lại:</strong> Thứ Hai, ngày 23/02/2026.</li>
</ul>
<p>Shinhan Bank luôn sẵn sàng cung cấp các tiện ích để phục vụ Khách hàng tra cứu thông tin khoản vay trực tuyến và hỗ trợ 24/7 bao gồm:</p>
<ul>
<li>Nền tảng di động iShinhan phiên bản mới nhất.</li>
<li>Hệ thống cung cấp thông tin tự động 24/7 qua Tổng đài 0969 930 328.</li>
<li>SVFC Bot tại tài khoản Zalo chính thức và Shinhan Bank Facebook Fanpage.</li>
</ul>
<p>Shinhan Bank trân trọng thông báo và kính chúc Quý Khách hàng và Gia đình một năm mới An Khang, Thịnh Vượng!</p>`,
    category: 'thong-bao',
    date: '2026-01-28',
    image: '/images/news/nghi-tet-2026.png',
  },
  {
    slug: 'giao-dich-chung-khoan-tren-ishinhan',
    title: 'Giao dịch Chứng khoán trên iShinhan – Sàn Xịn Ha tặng quà ngập tràn!',
    excerpt: 'Giao dịch chứng khoán dễ dàng trên iShinhan, rinh quà chào mừng cực hấp dẫn lên đến 150.000 VNĐ. Đăng nhập nền tảng tài chính số iShinhan ngay để trải nghiệm!',
    content: `<p>Với mục tiêu không ngừng nâng cao trải nghiệm dịch vụ và gia tăng quyền lợi cho khách hàng từ hệ sinh thái Shinhan Financial Group, Shinhan Bank phối hợp cùng Chứng khoán Shinhan Việt Nam (SSV) triển khai chương trình tặng quà chào mừng đặc biệt.</p>
<p>Cụ thể, từ ngày 01/01/2026 đến hết ngày 31/12/2026, khách hàng tham gia chương trình sẽ nhận được phần thưởng trị giá đến 150.000 VNĐ khi mở tài khoản chứng khoán Shinhan Securities được liên kết trên nền tảng tài chính số iShinhan phiên bản mới nhất.</p>
<h3>Cách thức nhận ưu đãi:</h3>
<ul>
<li>Bước 01: Đăng nhập vào nền tảng tài chính số iShinhan phiên bản mới nhất.</li>
<li>Bước 02: Tại màn hình trang chủ, chọn "Chứng khoán" và làm theo hướng dẫn.</li>
<li>Bước 03: Mở tài khoản Chứng khoán Shinhan và thực hiện ít nhất 01 giao dịch mua – bán chứng khoán.</li>
</ul>
<p>Truy cập ngay nền tảng tài chính số iShinhan phiên bản mới nhất để trải nghiệm dịch vụ chứng khoán.</p>`,
    category: 'khuyen-mai',
    date: '2026-03-01',
    image: '/images/news/chung-khoan-ishinhan.jpg',
  },
  {
    slug: 'giai-phap-vay-tieu-dung-tra-gop-linh-hoat',
    title: 'Giải pháp vay tiêu dùng trả góp linh hoạt cùng Shinhan Bank',
    excerpt: 'Với hình thức vay tiêu dùng trả góp linh hoạt từ Shinhan Bank, bạn có thể dễ dàng tiếp cận nguồn tài chính mà không cần thế chấp tài sản.',
    content: `<p>Cuộc sống hiện đại ngày nay, nhu cầu tài chính ngày càng đa dạng, từ mua sắm đồ gia dụng, thiết bị điện tử đến trang trải các chi phí quan trọng. Với hình thức vay tiêu dùng trả góp linh hoạt từ Shinhan Bank, bạn có thể dễ dàng tiếp cận nguồn tài chính mà không cần thế chấp tài sản.</p>
<h2>Vì sao nên chọn giải pháp vay tiêu dùng trả góp linh hoạt?</h2>
<p>Vay tiêu dùng trả góp là hình thức thanh toán hiện đại, giúp bạn tiếp cận nguồn vốn nhanh chóng mà không cần thanh toán toàn bộ số tiền ngay từ đầu. Thay vì phải chi trả một khoản lớn trong một lần, bạn có thể chia nhỏ thành các kỳ thanh toán cố định.</p>
<h2>Hướng dẫn chọn kế hoạch vay tiêu dùng trả góp phù hợp</h2>
<ul>
<li>Xác định nhu cầu tài chính và khả năng chi trả: khoản trả góp hàng tháng không nên vượt quá 30-40% tổng thu nhập.</li>
<li>So sánh lãi suất, kỳ hạn và điều kiện vay từ các tổ chức tài chính khác nhau.</li>
<li>Lựa chọn gói vay phù hợp với kế hoạch tài chính cá nhân.</li>
</ul>
<h2>Tại sao nên chọn vay tiêu dùng trả góp tại Shinhan Bank?</h2>
<ul>
<li>Lãi suất cạnh tranh và minh bạch.</li>
<li>Hạn mức vay linh hoạt, lên đến hàng trăm triệu đồng.</li>
<li>Quy trình nhanh gọn với hệ thống xét duyệt tự động.</li>
<li>Công cụ tính toán tiện ích trực tuyến.</li>
</ul>`,
    category: 'blog',
    date: '2025-12-15',
    image: '/images/news/vay-tieu-dung.png',
  },
]
