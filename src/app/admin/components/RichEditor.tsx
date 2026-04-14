'use client'

import { useRef, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichEditor({ value, onChange, placeholder = 'Bắt đầu viết nội dung...' }: RichEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const isInternalChange = useRef(false)

  // Sync external value changes (e.g. parent form reset, initial load)
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      const currentContent = editorRef.current.getContent()
      if (currentContent !== value) {
        editorRef.current.setContent(value || '')
      }
    }
    isInternalChange.current = false
  }, [value])

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(_evt, editor) => {
        editorRef.current = editor
        // Set initial content after editor is ready
        if (value) editor.setContent(value)
      }}
      init={{
        height: 500,
        menubar: false,
        language: 'vi',
        language_url: '/tinymce/langs/vi.js',
        placeholder,
        plugins: [
          'lists', 'link', 'image', 'table', 'code',
          'searchreplace', 'autolink', 'media', 'paste',
          'autoresize', 'wordcount', 'emoticons',
        ],
        toolbar:
          'formatselect | bold italic underline strikethrough | ' +
          'forecolor backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist | ' +
          'link image table | ' +
          'blockquote hr | ' +
          'searchreplace | emoticons | code',
        toolbar_mode: 'wrap',
        block_formats: 'Đoạn văn=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Code Block=pre; Trích dẫn=blockquote',
        content_style: `
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 15px;
            line-height: 1.75;
            color: #1a1a2e;
            padding: 16px 20px;
            margin: 0;
          }
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
        // Image dialog settings
        image_advtab: true,
        image_caption: true,
        // Table settings
        table_default_styles: { 'width': '100%', 'border-collapse': 'collapse' },
        table_responsive_width: true,
        // Paste settings
        paste_data_images: true,
        paste_as_text: false,
        // Autoresize
        autoresize_bottom_margin: 24,
        min_height: 400,
        max_height: 900,
        // Link settings
        link_assume_external_targets: true,
        link_context_toolbar: true,
        target_list: [
          { title: 'Cửa sổ mới', value: '_blank' },
          { title: 'Cùng cửa sổ', value: '_self' },
        ],
        // Word count in status bar
        statusbar: true,
        elementpath: false,
        resize: false,
        branding: false,
        promotion: false,
      }}
      onEditorChange={(newContent) => {
        isInternalChange.current = true
        onChange(newContent)
      }}
    />
  )
}
