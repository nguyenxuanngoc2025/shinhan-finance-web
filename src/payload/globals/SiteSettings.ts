import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '⚙️ Cài đặt chung',
  admin: {
    group: '🎨 Giao diện',
  },
  fields: [
    // ===== THÔNG TIN THƯƠNG HIỆU =====
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thương hiệu',
          fields: [
            { name: 'siteName', type: 'text', required: true, label: 'Tên website', defaultValue: 'Shinhan Bank' },
            { name: 'siteTagline', type: 'text', label: 'Slogan', defaultValue: 'Đồng hành tài chính cùng bạn' },
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo chính (header)' },
            { name: 'logoWhite', type: 'upload', relationTo: 'media', label: 'Logo trắng (footer)' },
            { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon' },
          ],
        },
        {
          label: 'Liên hệ',
          fields: [
            { name: 'hotline', type: 'text', label: 'Số hotline', defaultValue: '0969 930 328' },
            { name: 'hotlineDisplay', type: 'text', label: 'Hiển thị hotline (VD: 0969 930 328)', defaultValue: '0969 930 328' },
            { name: 'zaloLink', type: 'text', label: 'Link Zalo', defaultValue: 'https://zalo.me/0969930328' },
            { name: 'email', type: 'email', label: 'Email hỗ trợ', defaultValue: 'dvkh@shinhanfinance.com.vn' },
            {
              name: 'address', type: 'textarea', label: 'Địa chỉ',
              defaultValue: 'Tòa nhà Pico Plaza, 20 Cộng Hòa, Phường Bảy Hiền, (Quận Tân Bình) TP.HCM',
            },
            { name: 'companyFullName', type: 'text', label: 'Tên công ty đầy đủ', defaultValue: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam' },
            { name: 'businessLicense', type: 'text', label: 'Số GPKD', defaultValue: '0304946247' },
          ],
        },
        {
          label: 'Mạng xã hội',
          fields: [
            { name: 'facebookUrl', type: 'text', label: 'Facebook', defaultValue: 'https://www.facebook.com/ShinhanFinanceVietnam' },
            { name: 'youtubeUrl', type: 'text', label: 'YouTube', defaultValue: 'https://www.youtube.com/@ShinhanFinanceVietnam' },
            { name: 'instagramUrl', type: 'text', label: 'Instagram', defaultValue: 'https://www.instagram.com/shinhanfinancevietnam' },
            { name: 'linkedinUrl', type: 'text', label: 'LinkedIn', defaultValue: 'https://www.linkedin.com/company/shinhan-finance' },
            { name: 'tiktokUrl', type: 'text', label: 'TikTok' },
          ],
        },
        {
          label: 'SEO mặc định',
          fields: [
            { name: 'metaTitle', type: 'text', label: 'Meta Title mặc định', defaultValue: 'Shinhan Bank | Vay tín chấp & Thẻ tín dụng' },
            { name: 'metaDescription', type: 'textarea', label: 'Meta Description mặc định', defaultValue: 'Shinhan Bank - Công ty tài chính hàng đầu Việt Nam. Vay tín chấp, thẻ tín dụng THE FIRST, lãi suất cạnh tranh.' },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image (ảnh share mạng xã hội)' },
            { name: 'googleAnalyticsId', type: 'text', label: 'Google Analytics ID' },
          ],
        },
      ],
    },
  ],
}
