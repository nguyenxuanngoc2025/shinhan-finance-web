'use client'
import { useState, useEffect } from 'react'

export default function AppearanceThemePage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/cms/settings').then(r => r.json()).then(res => {
      const s: Record<string, string> = {}
      ;(res.data || []).filter((r: any) => r.grp === 'colors').forEach((r: any) => { s[r.key] = typeof r.value === 'string' ? r.value.replace(/^"|"$/g, '') : r.value })
      setSettings(s); setLoading(false)
    })
  }, [])

  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    for (const [key, value] of Object.entries(settings)) {
      await fetch('/api/cms/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) })
    }
    setSaving(false); alert('Đã lưu!')
  }

  if (loading) return <div className="card"><p style={{textAlign:'center',padding:'2rem'}}>Đang tải...</p></div>

  return (
    <div>
      <div className="page-header"><h1>Màu sắc & Font</h1><button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button></div>
      <div className="card form-layout">
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Màu chính</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input type="color" value={settings.primary_color || '#0078D4'} onChange={e => update('primary_color', e.target.value)} style={{width:40,height:40,padding:0,border:'none',cursor:'pointer'}} />
              <input type="text" value={settings.primary_color || '#0078D4'} onChange={e => update('primary_color', e.target.value)} style={{flex:1}} />
            </div>
          </div>
          <div className="form-group">
            <label>Màu phụ</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input type="color" value={settings.secondary_color || '#0056A6'} onChange={e => update('secondary_color', e.target.value)} style={{width:40,height:40,padding:0,border:'none',cursor:'pointer'}} />
              <input type="text" value={settings.secondary_color || '#0056A6'} onChange={e => update('secondary_color', e.target.value)} style={{flex:1}} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Font chính</label>
          <select value={settings.font_family || 'Inter'} onChange={e => update('font_family', e.target.value)}>
            <option value="Inter">Inter</option><option value="Roboto">Roboto</option><option value="Open Sans">Open Sans</option><option value="Montserrat">Montserrat</option><option value="Nunito">Nunito</option>
          </select>
        </div>
        <div style={{marginTop:24,padding:20,background:'#f8f9fb',borderRadius:8}}>
          <strong style={{fontSize:13,color:'#5f6b7a'}}>Xem trước</strong>
          <div style={{marginTop:12}}>
            <div style={{display:'flex',gap:12,marginBottom:12}}>
              <div style={{width:60,height:60,borderRadius:8,background:settings.primary_color || '#0078D4'}}></div>
              <div style={{width:60,height:60,borderRadius:8,background:settings.secondary_color || '#0056A6'}}></div>
            </div>
            <p style={{fontFamily:settings.font_family || 'Inter',fontSize:16}}>Đây là font <strong>{settings.font_family || 'Inter'}</strong> — Shinhan Finance</p>
          </div>
        </div>
      </div>
    </div>
  )
}
