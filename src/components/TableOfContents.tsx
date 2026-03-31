'use client'

import { useEffect, useState } from 'react'

type Heading = {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ selector = '.article-content' }: { selector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const contentElement = document.querySelector(selector)
    if (!contentElement) return

    // Support H1–H4
    const headingElements = Array.from(contentElement.querySelectorAll('h1, h2, h3, h4'))
    if (headingElements.length === 0) return

    const extracted: Heading[] = headingElements.map((el, index) => {
      let id = el.id
      if (!id) {
        id = `heading-${index}-${el.textContent?.slice(0, 20).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '') || index}`
        el.id = id
      }
      return {
        id,
        text: el.textContent?.trim() || '',
        level: Number(el.tagName.replace('H', ''))
      }
    }).filter(h => h.text)

    setHeadings(extracted)
  }, [selector])

  // Scroll spy — highlight active heading
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderLeft: '3px solid #0078D4',
      borderRadius: '0 8px 8px 0',
      marginBottom: 28,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: 14,
          color: '#1a1a2e',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0078D4" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <circle cx="4" cy="6" r="1" fill="#0078D4"/><circle cx="4" cy="12" r="1" fill="#0078D4"/>
            <circle cx="4" cy="18" r="1" fill="#0078D4"/>
          </svg>
          Nội dung chính
          <span style={{ fontSize: 11, fontWeight: 500, background: '#dbeafe', color: '#1e40af', padding: '1px 7px', borderRadius: 20 }}>
            {headings.length} mục
          </span>
        </span>
        <span style={{ fontSize: 12, color: '#0078D4', transition: 'transform 0.2s', display: 'inline-block', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
      </button>

      {/* TOC list */}
      {!collapsed && (
        <div style={{ padding: '0 16px 14px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {headings.map(h => (
              <li
                key={h.id}
                style={{
                  paddingLeft: (h.level - 1) * 14,
                  borderRadius: 4,
                  background: activeId === h.id ? '#eff8ff' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <a
                  href={`#${h.id}`}
                  style={{
                    display: 'block',
                    padding: '5px 8px',
                    color: activeId === h.id ? '#0078D4' : h.level <= 2 ? '#374151' : '#6b7280',
                    textDecoration: 'none',
                    fontSize: h.level <= 2 ? 14 : 13,
                    fontWeight: h.level <= 2 ? 600 : 400,
                    lineHeight: 1.4,
                    borderLeft: activeId === h.id ? '2px solid #0078D4' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onClick={e => {
                    e.preventDefault()
                    const target = document.getElementById(h.id)
                    if (target) {
                      const y = target.getBoundingClientRect().top + window.pageYOffset - 90
                      window.scrollTo({ top: y, behavior: 'smooth' })
                    }
                  }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
