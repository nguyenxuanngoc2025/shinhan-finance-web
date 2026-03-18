'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>({
    name: '', slug: '', description: '', icon: '', interest_rate: '', loan_limit: '', loan_term: '',
    order_index: 1, status: 'active', content: { features: [''], image: '' },
  })

  useEffect(() => {
    fetch(`/api/cms/products/${id}`)
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          const d = res.data
          setForm({
            ...d,
            content: d.content || { features: [''], image: '' },
          })
        }
        setLoading(false)
      })
  }, [id])

  const updateFeature = (idx: number, val: string) => {
    const features = [...(form.content?.features || [''])]
    features[idx] = val
    setForm({ ...form, content: { ...form.content, features } })
  }
  const addFeature = () => setForm({ ...form, content: { ...form.content, features: [...(form.content?.features || []), ''] } })
  const removeFeature = (idx: number) => {
    const features = (form.content?.features || []).filter((_: any, i: number) => i !== idx)
    setForm({ ...form, content: { ...form.content, features } })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/cms/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push('/admin/products')
    else setSaving(false)
  }

  if (loading) return <div className="card"><p style={{textAlign:'center',padding:'2rem'}}>Đang tải...</p></div>

  return (
    <div>
      <h1>Chỉnh sửa sản phẩm</h1>
      <form onSubmit={handleSubmit} className="card form-layout">
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input type="text" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input type="text" value={form.slug || ''} onChange={e => setForm({...form, slug: e.target.value})} required />
          </div>
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Lãi suất</label>
            <input type="text" value={form.interest_rate || ''} onChange={e => setForm({...form, interest_rate: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Hạn mức</label>
            <input type="text" value={form.loan_limit || ''} onChange={e => setForm({...form, loan_limit: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Kỳ hạn</label>
            <input type="text" value={form.loan_term || ''} onChange={e => setForm({...form, loan_term: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label>Ảnh sản phẩm</label>
          <input type="text" value={form.content?.image || ''} onChange={e => setForm({...form, content: {...form.content, image: e.target.value}})} />
        </div>
        <div className="form-group">
          <label>Đặc điểm nổi bật</label>
          {(form.content?.features || ['']).map((f: string, i: number) => (
            <div key={i} style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
              <input type="text" value={f} onChange={e => updateFeature(i, e.target.value)} style={{flex:1}} />
              {(form.content?.features || []).length > 1 && <button type="button" onClick={() => removeFeature(i)} className="btn-action btn-delete" style={{alignSelf:'center'}}>Xóa</button>}
            </div>
          ))}
          <button type="button" onClick={addFeature} className="btn-secondary" style={{marginTop:'4px'}}>+ Thêm đặc điểm</button>
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Icon</label>
            <input type="text" value={form.icon || ''} onChange={e => setForm({...form, icon: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Thứ tự</label>
            <input type="number" value={form.order_index || 1} onChange={e => setForm({...form, order_index: parseInt(e.target.value)})} min={1} />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select value={form.status || 'active'} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ẩn</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Cập nhật'}</button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
