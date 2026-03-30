'use client'

import { useState, useEffect } from 'react'

type Category = {
  slug: string
  label: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Create / Edit modal state
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ slug: '', label: '' })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/cms/categories')
      .then(res => res.json())
      .then(d => {
        if (d.data) setCategories(d.data)
      })
      .finally(() => setLoading(false))
  }, [])

  async function saveToServer(newCategories: Category[]) {
    setSaving(true)
    try {
      const res = await fetch('/api/cms/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: newCategories })
      })
      if (res.ok) {
        setCategories(newCategories)
      } else {
        alert('Lỗi khi lưu danh mục')
      }
    } catch {
      alert('Lỗi khi lưu danh mục')
    } finally {
      setSaving(false)
    }
  }

  function handleAdd() {
    setForm({ slug: '', label: '' })
    setEditingIndex(null)
    setShowModal(true)
  }

  function handleEdit(index: number) {
    setForm({ ...categories[index] })
    setEditingIndex(index)
    setShowModal(true)
  }

  function handleDelete(index: number) {
    if (!confirm('Bạn có chắc xoá danh mục này? Các bài viết cũ dùng danh mục này sẽ hiển thị id thay vì tên.')) return
    const newCategories = [...categories]
    newCategories.splice(index, 1)
    saveToServer(newCategories)
  }

  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault()
    if (!form.label || !form.slug) return
    
    // Auto format slug if user entered spaces
    const cleanSlug = form.slug.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '')
    const newCat = { label: form.label, slug: cleanSlug }
    const newCategories = [...categories]

    if (editingIndex !== null) {
      newCategories[editingIndex] = newCat
    } else {
      // Check duplicated slug
      if (categories.find(c => c.slug === cleanSlug)) {
        alert('Slug này đã tồn tại!')
        return
      }
      newCategories.push(newCat)
    }

    saveToServer(newCategories)
    setShowModal(false)
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <style>{`
        .cat-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .cat-table th, .cat-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .cat-table th { background: #f9fafb; font-weight: 600; color: #374151; font-size: 14px; }
        .cat-table td { font-size: 14px; color: #111827; }
        .cat-actions button { background: transparent; border: none; cursor: pointer; color: #0078D4; margin-right: 12px; font-weight: 500; font-size: 13px; }
        .cat-actions button.del { color: #dc2626; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #fff; padding: 24px; border-radius: 12px; width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .modal h2 { margin-top: 0; margin-bottom: 20px; font-size: 18px; color: #111; }
        .input-group { margin-bottom: 16px; }
        .input-group label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: #374151; }
        .input-group input { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Danh mục bài viết</h1>
        <button className="btn-primary" onClick={handleAdd}>+ Thêm danh mục</button>
      </div>

      <table className="cat-table">
        <thead>
          <tr>
            <th>Tên danh mục</th>
            <th>Đường dẫn (Slug)</th>
            <th style={{ width: 150 }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 30, color: '#6b7280' }}>Chưa có danh mục.</td></tr>
          ) : categories.map((cat, i) => (
            <tr key={cat.slug}>
              <td style={{ fontWeight: 500 }}>{cat.label}</td>
              <td style={{ color: '#6b7280' }}>{cat.slug}</td>
              <td className="cat-actions">
                <button onClick={() => handleEdit(i)}>Sửa</button>
                <button className="del" onClick={() => handleDelete(i)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingIndex !== null ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={handleSaveForm}>
              <div className="input-group">
                <label>Tên danh mục</label>
                <input required autoFocus value={form.label} onChange={e => {
                  const val = e.target.value;
                  setForm(prev => {
                    // Auto-fill slug if it's currently empty and we are adding new
                    if (editingIndex === null && prev.slug === '') {
                      const autoSlug = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                      return { label: val, slug: autoSlug }
                    }
                    return { ...prev, label: val }
                  })
                }} placeholder="VD: Khuyến mãi" />
              </div>
              <div className="input-group">
                <label>Đường dẫn (Slug)</label>
                <input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="VD: khuyen-mai" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
