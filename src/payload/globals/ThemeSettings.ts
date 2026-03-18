import type { GlobalConfig } from 'payload'

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: '🎨 Màu sắc & Font',
  admin: {
    group: '🎨 Giao diện',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Màu sắc',
          description: 'Thay đổi bảng màu toàn website. Chỉ cần đổi màu chính, toàn bộ website sẽ tự cập nhật.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'primaryColor', type: 'text', label: 'Màu chính (Primary)', defaultValue: '#0078D4', admin: { description: 'Màu nút, link, tiêu đề. VD: #0078D4' } },
                { name: 'primaryLight', type: 'text', label: 'Màu chính nhạt', defaultValue: '#E8F2FC', admin: { description: 'Nền nhạt cho sections. VD: #E8F2FC' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'secondaryColor', type: 'text', label: 'Màu phụ (Secondary)', defaultValue: '#FF6B35', admin: { description: 'Màu nhấn, badge CTA. VD: #FF6B35' } },
                { name: 'accentColor', type: 'text', label: 'Màu accent', defaultValue: '#00B894', admin: { description: 'Màu success, check icon. VD: #00B894' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'headerBg', type: 'text', label: 'Nền Header', defaultValue: '#FFFFFF' },
                { name: 'footerBg', type: 'text', label: 'Nền Footer', defaultValue: '#0078D4' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'bodyBg', type: 'text', label: 'Nền trang', defaultValue: '#F5F7FA' },
                { name: 'cardBg', type: 'text', label: 'Nền card', defaultValue: '#FFFFFF' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'textPrimary', type: 'text', label: 'Màu chữ chính', defaultValue: '#1A1A2E' },
                { name: 'textSecondary', type: 'text', label: 'Màu chữ phụ', defaultValue: '#6B7280' },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          description: 'Chọn font chữ cho website. Sử dụng Google Fonts.',
          fields: [
            {
              name: 'headingFont', type: 'select', label: 'Font tiêu đề',
              defaultValue: 'Be Vietnam Pro',
              options: [
                { label: 'Be Vietnam Pro (mặc định)', value: 'Be Vietnam Pro' },
                { label: 'Inter', value: 'Inter' },
                { label: 'Roboto', value: 'Roboto' },
                { label: 'Outfit', value: 'Outfit' },
                { label: 'Montserrat', value: 'Montserrat' },
                { label: 'Nunito Sans', value: 'Nunito Sans' },
                { label: 'Open Sans', value: 'Open Sans' },
              ],
            },
            {
              name: 'bodyFont', type: 'select', label: 'Font nội dung',
              defaultValue: 'Be Vietnam Pro',
              options: [
                { label: 'Be Vietnam Pro (mặc định)', value: 'Be Vietnam Pro' },
                { label: 'Inter', value: 'Inter' },
                { label: 'Roboto', value: 'Roboto' },
                { label: 'Nunito Sans', value: 'Nunito Sans' },
                { label: 'Open Sans', value: 'Open Sans' },
                { label: 'Source Sans Pro', value: 'Source Sans Pro' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'baseFontSize', type: 'number', label: 'Cỡ chữ cơ bản (px)', defaultValue: 16, min: 12, max: 20 },
                { name: 'headingWeight', type: 'select', label: 'Độ đậm tiêu đề', defaultValue: '700', options: [
                  { label: 'Bình thường (400)', value: '400' },
                  { label: 'Hơi đậm (500)', value: '500' },
                  { label: 'Semi-bold (600)', value: '600' },
                  { label: 'Bold (700)', value: '700' },
                  { label: 'Extra-bold (800)', value: '800' },
                ]},
              ],
            },
          ],
        },
        {
          label: 'Bo góc & Hiệu ứng',
          fields: [
            {
              name: 'borderRadius', type: 'select', label: 'Độ bo góc',
              defaultValue: 'medium',
              options: [
                { label: 'Không bo (0px)', value: 'none' },
                { label: 'Nhẹ (4px)', value: 'small' },
                { label: 'Vừa (12px) — mặc định', value: 'medium' },
                { label: 'Nhiều (20px)', value: 'large' },
                { label: 'Tròn (999px)', value: 'pill' },
              ],
            },
            {
              name: 'shadowStyle', type: 'select', label: 'Kiểu bóng đổ',
              defaultValue: 'soft',
              options: [
                { label: 'Không bóng', value: 'none' },
                { label: 'Nhẹ nhàng — mặc định', value: 'soft' },
                { label: 'Rõ ràng', value: 'medium' },
                { label: 'Nổi bật', value: 'strong' },
              ],
            },
            { name: 'enableAnimations', type: 'checkbox', label: 'Bật hiệu ứng chuyển động', defaultValue: true },
          ],
        },
      ],
    },
  ],
}
