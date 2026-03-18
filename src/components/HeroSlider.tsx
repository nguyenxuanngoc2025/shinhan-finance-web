'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

/**
 * Fallback slides — used when Supabase data unavailable
 */
const FALLBACK_SLIDES = [
  {
    id: 'f1',
    image: '/images/banners/banner-1.png',
    bgPos: 'center center',
    overlay: 'linear-gradient(270deg, rgba(29,30,24,0) 0%, rgba(29,30,24,0.60) 100%)',
    tag: null,
    title: 'Chào Cuộc Sống Chất Lượng',
    description: 'Phát triển tương lai thịnh vượng và hiện thực hóa nhiều ước mơ của khách hàng',
    cta_text: 'Đăng ký vay ngay',
    cta_link: '/dang-ky-vay',
  },
  {
    id: 'f2',
    image: '/images/banners/banner-2.jpg',
    bgPos: 'center 30%',
    overlay: 'linear-gradient(270deg, rgba(29,30,24,0) 0%, rgba(29,30,24,0.55) 100%)',
    tag: null,
    title: 'Vì Tương Lai Tươi Đẹp Của Bạn',
    description: 'Hỗ trợ tài chính tiêu dùng, phục vụ đời sống, chăm sóc chất lượng sống hoặc mua xe ô tô',
    cta_text: 'Đăng ký vay ngay',
    cta_link: '/dang-ky-vay',
  },
  {
    id: 'f3',
    image: '/images/banners/banner-3.png',
    bgPos: 'center center',
    overlay: 'linear-gradient(270deg, rgba(29,30,24,0) 0%, rgba(29,30,24,0.62) 100%)',
    tag: 'Khách hàng #500,999',
    title: 'Lý Do Bạn Vay?',
    description: 'Thay vì mơ ước, tôi biến ước mơ thành hiện thực',
    cta_text: 'Đăng ký vay nhanh online',
    cta_link: '/dang-ky-vay',
  },
  {
    id: 'f4',
    image: '/images/banners/banner-4.jpg',
    bgPos: 'center center',
    overlay: 'linear-gradient(270deg, rgba(29,30,24,0) 0%, rgba(29,30,24,0.58) 100%)',
    tag: 'Thẻ Tín Dụng THE FIRST',
    title: 'Giải Pháp Tài Chính Hoàn Hảo',
    description: 'Hoàn tiền đến 5% khi mua sắm. Miễn phí thường niên năm đầu. Hạn mức đến 200 triệu.',
    cta_text: 'Mở thẻ ngay',
    cta_link: '/dang-ky-vay',
  },
]

// Overlay gradients per slide position
const OVERLAY_MAP: Record<number, string> = {
  0: 'linear-gradient(270deg, rgba(29,30,24,0) 0%, rgba(29,30,24,0.60) 100%)',
  1: 'linear-gradient(270deg, rgba(29,30,24,0) 0%, rgba(29,30,24,0.55) 100%)',
  2: 'linear-gradient(270deg, rgba(29,30,24,0) 0%, rgba(29,30,24,0.62) 100%)',
  3: 'linear-gradient(270deg, rgba(29,30,24,0) 0%, rgba(29,30,24,0.58) 100%)',
}

type SlideItem = {
  id: string
  image: string
  bgPos?: string
  overlay?: string
  tag?: string | null
  title: string
  description: string
  cta_text: string
  cta_link: string
}

interface HeroSliderProps {
  slides?: SlideItem[]
}

export default function HeroSlider({ slides: propSlides }: HeroSliderProps) {
  const [slideData, setSlideData] = useState<SlideItem[]>(propSlides || FALLBACK_SLIDES)
  const [cur, setCur] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch from API if no props
  useEffect(() => {
    if (propSlides && propSlides.length > 0) return
    fetch('/api/cms/sliders')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          setSlideData(res.data)
        }
      })
      .catch(() => { /* keep fallback */ })
  }, [propSlides])

  const next = useCallback(() => setCur(c => (c + 1) % slideData.length), [slideData.length])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 5500)
  }, [next])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  const go = (i: number) => { setCur(i); resetTimer() }

  return (
    <section className="hero-slider" id="heroSlider">
      <div className="slider-wrapper">
        {slideData.map((slide, i) => (
          <div key={slide.id} className={`slide${cur === i ? ' active' : ''}`}>
            <div
              className="slide-bg"
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: slide.bgPos || 'center center',
              }}
            />
            <div className="slide-overlay" style={{ background: slide.overlay || OVERLAY_MAP[i] || OVERLAY_MAP[0] }} />

            <div className="slide-content">
              <div className="slide-text">
                {slide.tag && <p className="slide-tag">{slide.tag}</p>}
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-sub">{slide.description}</p>
                <Link href={slide.cta_link} className="btn-slide">{slide.cta_text}</Link>
              </div>
            </div>
          </div>
        ))}

        <div className="slider-dashes">
          {slideData.map((_, i) => (
            <button
              key={i}
              className={`dash${cur === i ? ' active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
