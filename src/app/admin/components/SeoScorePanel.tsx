'use client'

import { useMemo } from 'react'

interface SeoScorePanelProps {
  title: string
  slug: string
  excerpt: string
  content: string
  seoTitle: string
  seoDescription: string
  coverImage: string
  focusKeyword?: string
}

type SeoCheck = {
  label: string
  passed: boolean
  hint: string
  weight: number
}

export default function SeoScorePanel(props: SeoScorePanelProps) {
  const { title, slug, excerpt, content, seoTitle, seoDescription, coverImage } = props

  const plainContent = content.replace(/<[^>]*>/g, '').trim()
  const wordCount = plainContent.split(/\s+/).filter(Boolean).length

  const checks = useMemo<SeoCheck[]>(() => {
    const t = seoTitle || title
    const d = seoDescription || excerpt

    return [
      // Title
      { label: 'Tiêu đề SEO', passed: t.length >= 30 && t.length <= 60, hint: t.length === 0 ? 'Chưa có tiêu đề' : `${t.length}/60 ký tự (nên 30-60)`, weight: 15 },
      // Meta description
      { label: 'Meta Description', passed: d.length >= 100 && d.length <= 160, hint: d.length === 0 ? 'Chưa có mô tả' : `${d.length}/160 ký tự (nên 100-160)`, weight: 15 },
      // Slug
      { label: 'URL Slug', passed: slug.length > 3 && !slug.includes(' '), hint: slug.length === 0 ? 'Chưa có slug' : 'OK', weight: 5 },
      // Content length
      { label: 'Độ dài nội dung', passed: wordCount >= 300, hint: `${wordCount} từ (nên ≥ 300)`, weight: 15 },
      // Cover image
      { label: 'Ảnh đại diện', passed: !!coverImage, hint: coverImage ? 'Đã có ảnh bìa' : 'Chưa có ảnh bìa', weight: 10 },
      // Headings (H2/H3 in content)
      { label: 'Heading (H2/H3)', passed: /<h[23]>/i.test(content), hint: /<h[23]>/i.test(content) ? 'Có heading trong nội dung' : 'Nên thêm H2/H3', weight: 10 },
      // Images in content
      { label: 'Ảnh trong nội dung', passed: /<img\s/i.test(content), hint: /<img\s/i.test(content) ? 'Có ảnh trong nội dung' : 'Nên chèn ảnh minh họa', weight: 10 },
      // Internal links
      { label: 'Liên kết nội bộ', passed: /<a\s/i.test(content), hint: /<a\s/i.test(content) ? 'Có liên kết' : 'Nên thêm link nội bộ', weight: 5 },
      // Excerpt
      { label: 'Tóm tắt', passed: excerpt.length >= 50, hint: excerpt.length === 0 ? 'Chưa có tóm tắt' : `${excerpt.length} ký tự`, weight: 10 },
      // No duplicate title/H1
      { label: 'Tiêu đề không trùng H2', passed: !content.toLowerCase().includes(`<h2>${title.toLowerCase()}</h2>`), hint: 'Tiêu đề không nên trùng với H2', weight: 5 },
    ]
  }, [title, slug, excerpt, content, seoTitle, seoDescription, coverImage, wordCount])

  const score = useMemo(() => {
    const maxScore = checks.reduce((s, c) => s + c.weight, 0)
    const earned = checks.filter(c => c.passed).reduce((s, c) => s + c.weight, 0)
    return Math.round((earned / maxScore) * 100)
  }, [checks])

  const scoreColor = score >= 80 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#dc2626'
  const scoreLabel = score >= 80 ? 'Tốt' : score >= 50 ? 'Trung bình' : 'Cần cải thiện'

  return (
    <>
      <style>{`
        .seo-panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
        .seo-header { padding: 14px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f3f4f6; }
        .seo-circle { position: relative; width: 48px; height: 48px; flex-shrink: 0; }
        .seo-circle svg { transform: rotate(-90deg); }
        .seo-circle-bg { fill: none; stroke: #f3f4f6; stroke-width: 4; }
        .seo-circle-fg { fill: none; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease, stroke 0.3s; }
        .seo-score-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
        .seo-info h4 { font-size: 14px; font-weight: 600; color: #1a1a2e; margin: 0 0 2px; }
        .seo-info span { font-size: 12px; }
        .seo-checks { padding: 8px 0; }
        .seo-check { display: flex; align-items: flex-start; gap: 8px; padding: 6px 16px; font-size: 12px; }
        .seo-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 3px; flex-shrink: 0; }
        .seo-dot.pass { background: #16a34a; }
        .seo-dot.fail { background: #dc2626; }
        .seo-check-label { font-weight: 500; color: #374151; }
        .seo-check-hint { color: #9ca3af; margin-left: 4px; }
        .seo-wordcount { padding: 10px 16px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #6b7280; display: flex; justify-content: space-between; }
      `}</style>

      <div className="seo-panel">
        <div className="seo-header">
          <div className="seo-circle">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle className="seo-circle-bg" cx="24" cy="24" r="20" />
              <circle
                className="seo-circle-fg"
                cx="24" cy="24" r="20"
                stroke={scoreColor}
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - score / 100)}`}
              />
            </svg>
            <div className="seo-score-text" style={{ color: scoreColor }}>{score}</div>
          </div>
          <div className="seo-info">
            <h4>Điểm SEO</h4>
            <span style={{ color: scoreColor, fontWeight: 600 }}>{scoreLabel}</span>
          </div>
        </div>

        <div className="seo-checks">
          {checks.map((c, i) => (
            <div key={i} className="seo-check">
              <div className={`seo-dot ${c.passed ? 'pass' : 'fail'}`} />
              <div>
                <span className="seo-check-label">{c.label}</span>
                <span className="seo-check-hint"> — {c.hint}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="seo-wordcount">
          <span>Số từ: {wordCount}</span>
          <span>Ký tự: {plainContent.length}</span>
        </div>
      </div>
    </>
  )
}
