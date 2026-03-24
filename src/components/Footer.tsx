'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useSiteSettings } from './SiteSettingsContext'

export default function Footer() {
  const { footer_logo } = useSiteSettings()

  return (
    <footer className="footer" id="footer">
      {/* Hình mờ góc trên trái */}
      <Image
        src="/images/footer-logo-top-left.svg"
        alt=""
        className="footer-watermark"
        aria-hidden="true"
        width={320}
        height={320}
        unoptimized
      />
      <div className="container">

        {/* ===== 4-column grid (desktop) ===== */}
        <div className="footer-grid">

          {/* Col 1 */}
          <div className="footer-col">
            <ul>
              <li><a href="https://career.shinhanfinance.com.vn/?locale=vi_VN" target="_blank" rel="noopener noreferrer">Nghề nghiệp</a></li>
              <li><Link href="/quy-tac-ung-xu">Quy tắc ứng xử &amp; đạo đức</Link></li>
              <li><Link href="/mien-tru-trach-nhiem">Miễn trừ trách nhiệm</Link></li>
              <li><Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link href="/trach-nhiem-xa-hoi">Trách nhiệm Xã hội</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="footer-col">
            <ul>
              <li><Link href="/san-pham/vay-tin-chap">Vay tín chấp</Link></li>
              <li><Link href="/san-pham/vay-tra-gop">Vay tiêu dùng trả góp</Link></li>
              <li><Link href="/san-pham/vay-tin-chap">Vay mua xe máy trả góp</Link></li>
              <li><Link href="/san-pham/the-tin-dung">Thẻ tín dụng</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="footer-col">
            <ul>
              <li><Link href="/tin-tuc?tab=khuyen-mai">Khuyến mại</Link></li>
              <li><Link href="/huong-dan-thanh-toan">Hướng dẫn thanh toán</Link></li>
              <li><Link href="/hoi-dap">Câu hỏi thường gặp</Link></li>
              <li><Link href="/so-do-trang">Sơ đồ trang</Link></li>
              <li><Link href="/tin-tuc">Tin tức</Link></li>
            </ul>
          </div>

          {/* Col 4 - Contact */}
          <div className="footer-col footer-contact-col">
            <p className="footer-contact-label">Liên hệ</p>
            <p>
              <strong>Chi nhánh Shinhan Bank:</strong> Tòa nhà Pico Plaza,
              20 Cộng Hòa, Phường Bảy Hiền, (Quận Tân Bình) TP.HCM
            </p>
            <p>
              <strong>Hotline / Zalo:</strong>{' '}
              <a href="tel:0969930328">0969 930 328</a>
              {' '}|{' '}
              <a href="https://zalo.me/0969930328" target="_blank" rel="noopener noreferrer">Chat Zalo</a>
            </p>
            <p><strong>Email:</strong> <a href="mailto:dvkh@shinhanfinance.com.vn">dvkh@shinhanfinance.com.vn</a></p>

            {/* Social Icons */}
            <div className="footer-social">
              <a href="https://www.youtube.com/@ShinhanFinanceVietnam" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon">
                <Image src="/images/social/ic-youtube.svg" alt="YouTube" width={36} height={36} unoptimized />
              </a>
              <a href="https://zalo.me/0969930328" target="_blank" rel="noopener noreferrer" aria-label="Zalo" className="social-icon social-icon--zalo">
                <Image src="/images/social/ic-zalo.svg" alt="Zalo" width={36} height={36} unoptimized />
              </a>
              <a href="https://www.instagram.com/shinhanfinancevietnam" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                <Image src="/images/social/ic-instagram.svg" alt="Instagram" width={36} height={36} unoptimized />
              </a>
              <a href="https://www.linkedin.com/company/shinhan-finance" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
                <Image src="/images/social/ic-linkedin.svg" alt="LinkedIn" width={36} height={36} unoptimized />
              </a>
              <a href="https://www.facebook.com/ShinhanFinanceVietnam" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
                <Image src="/images/social/ic-facebook.svg" alt="Facebook" width={36} height={36} unoptimized />
              </a>
            </div>

            {/* App Buttons */}
            <div className="footer-apps">
              <a href="#" className="app-img-btn">
                <Image src="/images/app/app-store.png" alt="Tải về trên App Store" width={135} height={40} />
              </a>
              <a href="#" className="app-img-btn">
                <Image src="/images/app/google-play.png" alt="Tải về trên Google Play" width={135} height={40} />
              </a>
            </div>
          </div>

        </div>{/* end grid */}

      </div>

      {/* ===== Footer Bottom ===== */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            {/* Logo — from CMS via SiteSettingsContext */}
            <div className="footer-logo-wrap">
              <Link href="/" aria-label="Shinhan Bank - Trang chủ">
                {footer_logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={footer_logo}
                    alt="Shinhan Bank"
                    style={{height: 22, width: 'auto'}}
                  />
                ) : null}
              </Link>
            </div>
            {/* Copyright */}
            <div className="footer-copyright">
              <p>Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam</p>
              <p>Thành viên của Shinhan Card | Shinhan Financial Group (Hàn Quốc)</p>
              <p>Mọi quyền được bảo hộ | GPKD. 0304946247</p>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
