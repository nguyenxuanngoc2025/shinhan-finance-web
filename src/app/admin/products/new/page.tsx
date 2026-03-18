'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'fas fa-box',
    interest_rate: '',
    loan_limit: '',
    loan_term: '',
    order_index: 1,
    status: 'active',
    content: { features: [''], image: '' },
  })

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const updateFeature = (idx: number, val: string) => {
    const features = [...(form.content.features || [''])]
    features[idx] = val
    setForm({ ...form, content: { ...form.content, features } })
  }

  const addFeature = () => setForm({ ...form, content: { ...form.content, features: [...form.content.features, ''] } })
  const removeFeature = (idx: number) => {
    const features = form.content.features.filter((_, i) => i !== idx)
    setForm({ ...form, content: { ...form.content, features } })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/cms/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push('/admin/products')
    else setSaving(false)
  }

  return (
    <div>
      <h1>Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit} className="card form-layout">
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: autoSlug(e.target.value)})} required />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required />
          </div>
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Lãi suất</label>
            <input type="text" value={form.interest_rate} onChange={e => setForm({...form, interest_rate: e.target.value})} placeholder="Từ 18%/năm" />
          </div>
          <div className="form-group">
            <label>Hạn mức</label>
            <input type="text" value={form.loan_limit} onChange={e => setForm({...form, loan_limit: e.target.value})} placeholder="Đến 300 triệu" />
          </div>
          <div className="form-group">
            <label>Kỳ hạn</label>
            <input type="text" value={form.loan_term} onChange={e => setForm({...form, loan_term: e.target.value})} placeholder="Đến 48 tháng" />
          </div>
        </div>
        <div className="form-group">
          <label>Ảnh sản phẩm</label>
          <input type="text" value={form.content.image} onChange={e => setForm({...form, content: {...form.content, image: e.target.value}})} placeholder="/images/products/product.png" />
        </div>
        <div className="form-group">
          <label>Đặc điểm nổi bật</label>
          {form.content.features.map((f, i) => (
            <div key={i} style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
              <input type="text" value={f} onChange={e => updateFeature(i, e.target.value)} style={{flex:1}} placeholder={`Đặc điểm ${i+1}`} />
              {form.content.features.length > 1 && <button type="button" onClick={() => removeFeature(i)} className="btn-action btn-delete" style={{alignSelf:'center'}}>Xóa</button>}
            </div>
          ))}
          <button type="button" onClick={addFeature} className="btn-secondary" style={{marginTop:'4px'}}>+ Thêm đặc điểm</button>
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Icon (FontAwesome)</label>
            <input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Thứ tự</label>
            <input type="number" value={form.order_index} onChange={e => setForm({...form, order_index: parseInt(e.target.value)})} min={1} />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ẩn</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Tạo sản phẩm'}</button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
