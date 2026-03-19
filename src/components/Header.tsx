'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSiteSettings } from './SiteSettingsContext'

const NAV_ITEMS = [
  {
    label: 'Sản phẩm',
    href: '/san-pham',
    children: [
      { label: 'Vay tín chấp', href: '/san-pham/vay-tin-chap', icon: 'fas fa-file-invoice-dollar', desc: 'Vay nhanh, không thế chấp' },
      { label: 'Thẻ tín dụng', href: '/san-pham/the-tin-dung', icon: 'far fa-credit-card', desc: 'THE FIRST – ưu đãi đặc quyền' },
    ],
  },
  {
    label: 'Tin tức',
    href: '/tin-tuc',
    children: [
      { label: 'Thông báo', href: '/tin-tuc?tab=thong-bao', icon: 'fas fa-bullhorn',      desc: 'Thông báo chính thức' },
      { label: 'Sự kiện',   href: '/tin-tuc?tab=su-kien',   icon: 'fas fa-calendar-alt',  desc: 'Sự kiện nổi bật' },
      { label: 'Khuyến mại',href: '/tin-tuc?tab=khuyen-mai',icon: 'fas fa-tag',            desc: 'Ưu đãi hấp dẫn' },
      { label: 'Blog',      href: '/tin-tuc?tab=blog',      icon: 'fas fa-edit',           desc: 'Kiến thức tài chính' },
    ],
  },
]

const MOBILE_LINKS = [
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Vay tín chấp', href: '/san-pham/vay-tin-chap', indent: true },
  { label: 'Thẻ tín dụng', href: '/san-pham/the-tin-dung', indent: true },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Thông báo', href: '/tin-tuc?tab=thong-bao', indent: true },
  { label: 'Sự kiện', href: '/tin-tuc?tab=su-kien', indent: true },
  { label: 'Khuyến mại', href: '/tin-tuc?tab=khuyen-mai', indent: true },
  { label: 'Blog', href: '/tin-tuc?tab=blog', indent: true },
]

export default function Header() {
  const { logo } = useSiteSettings()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMouseEnter = (label: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setActiveNav(label)
  }
  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => setActiveNav(null), 150)
  }

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="header">
        <div className="header-inner">

          {/* Logo — from CMS via SiteSettingsContext */}
          <Link href="/" className="header-logo" aria-label="Shinhan Finance">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="Shinhan Finance"
              className="header-logo-img"
              style={{width:160,height:'auto',maxHeight:44}}
            />
          </Link>

          {/* Cụm phải: Nav + Actions */}
          <div className="header-right">
            {/* Desktop nav */}
            <nav className="header-nav" aria-label="Menu chính">
              {NAV_ITEMS.map(item => (
                <div
                  key={item.label}
                  className={`nav-item${activeNav === item.label ? ' open' : ''}`}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link href={item.href} className="nav-link">
                    {item.label}
                    <i className="fas fa-chevron-down nav-chevron"></i>
                  </Link>
                  <div className="nav-dropdown" onMouseEnter={() => handleMouseEnter(item.label)} onMouseLeave={handleMouseLeave}>
                    <div className="nav-dropdown-inner">
                      {item.children.map(child => (
                        <Link key={child.label} href={child.href} className="nav-dropdown-item">
                          <div className="nav-dropdown-icon">
                            <i className={child.icon}></i>
                          </div>
                          <div>
                            <div className="nav-dropdown-label">{child.label}</div>
                            <div className="nav-dropdown-desc">{child.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="header-actions">
              <Link href="/dang-ky-vay" className="btn-header-cta btn-header-primary">
                Đăng ký vay
              </Link>
              <Link href="/san-pham/the-tin-dung" className="btn-header-cta btn-header-outline">
                Mở thẻ
              </Link>
              <span className="header-hotline-sep" aria-hidden="true"></span>
              <a href="tel:0969930328" className="btn-hotline" aria-label="Gọi hotline">
                <span className="btn-hotline-icon-wrap">
                  <i className="fas fa-phone-alt"></i>
                </span>
                <span>0969 930 328</span>
              </a>
              <button
                className="btn-hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Mở menu"
              >
                <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-nav-drawer" id="mobileNav">
          {MOBILE_LINKS.map(l => (
            <Link
              key={l.label + l.href}
              href={l.href}
              className={l.indent ? 'mobile-nav-sub' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
              {!l.indent && <i className="fas fa-chevron-right"></i>}
            </Link>
          ))}
          <a href="tel:0969930328" className="btn-hotline-mobile" onClick={() => setMenuOpen(false)}>
            <i className="fas fa-phone-alt"></i> Hotline: 0969 930 328
          </a>
          <div className="mobile-cta-group">
            <Link href="/dang-ky-vay" className="btn-register-mobile" onClick={() => setMenuOpen(false)}>
              Đăng ký vay
            </Link>
            <Link href="/san-pham/the-tin-dung" className="btn-card-mobile" onClick={() => setMenuOpen(false)}>
              Mở thẻ
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
