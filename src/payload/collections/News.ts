import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Tiêu đề' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', label: 'Ảnh đại diện' },
    { name: 'excerpt', type: 'textarea', label: 'Tóm tắt' },
    { name: 'content', type: 'richText', label: 'Nội dung' },
    {
      name: 'category', type: 'select', label: 'Danh mục',
      options: [
        { label: 'Tin tức', value: 'news' },
        { label: 'Khuyến mãi', value: 'promotion' },
        { label: 'Truyền thông', value: 'press' },
      ],
    },
    { name: 'publishedAt', type: 'date', label: 'Ngày đăng' },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'authorTitle', 'isActive'],
  },
  fields: [
    { name: 'content', type: 'textarea', required: true, label: 'Nội dung đánh giá' },
    { name: 'authorName', type: 'text', required: true, label: 'Tên tác giả' },
    { name: 'authorTitle', type: 'text', label: 'Chức danh/Nghề nghiệp' },
    { name: 'avatar', type: 'upload', relationTo: 'media', label: 'Ảnh đại diện' },
    { name: 'order', type: 'number', defaultValue: 0, label: 'Thứ tự' },
    { name: 'isActive', type: 'checkbox', defaultValue: true, label: 'Hiển thị?' },
  ],
}

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Tên giải thưởng' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Hình ảnh' },
    { name: 'order', type: 'number', defaultValue: 0, label: 'Thứ tự' },
  ],
}

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'isActive'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Tên đối tác' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'website', type: 'text', label: 'Website' },
    { name: 'order', type: 'number', defaultValue: 0, label: 'Thứ tự' },
    { name: 'isActive', type: 'checkbox', defaultValue: true, label: 'Hiển thị?' },
  ],
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  admin: {
    useAsTitle: 'filename',
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Mô tả hình ảnh (alt text)' },
  ],
}
