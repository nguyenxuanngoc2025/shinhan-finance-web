'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import RichEditor from '../../components/RichEditor'
import ImagePicker from '../../components/ImagePicker'
import SeoScorePanel from '../../components/SeoScorePanel'
import TocPreviewPanel from '../../components/TocPreviewPanel'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [categories, setCategories] = useState<{slug: string, label: string}[]>([])
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', cover_image: '',
    seo_image: '', category: '', tags: '', seo_title: '', seo_description: '', status: 'draft',
    published_at: ''
  })
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null)

  useEffect(() => {
    fetch(`/api/cms/posts/${params.id}`).then(r => r.json()).then(d => {
      if (d.data) {
        const p = d.data
        // Handle content: could be array (old format) or string (HTML)
        let content = ''
        if (typeof p.content === 'string') {
          content = p.content
        } else if (p.content && typeof p.content === 'object' && 'html' in p.content) {
          content = (p.content as any).html || ''
        } else if (Array.isArray(p.content) && p.content.length > 0) {
          content = p.content.map((c: any) => c.text || c.html || '').join('\n')
        }
        setForm({
          title: p.title || '', slug: p.slug || '', excerpt: p.excerpt || '',
          content, cover_image: p.cover_image || '', seo_image: p.seo_image || '',
          category: p.category || '', tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
          seo_title: p.seo_title || '', seo_description: p.seo_description || '',
          status: p.status || 'draft',
          published_at: p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : ''
        })
      }
    })

    fetch('/api/cms/categories').then(r => r.json()).then(d => {
      if (d.data) setCategories(d.data)
    }).finally(() => setLoading(false))
  }, [params.id])

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/cms/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          published_at: (form.status === 'published' || form.status === 'scheduled') && form.published_at 
            ? new Date(form.published_at).toISOString() 
            : form.status === 'published' 
              ? new Date().toISOString() 
              : null,
          tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [],
          content: form.content, // HTML string
        }),
      })
      if (res.ok) router.push('/admin/posts')
      else alert('Lỗi khi lưu')
    } finally {
      setSaving(false)
    }
  }

  // Auto Save
  useEffect(() => {
    if (loading || !form.title) return
    const timer = setTimeout(async () => {
      setAutoSaveStatus('saving')
      try {
        const res = await fetch(`/api/cms/posts/${params.id}`, {
          method: 'PUT',
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
        if (res.ok) {
          setAutoSaveStatus('saved')
          setLastSavedTime(new Date())
        } else {
          setAutoSaveStatus('error')
        }
      } catch (e) {
        setAutoSaveStatus('error')
      }
    }, 15000) // Auto save every 15s after user stops typing
    
    return () => {
      clearTimeout(timer)
      setAutoSaveStatus('idle')
    }
  }, [form, loading, params.id])

  async function handleDuplicate() {
    if (!confirm('Bạn có muốn nhân bản bài viết này?')) return
    setSaving(true)
    try {
      const res = await fetch('/api/cms/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          title: form.title + ' (Bản sao)',
          slug: form.slug + '-ban-sao-' + Date.now().toString().slice(-4),
          status: 'draft',
          published_at: null,
          tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [],
          content: form.content,
        })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.data?.id) {
          router.push(`/admin/posts/${data.data.id}`)
        } else {
          router.push('/admin/posts')
        }
      } else {
        alert('Có lỗi xảy ra khi nhân bản')
      }
    } finally {
      setSaving(false)
    }
  }


  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Đang tải bài viết...</div>

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
        .post-preview h2 { font-size: 22px; font-weight: 700; margin: 24px 0 12px; }
        .post-preview h3 { font-size: 18px; font-weight: 600; margin: 20px 0 10px; }
        .post-preview img { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; }
        .post-preview table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .post-preview table th, .post-preview table td { border: 1px solid #d1d5db; padding: 8px 12px; }
        .post-preview table th { background: #f3f4f6; font-weight: 600; }
        .post-preview blockquote { border-left: 3px solid #0078D4; padding: 8px 16px; background: #f8f9fb; margin: 12px 0; }
        .post-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
        .post-actions .btn-primary { padding: 10px 24px; }
        .post-actions .btn-secondary { padding: 10px 18px; }
        @media (max-width: 1024px) { .post-editor-layout { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: 0, marginBottom: 4 }}>Chỉnh sửa bài viết</h1>
          <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>
              {autoSaveStatus === 'saving' && 'Đang lưu tự động...'}
              {autoSaveStatus === 'saved' && lastSavedTime && `Đã lưu tự động lúc ${lastSavedTime.toLocaleTimeString('vi-VN')}`}
              {autoSaveStatus === 'error' && <span style={{color: '#dc2626'}}>Lỗi lưu tự động</span>}
            </span>
            <span>|</span>
            <span>{form.content ? form.content.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(w => w.length > 0).length : 0} từ</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button type="button" onClick={handleDuplicate} disabled={saving} className="btn-secondary" style={{ padding: '6px 14px' }}>
            <i className="fas fa-copy" style={{ marginRight: 6 }}></i> Nhân bản
          </button>
          <span className={`badge badge-${form.status === 'published' ? 'done' : form.status === 'scheduled' ? 'processing' : 'new'}`}>
            {form.status === 'published' ? 'Đã xuất bản' : form.status === 'scheduled' ? 'Hẹn giờ' : 'Bản nháp'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="post-editor-layout">
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
              <input value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="slug" />
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
                placeholder="Bắt đầu viết nội dung bài viết..."
              />
            ) : (
              <div className="post-section">
                <div className="post-preview" dangerouslySetInnerHTML={{ __html: form.content || '<p style="color:#9ca3af">Chưa có nội dung</p>' }} />
              </div>
            )}

            <div className="post-field" style={{ marginTop: 16 }}>
              <label>Tóm tắt (Excerpt)</label>
              <textarea value={form.excerpt} onChange={e => update('excerpt', e.target.value)} rows={3} placeholder="Mô tả ngắn gọn..." />
            </div>

            <div className="post-actions">
              <button type="button" className="btn-secondary" onClick={() => router.back()}>Hủy</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Cập nhật'}</button>
            </div>
          </div>

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
                    <option value="">— Chọn —</option>
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="post-field">
                  <label>Tags</label>
                  <input type="text" value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="vay, tài chính" />
                </div>
              </div>
            </div>

            {/* TOC Preview Panel */}
            <TocPreviewPanel content={form.content} />

            <div className="post-section">
              <div className="post-section-head">Ảnh đại diện</div>
              <div className="post-section-body">
                <ImagePicker
                  value={form.cover_image}
                  onChange={(url: string) => update('cover_image', url)}
                  label="Ảnh bìa"
                  placeholder="Chọn ảnh đại diện"
                />
              </div>
            </div>

            <div className="post-section">
              <div className="post-section-head">SEO</div>
              <div className="post-section-body">
                <div className="post-field">
                  <label>SEO Title</label>
                  <input type="text" value={form.seo_title} onChange={e => update('seo_title', e.target.value)} placeholder="Tiêu đề Google" />
                  <div style={{ fontSize: 11, color: form.seo_title.length > 60 ? '#dc2626' : '#9ca3af', marginTop: 4 }}>{form.seo_title.length}/60</div>
                </div>
                <div className="post-field">
                  <label>Meta Description</label>
                  <textarea value={form.seo_description} onChange={e => update('seo_description', e.target.value)} rows={3} placeholder="Mô tả Google" />
                  <div style={{ fontSize: 11, color: form.seo_description.length > 160 ? '#dc2626' : '#9ca3af', marginTop: 4 }}>{form.seo_description.length}/160</div>
                </div>
                <div className="post-field">
                  <label>Ảnh SEO (og:image)</label>
                  <ImagePicker
                    value={form.seo_image}
                    onChange={(url: string) => update('seo_image', url)}
                    label="Ảnh MXH"
                    placeholder="Ảnh khi share Facebook"
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
