import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vay tín chấp cá nhân – Lãi suất từ 18%/năm',
  description: 'Vay tín chấp cá nhân Shinhan Finance: hạn mức đến 300 triệu, lãi suất từ 18%/năm, kỳ hạn đến 48 tháng, không cần thế chấp. Giải ngân trong 48 giờ. Hotline: 0969 930 328.',
  keywords: 'vay tín chấp, vay không thế chấp, Shinhan Finance, vay nhanh, lãi suất thấp, vay cá nhân',
  openGraph: {
    title: 'Vay tín chấp cá nhân – Shinhan Finance',
    description: 'Hạn mức đến 300 triệu, lãi suất từ 18%/năm, kỳ hạn linh hoạt đến 48 tháng.',
    type: 'website',
    locale: 'vi_VN',
  },
  alternates: {
    canonical: 'https://shinhanfinance-clone.ngocnguyenxuan.com/san-pham/vay-tin-chap',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Làm thế nào để đăng ký khoản vay tín chấp với Shinhan Finance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quý khách có thể đăng ký trực tuyến trên website, qua ứng dụng iShinhan, hoặc đến trực tiếp các điểm giao dịch của Shinhan Finance trên toàn quốc.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cách tính tiền lãi vay tín chấp của Shinhan Finance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lãi suất được tính trên dư nợ giảm dần, từ 18%/năm đến tối đa 49%/năm tùy hồ sơ thẩm định.',
      },
    },
    {
      '@type': 'Question',
      name: 'Điều kiện vay tín chấp tại Shinhan Finance là gì?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Khách hàng đi làm hưởng lương, độ tuổi Nữ 21-55/Nam 21-58, thu nhập tối thiểu 6 triệu đồng/tháng, quốc tịch Việt Nam.',
      },
    },
    {
      '@type': 'Question',
      name: 'Thời gian giải ngân khoản vay tín chấp mất bao lâu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Giải ngân trong vòng 48 giờ sau khi đăng ký hồ sơ đầy đủ và được duyệt.',
      },
    },
  ],
}

export default function VayTinChapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
