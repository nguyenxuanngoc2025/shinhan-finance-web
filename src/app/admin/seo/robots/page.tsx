'use client'
import { useState } from 'react'

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

Sitemap: https://shinhanfinance.ngocnguyenxuan.com/sitemap.xml`

export default function SeoRobotsPage() {
  const [content, setContent] = useState(DEFAULT_ROBOTS)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/cms/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'robots_txt', value: JSON.stringify(content) }) })
    setSaving(false); alert('Đã lưu!')
  }

  return (
    <div>
      <div className="page-header"><h1>Robots.txt</h1><button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button></div>
      <div className="card form-layout" style={{maxWidth:800}}>
        <div className="form-group"><label>Nội dung robots.txt</label><textarea value={content} onChange={e => setContent(e.target.value)} rows={12} style={{fontFamily:'monospace',fontSize:13}} /></div>
        <div style={{background:'#f8f9fb',borderRadius:8,padding:16,marginTop:12}}>
          <strong style={{fontSize:13}}>💡 Hướng dẫn</strong>
          <ul style={{fontSize:13,color:'#5f6b7a',marginTop:8,paddingLeft:20}}>
            <li><code>Allow: /</code> — Cho phép crawl tất cả</li>
            <li><code>Disallow: /admin/</code> — Chặn crawl trang admin</li>
            <li><code>Sitemap:</code> — Đường dẫn tới sitemap</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
