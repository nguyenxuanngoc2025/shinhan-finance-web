import type { Metadata } from 'next'
import './globals.css'
import TrackingScripts from '@/components/TrackingScripts'

export const metadata: Metadata = {
  metadataBase: new URL('https://shinhanfinance.com.vn'),
  title: 'Shinhan Finance | Công ty tài chính đến từ Hàn Quốc',
  description: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam, thành viên của Shinhan Card (Hàn Quốc), sản phẩm vay tín chấp, vay tiêu dùng, vay mua ô tô',
  openGraph: {
    siteName: 'Shinhan Finance Việt Nam',
    locale: 'vi_VN',
    type: 'website',
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23007BC3'/%3E%3Ctext x='16' y='22' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3ES%3C/text%3E%3C/svg%3E",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <TrackingScripts />
      </head>
      <body>{children}</body>
    </html>
  )
}

