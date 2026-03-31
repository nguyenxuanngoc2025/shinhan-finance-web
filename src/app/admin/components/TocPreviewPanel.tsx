'use client'

import { useMemo } from 'react'

type Heading = {
  text: string
  level: number
  index: number
}

interface Props {
  content: string
}

function extractHeadings(html: string): Heading[] {
  if (typeof window === 'undefined') return []
  const div = document.createElement('div')
  div.innerHTML = html
  const els = Array.from(div.querySelectorAll('h1, h2, h3, h4'))
  return els.map((el, i) => ({
    text: el.textContent?.trim() || '',
    level: Number(el.tagName.replace('H', '')),
    index: i,
  })).filter(h => h.text)
}

export default function TocPreviewPanel({ content }: Props) {
  const headings = useMemo(() => {
    if (!content) return []
    return extractHeadings(content)
  }, [content])

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: '#1a1a2e', borderBottom: '1px solid #f3f4f6', background: '#fafbfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Mục lục tự động</span>
        <span style={{ fontSize: 11, fontWeight: 500, background: headings.length > 0 ? '#dcfce7' : '#f3f4f6', color: headings.length > 0 ? '#166534' : '#9ca3af', padding: '2px 8px', borderRadius: 20 }}>
          {headings.length} mục
        </span>
      </div>

      {headings.length === 0 ? (
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
            Chưa có mục lục. Thêm các Heading (H1–H4) vào nội dung bài viết để tự động tạo mục lục.
          </div>
          <div style={{ marginTop: 10, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '8px 10px', fontSize: 11, color: '#92400e' }}>
            💡 Mục lục sẽ hiển thị tự động trước nội dung bài khi xuất bản
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: '10px 14px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {headings.map(h => (
                <li key={h.index} style={{
                  paddingLeft: (h.level - 1) * 12,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                }}>
                  <span style={{
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 700,
                    color: h.level === 1 ? '#1a1a2e' : h.level === 2 ? '#0078D4' : '#6b7280',
                    background: h.level === 1 ? '#e5e7eb' : h.level === 2 ? '#dbeafe' : '#f3f4f6',
                    padding: '1px 4px',
                    borderRadius: 3,
                    marginTop: 2,
                  }}>H{h.level}</span>
                  <span style={{
                    fontSize: h.level <= 2 ? 12 : 11,
                    color: h.level === 1 ? '#1a1a2e' : h.level === 2 ? '#374151' : '#6b7280',
                    fontWeight: h.level <= 2 ? 600 : 400,
                    lineHeight: 1.4,
                  }}>
                    {h.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '8px 14px', background: '#f0f9ff', borderTop: '1px solid #e0f2fe', fontSize: 11, color: '#0369a1' }}>
            ✓ Mục lục sẽ tự động hiển thị trên trang bài viết
          </div>
        </>
      )}
    </div>
  )
}
