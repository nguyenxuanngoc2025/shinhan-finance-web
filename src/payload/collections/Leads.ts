import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'phone', 'product', 'status', 'createdAt'],
    description: 'Danh sách khách hàng đăng ký vay',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Only trigger on create
        if (operation !== 'create') return doc

        // Trigger n8n webhook to send Telegram/Email notification
        const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL
        if (!webhookUrl) return doc

        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: doc.fullName,
              phone: doc.phone,
              product: doc.product,
              loanAmount: doc.loanAmount,
              income: doc.income,
              term: doc.term,
              province: doc.province,
              email: doc.email,
              createdAt: new Date().toISOString(),
            }),
          })
        } catch (err) {
          console.error('Failed to notify n8n:', err)
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'product', type: 'select', required: true, label: 'Sản phẩm đăng ký',
      options: [
        { label: 'Vay tín chấp cá nhân', value: 'vay-tin-chap' },
        { label: 'Vay trả góp mua laptop/điện thoại', value: 'vay-tra-gop' },
        { label: 'Thẻ tín dụng THE FIRST', value: 'the-tin-dung' },
      ],
    },
    { name: 'income', type: 'number', label: 'Thu nhập hàng tháng (triệu VNĐ)' },
    { name: 'loanAmount', type: 'number', label: 'Khoản vay dự kiến (triệu VNĐ)' },
    { name: 'term', type: 'number', label: 'Thời hạn vay (tháng)' },
    { name: 'fullName', type: 'text', required: true, label: 'Họ và tên' },
    { name: 'dob', type: 'date', label: 'Ngày sinh' },
    { name: 'cccd', type: 'text', label: 'Số CCCD' },
    { name: 'phone', type: 'text', required: true, label: 'Số điện thoại' },
    { name: 'province', type: 'text', label: 'Tỉnh/Thành phố' },
    { name: 'email', type: 'email', label: 'Email' },
    {
      name: 'status', type: 'select', defaultValue: 'new', label: 'Trạng thái',
      options: [
        { label: '🆕 Mới', value: 'new' },
        { label: '📞 Đã liên hệ', value: 'contacted' },
        { label: '✅ Đã duyệt', value: 'approved' },
        { label: '❌ Từ chối', value: 'rejected' },
      ],
    },
    { name: 'notes', type: 'textarea', label: 'Ghi chú nội bộ' },
  ],
}
