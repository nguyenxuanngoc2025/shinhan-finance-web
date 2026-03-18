'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPagePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', status: 'draft',
    seo_title: '', seo_description: '', seo_og_image: '',
    content: [],
  })

  const autoSlug = (name: string) => name.toLowerCase().replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g,'a').replace(/[èéẹẻẽêềếệểễ]/g,'e').replace(/[ìíịỉĩ]/g,'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g,'o').replace(/[ùúụủũưừứựửữ]/g,'u').replace(/[ỳýỵỷỹ]/g,'y').replace(/đ/g,'d').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/cms/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) router.push('/admin/pages')
    else setSaving(false)
  }

  return (
    <div>
      <h1>Tạo trang mới</h1>
      <form onSubmit={handleSubmit} className="card form-layout">
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group"><label>Tiêu đề</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: autoSlug(e.target.value)})} required /></div>
          <div className="form-group"><label>Slug</label><input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required /></div>
        </div>
        <div className="form-group"><label>Trạng thái</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="draft">Nháp</option><option value="published">Xuất bản</option></select></div>
        <h3 style={{margin:'24px 0 12px',fontSize:'14px',color:'#5f6b7a'}}>SEO</h3>
        <div className="form-group"><label>SEO Title</label><input type="text" value={form.seo_title} onChange={e => setForm({...form, seo_title: e.target.value})} /></div>
        <div className="form-group"><label>SEO Description</label><textarea value={form.seo_description} onChange={e => setForm({...form, seo_description: e.target.value})} rows={2} /></div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Tạo trang'}</button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
