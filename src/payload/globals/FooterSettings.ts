import type { GlobalConfig } from 'payload'

export const FooterSettings: GlobalConfig = {
  slug: 'footer-settings',
  label: '🦶 Footer',
  admin: {
    group: '🎨 Giao diện',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cột link',
          description: 'Footer chia thành các cột link. Kéo thả để sắp xếp.',
          fields: [
            {
              name: 'columns', type: 'array', label: 'Các cột Footer', maxRows: 4,
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề cột (để trống nếu không cần)' },
                {
                  name: 'links', type: 'array', label: 'Danh sách link',
                  fields: [
                    { name: 'label', type: 'text', required: true, label: 'Tên hiển thị' },
                    { name: 'href', type: 'text', required: true, label: 'Link' },
                    { name: 'isExternal', type: 'checkbox', label: 'Mở tab mới?', defaultValue: false },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Copyright',
          fields: [
            { name: 'copyrightLine1', type: 'text', label: 'Dòng 1', defaultValue: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam' },
            { name: 'copyrightLine2', type: 'text', label: 'Dòng 2', defaultValue: 'Thành viên của Shinhan Card | Shinhan Financial Group (Hàn Quốc)' },
            { name: 'copyrightLine3', type: 'text', label: 'Dòng 3', defaultValue: 'Mọi quyền được bảo hộ | GPKD. 0304946247' },
          ],
        },
        {
          label: 'App Store',
          fields: [
            { name: 'showAppButtons', type: 'checkbox', label: 'Hiện nút tải app', defaultValue: true },
            { name: 'appStoreUrl', type: 'text', label: 'Link App Store' },
            { name: 'googlePlayUrl', type: 'text', label: 'Link Google Play' },
            { name: 'appStoreImage', type: 'upload', relationTo: 'media', label: 'Ảnh nút App Store' },
            { name: 'googlePlayImage', type: 'upload', relationTo: 'media', label: 'Ảnh nút Google Play' },
          ],
        },
      ],
    },
  ],
}
