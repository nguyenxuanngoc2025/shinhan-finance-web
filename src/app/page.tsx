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
  title: 'Shinhan Bank | Vay tín chấp & Thẻ tín dụng THE FIRST',
  description: 'Shinhan Bank – Giải pháp tài chính toàn diện: vay tín chấp nhanh không thế chấp, thẻ tín dụng THE FIRST ưu đãi 0% lãi suất, trả góp linh hoạt. Hotline: 0969 930 328.',
  keywords: 'vay tín chấp, thẻ tín dụng, Shinhan Bank, vay tiêu dùng, mở thẻ tín dụng THE FIRST, vay nhanh, lãi suất thấp',
  openGraph: {
    title: 'Shinhan Bank | Vay tín chấp & Thẻ tín dụng THE FIRST',
    description: 'Giải pháp tài chính toàn diện từ Shinhan Bank Việt Nam. Vay tín chấp nhanh, thẻ tín dụng ưu đãi vượt trội.',
    type: 'website',
    locale: 'vi_VN',
  },
}

// FinancialProduct structured data for loan products
const productsSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'Vay tín chấp cá nhân Shinhan Bank',
    description: 'Vay tín chấp không cần tài sản thế chấp, hạn mức đến 300 triệu, kỳ hạn linh hoạt đến 48 tháng.',
    provider: {
      '@type': 'FinancialService',
      name: 'Shinhan Bank Việt Nam',
    },
    interestRate: {
      '@type': 'QuantitativeValue',
      minValue: 18,
      maxValue: 49,
      unitText: 'PERCENT_PER_YEAR',
    },
    amount: {
      '@type': 'MonetaryAmount',
      currency: 'VND',
      minValue: 10000000,
      maxValue: 300000000,
    },
    url: 'https://shinhanfinance-clone.ngocnguyenxuan.com/san-pham/vay-tin-chap',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'Thẻ tín dụng THE FIRST Shinhan Bank',
    description: 'Thẻ tín dụng THE FIRST với ưu đãi rút tiền mặt 100% hạn mức, miễn lãi đến 45 ngày, hoàn tiền 0.5%.',
    provider: {
      '@type': 'FinancialService',
      name: 'Shinhan Bank Việt Nam',
    },
    url: 'https://shinhanfinance-clone.ngocnguyenxuan.com/san-pham/the-tin-dung',
  },
]

export default function HomePage() {
  return (
    <>
      {/* FinancialProduct Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />
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
