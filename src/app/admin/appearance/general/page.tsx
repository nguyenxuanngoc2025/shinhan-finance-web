'use client'
import { useState, useEffect, useCallback } from 'react'
import ImagePicker from '../../components/ImagePicker'

type GeneralSettings = {
  site_name: string
  site_description: string
  logo: string
  footer_logo: string
  favicon: string
  contact_phone: string
  contact_email: string
  zalo_number: string
  facebook_url: string
  address: string
}

const DEFAULTS: GeneralSettings = {
  site_name: 'Shinhan Bank',
  site_description: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam',
  logo: '/images/logo/logo-header.svg',
  footer_logo: '/images/logo/logo-footer.svg',
  favicon: '',
  contact_phone: '0969 930 328',
  contact_email: 'cskh@shinhanfinance.com.vn',
  zalo_number: '0969930328',
  facebook_url: '',
  address: '',
}

export default function AppearanceGeneralPage() {
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchSettings = useCallback(() => {
    fetch('/api/cms/settings?key=general')
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

  const update = (key: keyof GeneralSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ general: settings }),
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
        <h1>Cài đặt chung</h1>
        <button className={`btn-primary${saved ? ' saved' : ''}`} onClick={handleSave} disabled={saving} style={saved ? {background:'#28a745'} : {}}>
          {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu thay đổi'}
        </button>
      </div>
      <div className="card form-layout">
        <div className="form-group">
          <label>Tên website</label>
          <input type="text" value={settings.site_name} onChange={e => update('site_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Mô tả website</label>
          <textarea value={settings.site_description} onChange={e => update('site_description', e.target.value)} rows={2} />
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Logo Header</label>
            <ImagePicker value={settings.logo} onChange={v => update('logo', v)} label="Logo website" aspect="logo" />
          </div>
          <div className="form-group">
            <label>Logo Footer <span style={{fontSize:12,color:'#888'}}>(nền trong suốt, màu trắng)</span></label>
            <ImagePicker value={settings.footer_logo} onChange={v => update('footer_logo', v)} label="Logo footer" aspect="logo" />
          </div>
          <div className="form-group">
            <label>Favicon</label>
            <ImagePicker value={settings.favicon} onChange={v => update('favicon', v)} label="Favicon" aspect="square" compact />
          </div>
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group"><label>Hotline</label><input type="text" value={settings.contact_phone} onChange={e => update('contact_phone', e.target.value)} /></div>
          <div className="form-group"><label>Email liên hệ</label><input type="text" value={settings.contact_email} onChange={e => update('contact_email', e.target.value)} /></div>
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group"><label>Số Zalo</label><input type="text" value={settings.zalo_number} onChange={e => update('zalo_number', e.target.value)} placeholder="0969930328" /></div>
          <div className="form-group"><label>Facebook URL</label><input type="text" value={settings.facebook_url} onChange={e => update('facebook_url', e.target.value)} placeholder="https://facebook.com/..." /></div>
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <textarea value={settings.address} onChange={e => update('address', e.target.value)} rows={2} placeholder="Địa chỉ công ty..." />
        </div>
      </div>
    </div>
  )
}
