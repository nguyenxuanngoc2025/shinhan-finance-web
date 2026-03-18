'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PopupModal() {
  const [open, setOpen] = useState(false)
  const [rate, setRate] = useState(18)

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 2500)
    fetch('/api/cms/settings?key=loan_products.vay_tin_chap')
      .then(r => r.json())
      .then(res => { if (res.data?.min_rate) setRate(res.data.min_rate) })
      .catch(() => {})
    return () => clearTimeout(timer)
  }, [])

  if (!open) return null

  return (
    <div className={`popup-overlay${open ? ' active' : ''}`} id="popupOverlay">
      <div className="popup-modal">
        <button className="popup-close" onClick={() => setOpen(false)}>
          <i className="fas fa-times"></i>
        </button>
        <div className="popup-content">
          <div className="popup-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=350&fit=crop"
              alt="Ưu đãi Shinhan Finance"
            />
          </div>
          <div className="popup-info">
            <h3>Ưu đãi đặc biệt!</h3>
            <p>Đăng ký vay tín chấp ngay hôm nay để nhận lãi suất ưu đãi từ <strong>{rate}%/năm</strong></p>
            <Link href="/dang-ky-vay" className="popup-btn" onClick={() => setOpen(false)}>
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

