import type { Metadata } from 'next'
import './globals.css'
import TrackingScripts from '@/components/TrackingScripts'

const SITE_URL = 'https://shinhanfinance-clone.ngocnguyenxuan.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Shinhan Finance | Vay tín chấp & Thẻ tín dụng THE FIRST',
    template: '%s | Shinhan Finance',
  },
  description: 'Shinhan Finance – Giải pháp tài chính toàn diện: vay tín chấp nhanh không thế chấp, thẻ tín dụng THE FIRST ưu đãi 0% lãi suất, trả góp linh hoạt. Hotline: 0969 930 328.',
  keywords: 'vay tín chấp, thẻ tín dụng, Shinhan Finance, vay tiêu dùng, mở thẻ tín dụng THE FIRST, vay nhanh, lãi suất thấp, vay trả góp, vay không thế chấp',
  openGraph: {
    siteName: 'Shinhan Finance Việt Nam',
    locale: 'vi_VN',
    type: 'website',
    title: 'Shinhan Finance | Vay tín chấp & Thẻ tín dụng THE FIRST',
    description: 'Giải pháp tài chính toàn diện từ Shinhan Finance Việt Nam. Vay tín chấp nhanh, thẻ tín dụng ưu đãi vượt trội.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shinhan Finance | Vay tín chấp & Thẻ tín dụng THE FIRST',
    description: 'Giải pháp tài chính toàn diện từ Shinhan Finance Việt Nam.',
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23007BC3'/%3E%3Ctext x='16' y='22' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3ES%3C/text%3E%3C/svg%3E",
  },
}

// Schema.org structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Shinhan Finance Việt Nam',
  alternateName: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo/SVFC_LOGO.png`,
  description: 'Shinhan Finance – Giải pháp tài chính toàn diện: vay tín chấp, thẻ tín dụng, vay trả góp.',
  telephone: '+84969930328',
  email: 'cskh@shinhanfinance.com.vn',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Tòa nhà Pico Plaza, 20 Cộng Hòa, Phường Bảy Hiền',
    addressLocality: 'Quận Tân Bình',
    addressRegion: 'TP. Hồ Chí Minh',
    addressCountry: 'VN',
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'Shinhan Financial Group',
    url: 'https://www.shinhangroup.com',
  },
  sameAs: [
    'https://www.facebook.com/ShinhanFinanceVietnam',
    'https://www.youtube.com/@ShinhanFinanceVietnam',
    'https://www.instagram.com/shinhanfinancevietnam',
    'https://www.linkedin.com/company/shinhan-finance',
  ],
}

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Shinhan Finance',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/tin-tuc?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        {/* DNS Prefetch & Preconnect for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <TrackingScripts />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Bỏ qua đến nội dung chính</a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  )
}
