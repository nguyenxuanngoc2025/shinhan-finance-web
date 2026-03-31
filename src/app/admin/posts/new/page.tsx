'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichEditor from '../../components/RichEditor'
import ImagePicker from '../../components/ImagePicker'
import SeoScorePanel from '../../components/SeoScorePanel'
import TocPreviewPanel from '../../components/TocPreviewPanel'

export default function NewPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [categories, setCategories] = useState<{slug: string, label: string}[]>([])
  
  useEffect(() => {
    fetch('/api/cms/categories').then(r => r.json()).then(d => {
      if (d.data) setCategories(d.data)
    })
  }, [])

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    seo_image: '',
    category: '',
    tags: '',
    seo_title: '',
    seo_description: '',
    status: 'draft',
    published_at: ''
  })

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function update(key: string, value: string) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && !prev.slug) {
        next.slug = autoSlug(value)
      }
      if (key === 'title' && !prev.seo_title) {
        next.seo_title = value
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/cms/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          published_at: (form.status === 'published' || form.status === 'scheduled') && form.published_at 
            ? new Date(form.published_at).toISOString() 
            : form.status === 'published' 
              ? new Date().toISOString() 
              : null,
          tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [],
          content: form.content,
        }),
      })
      if (res.ok) router.push('/admin/posts')
      else alert('Lỗi khi lưu bài viết')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{`
        .post-editor-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
        .post-main { min-width: 0; }
        .post-sidebar { display: flex; flex-direction: column; gap: 16px; }
        .post-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
        .post-section-head { padding: 12px 16px; font-size: 13px; font-weight: 700; color: #1a1a2e; border-bottom: 1px solid #f3f4f6; background: #fafbfc; }
        .post-section-body { padding: 12px 16px; }
        .post-field { margin-bottom: 12px; }
        .post-field:last-child { margin-bottom: 0; }
        .post-field label { font-size: 12px; font-weight: 600; color: #4b5563; display: block; margin-bottom: 4px; }
        .post-field input, .post-field textarea, .post-field select { width: 100%; padding: 7px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; outline: none; font-family: inherit; }
        .post-field input:focus, .post-field textarea:focus, .post-field select:focus { border-color: #0078D4; }
        .post-tabs { display: flex; gap: 0; margin-bottom: 12px; background: #f3f4f6; border-radius: 8px; padding: 3px; }
        .post-tab { flex: 1; padding: 7px; border: none; background: transparent; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; color: #6b7280; transition: all 0.15s; }
        .post-tab.active { background: #fff; color: #0078D4; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .post-title-input { width: 100%; padding: 12px 0; border: none; outline: none; font-size: 24px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; font-family: inherit; }
        .post-title-input::placeholder { color: #d1d5db; }
        .post-slug { font-size: 12px; color: #9ca3af; margin-bottom: 16px; display: flex; align-items: center; gap: 4px; }
        .post-slug input { border: none; outline: none; font-size: 12px; color: #6b7280; background: transparent; padding: 0; flex: 1; }
        .post-preview { padding: 20px; min-height: 400px; font-size: 15px; line-height: 1.75; color: #1a1a2e; }
        .post-preview h1 { font-size: 28px; font-weight: 800; margin: 28px 0 14px; line-height: 1.3; }
        .post-preview h2 { font-size: 22px; font-weight: 700; margin: 24px 0 12px; }
        .post-preview h3 { font-size: 18px; font-weight: 600; margin: 20px 0 10px; }
        .post-preview h4 { font-size: 15px; font-weight: 600; margin: 16px 0 8px; color: #4b5563; }
        .post-preview img { max-width: 100%; height: auto; border-radius: 8px; }
        .post-preview figure { max-width: 100%; }
        .post-preview figcaption { font-size: 12px; color: #6b7280; text-align: center; margin-top: 4px; font-style: italic; }
        .post-preview table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .post-preview table th, .post-preview table td { border: 1px solid #d1d5db; padding: 8px 12px; }
        .post-preview table th { background: #f3f4f6; font-weight: 600; }
        .post-preview blockquote { border-left: 3px solid #0078D4; padding: 8px 16px; background: #f8f9fb; margin: 12px 0; }
        .post-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
        .post-actions .btn-primary { padding: 10px 24px; }
        .post-actions .btn-secondary { padding: 10px 18px; }
        .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .badge-new { background: #e5e7eb; color: #374151; }
        .badge-processing { background: #fef3c7; color: #92400e; }
        .badge-done { background: #dcfce7; color: #166534; }
        @media (max-width: 1024px) { .post-editor-layout { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: 0, marginBottom: 4 }}>Thêm bài viết mới</h1>
          <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>{form.content ? form.content.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(w => w.length > 0).length : 0} từ</span>
          </div>
        </div>
        <span className={`badge badge-${form.status === 'published' ? 'done' : form.status === 'scheduled' ? 'processing' : 'new'}`}>
          {form.status === 'published' ? 'Đã xuất bản' : form.status === 'scheduled' ? 'Hẹn giờ' : 'Bản nháp'}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="post-editor-layout">
          {/* Main content area */}
          <div className="post-main">
            <input
              type="text"
              className="post-title-input"
              placeholder="Tiêu đề bài viết..."
              value={form.title}
              onChange={e => update('title', e.target.value)}
              required
            />
            <div className="post-slug">
              <span>🔗</span>
              <span>/tin-tuc/</span>
              <input
                value={form.slug}
                onChange={e => update('slug', e.target.value)}
                placeholder="slug-tu-dong"
              />
            </div>

            <div className="post-tabs">
              <button type="button" className={`post-tab${tab === 'edit' ? ' active' : ''}`} onClick={() => setTab('edit')}>
                Soạn thảo
              </button>
              <button type="button" className={`post-tab${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')}>
                Xem trước
              </button>
            </div>

            {tab === 'edit' ? (
              <RichEditor
                value={form.content}
                onChange={val => update('content', val)}
                placeholder="Bắt đầu viết nội dung bài viết... Dùng nút 'Chèn ảnh' trên toolbar để thêm ảnh với tùy chỉnh vị trí và kích thước."
              />
            ) : (
              <div className="post-section">
                <div className="post-preview" dangerouslySetInnerHTML={{ __html: form.content || '<p style="color:#9ca3af">Chưa có nội dung</p>' }} />
              </div>
            )}

            <div className="post-field" style={{ marginTop: 16 }}>
              <label>Tóm tắt (Excerpt)</label>
              <textarea value={form.excerpt} onChange={e => update('excerpt', e.target.value)} rows={3} placeholder="Mô tả ngắn gọn hiển thị trên danh sách bài viết..." />
            </div>

            <div className="post-actions">
              <button type="button" className="btn-secondary" onClick={() => router.back()}>Hủy</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu bài viết'}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="post-sidebar">
            <div className="post-section">
              <div className="post-section-head">Xuất bản</div>
              <div className="post-section-body">
                <div className="post-field">
                  <label>Trạng thái</label>
                  <select value={form.status} onChange={e => {
                    const newStatus = e.target.value;
                    let newPubTime = form.published_at;
                    if (newStatus === 'scheduled' && !newPubTime) {
                      newPubTime = new Date().toISOString().slice(0, 16);
                    }
                    setForm(prev => ({...prev, status: newStatus, published_at: newPubTime}))
                  }}>
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                    <option value="scheduled">Hẹn giờ</option>
                  </select>
                </div>
                {form.status === 'scheduled' && (
                  <div className="post-field" style={{ marginTop: 12 }}>
                    <label>Thời gian hẹn giờ</label>
                    <input 
                      type="datetime-local" 
                      value={form.published_at} 
                      onChange={e => update('published_at', e.target.value)}
                      required={form.status === 'scheduled'}
                    />
                  </div>
                )}
                <div className="post-field" style={{ marginTop: 16 }}>
                  <label>Danh mục</label>
                  <select value={form.category} onChange={e => update('category', e.target.value)}>
                    <option value="">— Chọn danh mục —</option>
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="post-field">
                  <label>Tags (phân cách bởi dấu phẩy)</label>
                  <input type="text" value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="vay, tài chính, ưu đãi" />
                </div>
              </div>
            </div>

            {/* TOC Preview Panel - hiển thị mục lục live */}
            <TocPreviewPanel content={form.content} />

            <div className="post-section">
              <div className="post-section-head">Ảnh đại diện</div>
              <div className="post-section-body">
                <ImagePicker
                  value={form.cover_image}
                  onChange={(url: string) => update('cover_image', url)}
                  label="Ảnh bìa bài viết"
                  placeholder="Chọn ảnh đại diện"
                />
              </div>
            </div>

            <div className="post-section">
              <div className="post-section-head">SEO</div>
              <div className="post-section-body">
                <div className="post-field">
                  <label>SEO Title</label>
                  <input type="text" value={form.seo_title} onChange={e => update('seo_title', e.target.value)} placeholder="Tiêu đề hiển thị trên Google" />
                  <div style={{ fontSize: 11, color: form.seo_title.length > 60 ? '#dc2626' : '#9ca3af', marginTop: 4 }}>{form.seo_title.length}/60</div>
                </div>
                <div className="post-field">
                  <label>Meta Description</label>
                  <textarea value={form.seo_description} onChange={e => update('seo_description', e.target.value)} rows={3} placeholder="Mô tả hiển thị trên kết quả tìm kiếm" />
                  <div style={{ fontSize: 11, color: form.seo_description.length > 160 ? '#dc2626' : '#9ca3af', marginTop: 4 }}>{form.seo_description.length}/160</div>
                </div>
                <div className="post-field">
                  <label>Ảnh SEO (og:image)</label>
                  <ImagePicker
                    value={form.seo_image}
                    onChange={(url: string) => update('seo_image', url)}
                    label="Ảnh chia sẻ MXH"
                    placeholder="Ảnh khi share Facebook/Zalo"
                  />
                </div>
              </div>
            </div>

            <SeoScorePanel
              title={form.title}
              slug={form.slug}
              excerpt={form.excerpt}
              content={form.content}
              seoTitle={form.seo_title}
              seoDescription={form.seo_description}
              coverImage={form.cover_image}
            />
          </div>
        </div>
      </form>
    </>
  )
}
