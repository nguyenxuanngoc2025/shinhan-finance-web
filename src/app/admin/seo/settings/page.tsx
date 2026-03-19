'use client'
import { useState, useEffect, useCallback } from 'react'
import ImagePicker from '../../components/ImagePicker'

type SeoSettings = {
  default_title: string
  default_description: string
  title_separator: string
  default_og_image: string
  robots_follow: boolean
  robots_index: boolean
}

const DEFAULTS: SeoSettings = {
  default_title: 'Shinhan Finance | Công ty tài chính đến từ Hàn Quốc',
  default_description: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam, thành viên của Shinhan Card (Hàn Quốc)',
  title_separator: '|',
  default_og_image: '',
  robots_follow: true,
  robots_index: true,
}

export default function SeoSettingsPage() {
  const [settings, setSettings] = useState<SeoSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchSettings = useCallback(() => {
    fetch('/api/cms/settings?key=seo')
      .then(r => r.json())
      .then(res => {
        if (res.data && typeof res.data === 'object') {
          setSettings(prev => ({ ...prev, ...res.data }))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const update = (key: keyof SeoSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo: settings }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card"><p style={{textAlign:'center',padding:'2rem'}}>Đang tải...</p></div>

  return (
    <div>
      <div className="page-header">
        <h1>Cài đặt SEO</h1>
        <button className={`btn-primary${saved ? ' saved' : ''}`} onClick={handleSave} disabled={saving} style={saved ? {background:'#28a745'} : {}}>
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu'}
        </button>
      </div>

      <div className="card form-layout">
        <div className="form-group">
          <label>Tiêu đề mặc định (Title Tag)</label>
          <input type="text" value={settings.default_title} onChange={e => update('default_title', e.target.value)} placeholder="Shinhan Finance — Giải pháp tài chính toàn diện" />
          <small style={{color:'#888',fontSize:12}}>Hiển thị trên tab trình duyệt khi không có title riêng cho từng trang</small>
        </div>

        <div className="form-group">
          <label>Mô tả mặc định (Meta Description)</label>
          <textarea value={settings.default_description} onChange={e => update('default_description', e.target.value)} rows={3} />
          <small style={{color:'#888',fontSize:12}}>Hiển thị dưới tiêu đề trên trang kết quả Google. Tối ưu 150-160 ký tự.</small>
        </div>

        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Ký tự phân cách title</label>
            <input type="text" value={settings.title_separator} onChange={e => update('title_separator', e.target.value)} placeholder="| hoặc - hoặc >" />
          </div>
          <div className="form-group">
            <label>OG Image mặc định</label>
            <ImagePicker value={settings.default_og_image} onChange={v => update('default_og_image', v)} label="OG Image" aspect="wide" />
          </div>
        </div>

        <div style={{marginTop:16}}>
          <h3 style={{fontSize:14,fontWeight:600,color:'#374151',marginBottom:12}}>Robots</h3>
          <div style={{display:'flex',gap:24}}>
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}>
              <input type="checkbox" checked={settings.robots_index} onChange={e => update('robots_index', e.target.checked)} />
              Cho phép Google index website
            </label>
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}>
              <input type="checkbox" checked={settings.robots_follow} onChange={e => update('robots_follow', e.target.checked)} />
              Cho phép Google follow links
            </label>
          </div>
        </div>
      </div>

      <div className="card form-layout" style={{marginTop:12,background:'#f8f9fa',border:'1px solid #e5e7eb',borderRadius:8,padding:14}}>
        <p style={{fontSize:13,color:'#6b7280',margin:0}}>
          Mã theo dõi Google Analytics, Search Console, Facebook Pixel đã chuyển sang <a href="/admin/settings/tracking" style={{color:'#0078D4'}}>Cài đặt &gt; Mã theo dõi</a>
        </p>
      </div>
    </div>
  )
}
