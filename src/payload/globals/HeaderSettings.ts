import type { GlobalConfig } from 'payload'

export const HeaderSettings: GlobalConfig = {
  slug: 'header-settings',
  label: '📌 Header & Menu',
  admin: {
    group: '🎨 Giao diện',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Menu chính',
          fields: [
            {
              name: 'menuItems', type: 'array', label: 'Các mục menu',
              admin: { description: 'Kéo thả để sắp xếp thứ tự menu' },
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Tên hiển thị' },
                { name: 'href', type: 'text', required: true, label: 'Link (VD: /san-pham)' },
                { name: 'isDropdown', type: 'checkbox', label: 'Có menu con?', defaultValue: false },
                {
                  name: 'children', type: 'array', label: 'Menu con',
                  admin: { condition: (_, siblingData) => siblingData?.isDropdown },
                  fields: [
                    { name: 'label', type: 'text', required: true, label: 'Tên hiển thị' },
                    { name: 'href', type: 'text', required: true, label: 'Link' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Nút CTA',
          fields: [
            { name: 'showCta1', type: 'checkbox', label: 'Hiển thị nút CTA 1', defaultValue: true },
            { name: 'cta1Text', type: 'text', label: 'Text nút 1', defaultValue: 'Đăng ký vay' },
            { name: 'cta1Link', type: 'text', label: 'Link nút 1', defaultValue: '/dang-ky-vay' },
            { name: 'cta1Style', type: 'select', label: 'Kiểu nút 1', defaultValue: 'primary', options: [
              { label: 'Primary (nền màu)', value: 'primary' },
              { label: 'Outline (viền)', value: 'outline' },
            ]},
            { name: 'showCta2', type: 'checkbox', label: 'Hiển thị nút CTA 2', defaultValue: true },
            { name: 'cta2Text', type: 'text', label: 'Text nút 2', defaultValue: 'Mở thẻ' },
            { name: 'cta2Link', type: 'text', label: 'Link nút 2', defaultValue: '/san-pham/the-tin-dung' },
            { name: 'cta2Style', type: 'select', label: 'Kiểu nút 2', defaultValue: 'outline', options: [
              { label: 'Primary (nền màu)', value: 'primary' },
              { label: 'Outline (viền)', value: 'outline' },
            ]},
          ],
        },
        {
          label: 'Cài đặt Header',
          fields: [
            { name: 'headerStyle', type: 'select', label: 'Kiểu Header', defaultValue: 'sticky', options: [
              { label: 'Cố định trên cùng (Sticky)', value: 'sticky' },
              { label: 'Bình thường (Static)', value: 'static' },
            ]},
            { name: 'showHotline', type: 'checkbox', label: 'Hiện số hotline trên header', defaultValue: true },
          ],
        },
      ],
    },
  ],
}
