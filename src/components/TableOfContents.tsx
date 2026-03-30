'use client'

import { useEffect, useState } from 'react'

type Heading = {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ selector = '.article-content' }: { selector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    // Generate Table of Contents
    const contentElement = document.querySelector(selector)
    if (!contentElement) return

    const headingElements = Array.from(contentElement.querySelectorAll('h2, h3'))
    
    if (headingElements.length === 0) return

    const extracted: Heading[] = headingElements.map((el, index) => {
      let id = el.id
      if (!id) {
        id = `heading-${index}-${Math.random().toString(36).substring(2, 6)}`
        el.id = id
      }
      return {
        id,
        text: el.textContent || '',
        level: Number(el.tagName.replace('H', ''))
      }
    })

    setHeadings(extracted)
  }, [selector])

  if (headings.length === 0) return null

  return (
    <div className="toc-container" style={{
      background: '#f8f9fa',
      border: '1px solid #e9ecef',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px'
    }}>
      <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '16px', color: '#1a1a2e' }}>
        Nội dung chính
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {headings.map(h => (
          <li key={h.id} style={{ 
            marginBottom: '10px', 
            paddingLeft: h.level === 3 ? '20px' : '0' 
          }}>
            <a 
              href={`#${h.id}`} 
              style={{ color: '#007BC3', textDecoration: 'none', fontSize: h.level === 3 ? '14px' : '15px' }}
              onClick={(e) => {
                e.preventDefault()
                const target = document.getElementById(h.id)
                if (target) {
                  const yOffset = -80
                  const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset
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
  )
}
