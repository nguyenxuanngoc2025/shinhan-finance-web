'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'

const TESTIMONIALS = [
  {
    text: 'Khi trải nghiệm các dịch vụ tại Shinhan Bank, tôi bất ngờ và thật sự hài lòng vì sự tận tâm trong quá trình phục vụ khách hàng của nhân viên tại đây.',
    name: 'Nguyễn Thị Thùy An',
    title: 'Nhân viên văn phòng',
    avatar: 'https://i.pravatar.cc/80?img=1',
  },
  {
    text: 'Lãi suất vay tại Shinhan Bank rất hấp dẫn nên tôi lựa chọn sản phẩm vay tại đây để giải quyết các nhu cầu chi tiêu cá nhân.',
    name: 'Lê Thị Ngọc Huệ',
    title: 'Marketing Thẩm mỹ',
    avatar: 'https://i.pravatar.cc/80?img=5',
  },
  {
    text: 'Chúng tôi tin rằng việc MoMo cùng Shinhan Bank luôn đồng hành và hợp tác lâu dài sẽ mang đến những giá trị thiết thực dành cho khách hàng.',
    name: 'Mr. Bùi Nhất Sang',
    title: 'Đại diện đối tác MoMo',
    avatar: 'https://i.pravatar.cc/80?img=11',
  },
  {
    text: 'Tôi chọn Shinhan Bank vì uy tín công ty trên thị trường, đặc biệt an tâm khi thông tin cá nhân luôn được bảo mật.',
    name: 'Lê Võ Thanh Hà',
    title: 'Nhân viên văn phòng',
    avatar: 'https://i.pravatar.cc/80?img=9',
  },
  {
    text: 'VNPAY tự hào khi được đồng hành và sát cánh cùng Shinhan Bank trong suốt thời gian qua và cả hành trình hợp tác sắp tới.',
    name: 'Ms. Võ Thị Cẩm Nhung',
    title: 'Đại diện đối tác VNPAY',
    avatar: 'https://i.pravatar.cc/80?img=16',
  },
]

export default function TestimonialsSection() {
  const [cur, setCur] = useState(0)
  const visible = 3

  const prev = useCallback(() => setCur(c => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCur(c => Math.min(TESTIMONIALS.length - visible, c + 1)), [])

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <h2 className="section-title white">Đồng hành và trải nghiệm cùng Shinhan Bank</h2>
        <div className="testimonials-carousel" id="testimonialsCarousel">
          <div
            className="testimonials-track"
            style={{ transform: `translateX(calc(-${cur * (100 / visible)}% - ${cur * 16}px))` }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="quote-icon">&ldquo;</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <Image src={t.avatar} alt={t.name} width={48} height={48} unoptimized />
                  </div>
                  <div className="author-info">
                    <strong>{t.name}</strong>
                    <span>{t.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-controls">
          <button className="carousel-prev" onClick={prev} disabled={cur === 0}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-next" onClick={next} disabled={cur >= TESTIMONIALS.length - visible}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  )
}
