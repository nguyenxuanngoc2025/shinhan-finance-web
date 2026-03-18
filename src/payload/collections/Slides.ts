import type { CollectionConfig } from 'payload'

export const Slides: CollectionConfig = {
  slug: 'slides',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'isActive'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Tiêu đề chính' },
    { name: 'subtitle', type: 'text', label: 'Tiêu đề phụ' },
    { name: 'ctaText', type: 'text', label: 'Nút CTA (VD: Đăng ký vay ngay)' },
    { name: 'ctaLink', type: 'text', label: 'Link CTA' },
    { name: 'backgroundGradient', type: 'text', label: 'CSS Gradient nền' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Hình ảnh' },
    { name: 'order', type: 'number', defaultValue: 0, label: 'Thứ tự hiển thị' },
    { name: 'isActive', type: 'checkbox', defaultValue: true, label: 'Hiển thị?' },
  ],
}
