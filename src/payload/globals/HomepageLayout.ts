import type { GlobalConfig } from 'payload'

export const HomepageLayout: GlobalConfig = {
  slug: 'homepage-layout',
  label: '🏠 Bố cục Trang chủ',
  admin: {
    group: '🎨 Giao diện',
  },
  fields: [
    {
      name: 'sections', type: 'array', label: 'Các phần trên trang chủ',
      admin: {
        description: 'Kéo thả để thay đổi thứ tự hiển thị. Bỏ tick để ẩn phần đó.',
      },
      defaultValue: [
        { sectionType: 'hero-slider', isVisible: true, title: 'Banner Slider' },
        { sectionType: 'value-bar', isVisible: true, title: 'Thanh giá trị' },
        { sectionType: 'products', isVisible: true, title: 'Sản phẩm tài chính' },
        { sectionType: 'news', isVisible: true, title: 'Bản tin & Ưu đãi' },
        { sectionType: 'awards', isVisible: true, title: 'Giải thưởng' },
        { sectionType: 'partners', isVisible: true, title: 'Đối tác' },
        { sectionType: 'testimonials', isVisible: true, title: 'Đánh giá khách hàng' },
      ],
      fields: [
        {
          name: 'sectionType', type: 'select', required: true, label: 'Loại section',
          options: [
            { label: '🖼️ Banner Slider', value: 'hero-slider' },
            { label: '💎 Thanh giá trị', value: 'value-bar' },
            { label: '📦 Sản phẩm tài chính', value: 'products' },
            { label: '📰 Bản tin & Ưu đãi', value: 'news' },
            { label: '🏆 Giải thưởng', value: 'awards' },
            { label: '🤝 Đối tác', value: 'partners' },
            { label: '⭐ Đánh giá khách hàng', value: 'testimonials' },
            { label: '🧮 Công cụ tính khoản vay', value: 'loan-calculator' },
          ],
        },
        { name: 'title', type: 'text', label: 'Tên hiển thị (admin)' },
        { name: 'isVisible', type: 'checkbox', label: 'Hiển thị?', defaultValue: true },
        { name: 'customTitle', type: 'text', label: 'Tiêu đề tuỳ chỉnh (để trống = mặc định)' },
      ],
    },
    {
      type: 'group',
      name: 'floatingButtons',
      label: 'Nút nổi (Hotline + Zalo)',
      fields: [
        { name: 'showFloating', type: 'checkbox', label: 'Hiện nút nổi', defaultValue: true },
        { name: 'showScrollTop', type: 'checkbox', label: 'Hiện nút scroll to top', defaultValue: true },
      ],
    },
  ],
}
