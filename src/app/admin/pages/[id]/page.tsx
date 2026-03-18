'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>({ title: '', slug: '', status: 'draft', seo_title: '', seo_description: '', seo_og_image: '' })

  useEffect(() => {
    fetch(`/api/cms/pages/${id}`).then(r => r.json()).then(res => { if (res.data) setForm(res.data); setLoading(false) })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/cms/pages/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) router.push('/admin/pages')
    else setSaving(false)
  }

  if (loading) return <div className="card"><p style={{textAlign:'center',padding:'2rem'}}>Đang tải...</p></div>

  return (
    <div>
      <h1>Chỉnh sửa trang</h1>
      <form onSubmit={handleSubmit} className="card form-layout">
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group"><label>Tiêu đề</label><input type="text" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="form-group"><label>Slug</label><input type="text" value={form.slug || ''} onChange={e => setForm({...form, slug: e.target.value})} required /></div>
        </div>
        <div className="form-group"><label>Trạng thái</label><select value={form.status || 'draft'} onChange={e => setForm({...form, status: e.target.value})}><option value="draft">Nháp</option><option value="published">Xuất bản</option></select></div>
        <h3 style={{margin:'24px 0 12px',fontSize:'14px',color:'#5f6b7a'}}>SEO</h3>
        <div className="form-group"><label>SEO Title</label><input type="text" value={form.seo_title || ''} onChange={e => setForm({...form, seo_title: e.target.value})} /></div>
        <div className="form-group"><label>SEO Description</label><textarea value={form.seo_description || ''} onChange={e => setForm({...form, seo_description: e.target.value})} rows={2} /></div>
        <div className="form-group"><label>SEO Score</label><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{flex:1,height:8,borderRadius:4,background:'#e0e0e0',overflow:'hidden'}}><div style={{width:`${form.seo_score||0}%`,height:'100%',background:(form.seo_score||0)>70?'#28a745':(form.seo_score||0)>40?'#ffc107':'#dc3545',borderRadius:4}}/></div><span style={{fontSize:13}}>{form.seo_score||0}%</span></div></div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Cập nhật'}</button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
