import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSlider from '@/components/HeroSlider'
import ValueBar from '@/components/ValueBar'
import ProductsSection from '@/components/ProductsSection'
import AwardsSection from '@/components/AwardsSection'
import PartnersSection from '@/components/PartnersSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import NewsSection from '@/components/NewsSection'
// import PopupModal from '@/components/PopupModal' // TODO: bật lại sau
import FloatingButtons from '@/components/FloatingButtons'

export const metadata: Metadata = {
  title: 'Shinhan Finance | Vay tín chấp & Thẻ tín dụng THE FIRST',
  description: 'Shinhan Finance – Giải pháp tài chính toàn diện: vay tín chấp nhanh không thế chấp, thẻ tín dụng THE FIRST ưu đãi 0% lãi suất, trả góp linh hoạt. Hotline: 0969 930 328.',
  keywords: 'vay tín chấp, thẻ tín dụng, Shinhan Finance, vay tiêu dùng, mở thẻ tín dụng THE FIRST, vay nhanh, lãi suất thấp',
  openGraph: {
    title: 'Shinhan Finance | Vay tín chấp & Thẻ tín dụng THE FIRST',
    description: 'Giải pháp tài chính toàn diện từ Shinhan Finance Việt Nam. Vay tín chấp nhanh, thẻ tín dụng ưu đãi vượt trội.',
    type: 'website',
    locale: 'vi_VN',
  },
}

export default function HomePage() {
  return (
    <>
      {/* <PopupModal /> */}{/* TODO: bật lại sau khi bổ sung nội dung chuyển đổi */}
      <Header />
      <main>
        <HeroSlider />
        <ValueBar />
        <ProductsSection />
        <AwardsSection />
        <PartnersSection />
        <TestimonialsSection />
        {/* Section tin tức SEO — bên dưới "Đồng hành & trải nghiệm" */}
        <NewsSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
