import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'isActive'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Tên sản phẩm' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug (VD: vay-tin-chap)' },
    {
      name: 'type', type: 'select', required: true, label: 'Loại sản phẩm',
      options: [
        { label: 'Vay tín chấp', value: 'loan' },
        { label: 'Thẻ tín dụng', value: 'credit-card' },
        { label: 'Vay trả góp', value: 'installment' },
      ],
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hình ảnh hero' },
    { name: 'interestRate', type: 'text', label: 'Lãi suất (VD: từ 18%/năm)' },
    { name: 'maxAmount', type: 'text', label: 'Hạn mức tối đa (VD: đến 300 triệu)' },
    { name: 'maxTerm', type: 'text', label: 'Thời hạn tối đa (VD: đến 48 tháng)' },
    { name: 'shortDescription', type: 'textarea', label: 'Mô tả ngắn' },
    { name: 'features', type: 'richText', label: 'Đặc điểm sản phẩm' },
    { name: 'conditions', type: 'richText', label: 'Điều kiện & Thủ tục' },
    {
      name: 'faq', type: 'array', label: 'Câu hỏi thường gặp (FAQ)',
      fields: [
        { name: 'question', type: 'text', required: true, label: 'Câu hỏi' },
        { name: 'answer', type: 'textarea', required: true, label: 'Trả lời' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true, label: 'Hiển thị?' },
  ],
}
