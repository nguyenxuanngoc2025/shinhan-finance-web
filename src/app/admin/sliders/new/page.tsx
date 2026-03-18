'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImagePicker from '../../components/ImagePicker'

export default function NewSliderPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    cta_text: '',
    cta_link: '/dang-ky-vay',
    order_index: 1,
    visible: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/cms/sliders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push('/admin/sliders')
    else setSaving(false)
  }

  return (
    <div>
      <h1>Thêm Slider mới</h1>
      <form onSubmit={handleSubmit} className="card form-layout">
        <div className="form-group">
          <label>Tiêu đề</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
        </div>
        <div className="form-group">
          <label>Ảnh nền slider</label>
          <ImagePicker
            value={form.image}
            onChange={(url) => setForm({...form, image: url})}
            label="Ảnh nền slider"
            placeholder="Chọn ảnh nền cho slider"
          />
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Text nút CTA</label>
            <input type="text" value={form.cta_text} onChange={e => setForm({...form, cta_text: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Link CTA</label>
            <input type="text" value={form.cta_link} onChange={e => setForm({...form, cta_link: e.target.value})} />
          </div>
        </div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group">
            <label>Thứ tự hiển thị</label>
            <input type="number" value={form.order_index} onChange={e => setForm({...form, order_index: parseInt(e.target.value)})} min={1} />
          </div>
          <div className="form-group">
            <label>Hiển thị</label>
            <select value={form.visible ? 'true' : 'false'} onChange={e => setForm({...form, visible: e.target.value === 'true'})}>
              <option value="true">Bật</option>
              <option value="false">Tắt</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Tạo slider'}</button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
