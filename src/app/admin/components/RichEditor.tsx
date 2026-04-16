'use client'

import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichEditor({ value, onChange, placeholder = 'Bắt đầu viết nội dung...' }: RichEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null)

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      value={value}
      onEditorChange={(newContent) => onChange(newContent)}
      onInit={(_evt, editor) => {
        editorRef.current = editor
      }}
      init={{
        height: 500,
        menubar: false,
        language: 'vi',
        language_url: '/tinymce/langs/vi.js',
        placeholder,
        plugins: [
          'lists', 'link', 'image', 'table', 'code',
          'searchreplace', 'autolink', 'media',
          'autoresize', 'wordcount', 'emoticons',
        ],
        toolbar:
          'blocks | bold italic underline strikethrough | ' +
          'forecolor backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist | ' +
          'link image table | ' +
          'blockquote hr | ' +
          'searchreplace | emoticons | code',
        toolbar_mode: 'wrap',
        block_formats: 'Đoạn văn=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Code Block=pre; Trích dẫn=blockquote',
        content_style: `
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 15px;
            line-height: 1.75;
            color: #1a1a2e;
            padding: 16px 20px;
            margin: 0;
          }
          h1 { font-size: 2em; font-weight: 700; color: #0f172a; margin: 24px 0 12px; line-height: 1.3; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
          h2 { font-size: 1.6em; font-weight: 700; color: #1e293b; margin: 20px 0 10px; line-height: 1.35; }
          h3 { font-size: 1.35em; font-weight: 600; color: #334155; margin: 18px 0 8px; line-height: 1.4; }
          h4 { font-size: 1.15em; font-weight: 600; color: #475569; margin: 16px 0 6px; line-height: 1.45; }
          h5 { font-size: 1.05em; font-weight: 600; color: #64748b; margin: 14px 0 4px; line-height: 1.5; }
          h6 { font-size: 0.95em; font-weight: 600; color: #64748b; margin: 12px 0 4px; line-height: 1.5; text-transform: uppercase; letter-spacing: 0.05em; }
          img { max-width: 100%; height: auto; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          table th, table td { border: 1px solid #d1d5db; padding: 8px 12px; }
          table th { background: #f3f4f6; font-weight: 600; }
          blockquote { border-left: 3px solid #0078D4; margin: 12px 0; padding: 8px 16px; background: #f8f9fb; color: #4b5563; border-radius: 0 6px 6px 0; }
          pre { background: #1e1e2e; color: #cdd6f4; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; overflow-x: auto; }
          a { color: #0078D4; }
          hr { border: none; border-top: 2px solid #e5e7eb; margin: 24px 0; }
          p:first-child { margin-top: 0; }
        `,
        // Image upload: upload to /api/cms/upload and return URL
        images_upload_handler: async (blobInfo) => {
          const formData = new FormData()
          formData.append('files', blobInfo.blob(), blobInfo.filename())
          const res = await fetch('/api/cms/upload', { method: 'POST', body: formData })
          const data = await res.json()
          if (data.data?.[0]?.url) return data.data[0].url
          throw new Error(data.errors?.[0] || 'Upload ảnh thất bại')
        },
        image_advtab: true,
        image_caption: true,
        table_default_styles: { 'width': '100%', 'border-collapse': 'collapse' },
        table_responsive_width: true,
        paste_data_images: true,
        paste_as_text: false,
        autoresize_bottom_margin: 24,
        min_height: 400,
        max_height: 900,
        link_assume_external_targets: true,
        link_context_toolbar: true,
        target_list: [
          { title: 'Cửa sổ mới', value: '_blank' },
          { title: 'Cùng cửa sổ', value: '_self' },
        ],
        statusbar: true,
        elementpath: false,
        resize: false,
        branding: false,
        promotion: false,
      }}
    />
  )
}
