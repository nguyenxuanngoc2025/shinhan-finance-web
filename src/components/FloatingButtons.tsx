'use client'
import { useState, useEffect } from 'react'

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Floating Zalo (desktop) */}
      <a
        href="https://zalo.me/0969930328"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-zalo"
        aria-label="Chat Zalo"
      >
        <span className="zalo-pulse"></span>
        <span className="zalo-pulse zalo-pulse-2"></span>
        <span className="zalo-icon">
          <img src="/images/zalo-logo.png" alt="Zalo" width="32" height="32" style={{ borderRadius: '50%' }} />
        </span>
      </a>

      {/* Scroll to Top */}
      <button
        className={`scroll-top${showTop ? ' visible' : ''}`}
        id="scrollTop"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Lên đầu trang"
      >
        <i className="fas fa-chevron-up"></i>
      </button>

      {/* ===== Mobile Sticky Bottom CTA ===== */}
      <div className="mobile-sticky-bar" aria-label="Liên hệ nhanh">
        {/* Hotline */}
        <a
          href="tel:0969930328"
          className="mobile-sticky-btn mobile-sticky-hotline"
          aria-label="Gọi hotline"
        >
          <span className="mobile-sticky-icon">
            <i className="fas fa-phone-alt"></i>
          </span>
          <span className="mobile-sticky-label">
            <span className="mobile-sticky-sub">Hotline</span>
            <span className="mobile-sticky-main">0969 930 328</span>
          </span>
        </a>

        {/* Divider */}
        <div className="mobile-sticky-divider" aria-hidden="true"></div>

        {/* Zalo */}
        <a
          href="https://zalo.me/0969930328"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-sticky-btn mobile-sticky-zalo"
          aria-label="Chat Zalo"
        >
          <span className="mobile-sticky-icon">
            <img src="/images/zalo-logo.png" alt="Zalo" width="22" height="22" style={{ borderRadius: '50%' }} />
          </span>
          <span className="mobile-sticky-label">
            <span className="mobile-sticky-sub">Nhắn tin</span>
            <span className="mobile-sticky-main">Zalo</span>
          </span>
        </a>
      </div>
    </>
  )
}
