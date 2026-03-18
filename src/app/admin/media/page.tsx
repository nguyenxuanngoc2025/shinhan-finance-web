'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type MediaItem = {
  id: string
  filename: string
  url: string
  alt_text: string
  mime_type: string
  size: number
  created_at: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [search, setSearch] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [altEdit, setAltEdit] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = useCallback(() => {
    setLoading(true)
    fetch('/api/cms/media')
      .then(r => r.json())
      .then(res => { setFiles(res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  async function handleUpload(fileList: FileList | File[]) {
    const arr = Array.from(fileList)
    if (arr.length === 0) return

    setUploading(true)
    setUploadProgress(`Đang upload ${arr.length} file...`)

    const formData = new FormData()
    arr.forEach(f => formData.append('files', f))

    try {
      const res = await fetch('/api/cms/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.errors?.length) {
        alert(`Upload xong ${data.uploaded}/${data.total} file.\n\nLỗi:\n${data.errors.join('\n')}`)
      }
      fetchMedia()
    } catch {
      alert('Upload thất bại')
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  async function handleDelete(id: string) {
    if (!confirm('Xóa ảnh này khỏi thư viện?')) return
    await fetch(`/api/cms/media?id=${id}`, { method: 'DELETE' })
    setSelected(null)
    fetchMedia()
  }

  async function handleAltSave(id: string) {
    await fetch('/api/cms/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, alt_text: altEdit }),
    })
    fetchMedia()
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filtered = search
    ? files.filter(f => f.filename.toLowerCase().includes(search.toLowerCase()) || f.alt_text?.toLowerCase().includes(search.toLowerCase()))
    : files

  return (
    <>
      <style>{`
        .media-page { display: flex; gap: 0; height: calc(100vh - 120px); }
        .media-main { flex: 1; overflow-y: auto; padding: 0; }
        .media-sidebar { width: 320px; border-left: 1px solid #e5e7eb; background: #fafbfc; padding: 20px; overflow-y: auto; flex-shrink: 0; }
        .media-topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .media-topbar h1 { font-size: 20px; font-weight: 700; color: #1a1a2e; margin: 0; }
        .media-search { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; width: 220px; outline: none; transition: border 0.2s; }
        .media-search:focus { border-color: #0078D4; box-shadow: 0 0 0 2px rgba(0,120,212,0.1); }
        .upload-btn { background: #0078D4; color: #fff; border: none; padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .upload-btn:hover { background: #006cc0; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,120,212,0.3); }
        .upload-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }

        .drop-zone { border: 2px dashed #d1d5db; border-radius: 12px; padding: 40px; text-align: center; transition: all 0.2s; margin-bottom: 20px; }
        .drop-zone.active { border-color: #0078D4; background: rgba(0,120,212,0.04); }
        .drop-zone-icon { font-size: 42px; margin-bottom: 8px; opacity: 0.5; }
        .drop-zone-text { font-size: 15px; color: #4b5563; font-weight: 500; }
        .drop-zone-sub { font-size: 12px; color: #9ca3af; margin-top: 4px; }

        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
        .media-item { position: relative; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.15s; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .media-item:hover { border-color: #93c5fd; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .media-item.selected { border-color: #0078D4; box-shadow: 0 0 0 2px rgba(0,120,212,0.2); }
        .media-item img { width: 100%; height: 120px; object-fit: cover; display: block; }
        .media-item-name { padding: 6px 8px; font-size: 11px; color: #4b5563; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .media-item-check { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: #0078D4; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; opacity: 0; transition: opacity 0.15s; }
        .media-item.selected .media-item-check { opacity: 1; }

        .sidebar-preview { width: 100%; aspect-ratio: 4/3; object-fit: contain; border-radius: 8px; background: #f3f4f6; margin-bottom: 16px; }
        .sidebar-title { font-size: 15px; font-weight: 600; color: #1a1a2e; word-break: break-word; margin-bottom: 12px; }
        .sidebar-meta { font-size: 12px; color: #6b7280; margin-bottom: 20px; line-height: 1.8; }
        .sidebar-meta strong { color: #374151; }
        .sidebar-field { margin-bottom: 12px; }
        .sidebar-field label { font-size: 12px; font-weight: 600; color: #4b5563; display: block; margin-bottom: 4px; }
        .sidebar-field input { width: 100%; padding: 7px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; outline: none; }
        .sidebar-field input:focus { border-color: #0078D4; }
        .sidebar-url { font-size: 12px; padding: 8px 10px; background: #f3f4f6; border-radius: 6px; word-break: break-all; color: #4b5563; margin-bottom: 12px; }
        .sidebar-actions { display: flex; gap: 8px; margin-top: 16px; }
        .btn-copy { flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; font-size: 13px; cursor: pointer; font-weight: 500; transition: all 0.15s; }
        .btn-copy:hover { border-color: #0078D4; color: #0078D4; }
        .btn-copy.copied { background: #dcfce7; border-color: #22c55e; color: #16a34a; }
        .btn-del { padding: 8px 12px; border: 1px solid #fca5a5; border-radius: 6px; background: #fff; color: #dc2626; font-size: 13px; cursor: pointer; font-weight: 500; transition: all 0.15s; }
        .btn-del:hover { background: #fef2f2; }

        .upload-progress { background: rgba(0,120,212,0.08); border: 1px solid rgba(0,120,212,0.2); border-radius: 8px; padding: 12px 16px; color: #0078D4; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .upload-spinner { width: 16px; height: 16px; border: 2px solid rgba(0,120,212,0.3); border-top-color: #0078D4; border-radius: 50%; animation: spin 0.5s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-media { text-align: center; padding: 60px 20px; color: #9ca3af; }
        .empty-media-icon { font-size: 54px; margin-bottom: 16px; opacity: 0.4; }
        .empty-media h3 { font-size: 18px; color: #6b7280; margin-bottom: 8px; }
        .empty-media p { font-size: 14px; }

        @media (max-width: 900px) {
          .media-page { flex-direction: column; height: auto; }
          .media-sidebar { width: 100%; border-left: none; border-top: 1px solid #e5e7eb; }
        }
      `}</style>

      <div className="media-topbar">
        <h1>Thư viện ảnh</h1>
        <div style={{ flex: 1 }} />
        <input
          type="text"
          className="media-search"
          placeholder="Tìm kiếm ảnh..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="upload-btn" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload ảnh
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files) handleUpload(e.target.files); e.target.value = '' }}
        />
      </div>

      <div className="media-page">
        <div className="media-main">
          {uploading && (
            <div className="upload-progress">
              <div className="upload-spinner" />
              {uploadProgress}
            </div>
          )}

          {/* Drop zone */}
          <div
            className={`drop-zone${dragOver ? ' active' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <div className="drop-zone-icon">📤</div>
            <div className="drop-zone-text">Kéo thả ảnh vào đây để upload</div>
            <div className="drop-zone-sub">JPEG, PNG, GIF, WebP, SVG — Tối đa 5MB/file</div>
          </div>

          {loading ? (
            <div className="empty-media"><div className="upload-spinner" style={{ margin: '0 auto' }} /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-media">
              <div className="empty-media-icon"></div>
              <h3>{search ? 'Không tìm thấy ảnh nào' : 'Thư viện trống'}</h3>
              <p>{search ? 'Thử tìm kiếm từ khóa khác' : 'Upload ảnh đầu tiên bằng cách kéo thả hoặc nhấn nút Upload'}</p>
            </div>
          ) : (
            <div className="media-grid">
              {filtered.map(f => (
                <div
                  key={f.id}
                  className={`media-item${selected?.id === f.id ? ' selected' : ''}`}
                  onClick={() => { setSelected(f); setAltEdit(f.alt_text || '') }}
                >
                  <img src={f.url} alt={f.alt_text || f.filename} loading="lazy" />
                  <div className="media-item-name">{f.filename}</div>
                  <div className="media-item-check">✓</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail sidebar */}
        {selected && (
          <div className="media-sidebar">
            <img src={selected.url} alt={selected.alt_text} className="sidebar-preview" />
            <div className="sidebar-title">{selected.filename}</div>
            <div className="sidebar-meta">
              <strong>Loại:</strong> {selected.mime_type}<br />
              <strong>Kích thước:</strong> {formatSize(selected.size)}<br />
              <strong>Upload:</strong> {formatDate(selected.created_at)}
            </div>

            <div className="sidebar-field">
              <label>Alt Text</label>
              <input
                value={altEdit}
                onChange={e => setAltEdit(e.target.value)}
                onBlur={() => handleAltSave(selected.id)}
                placeholder="Mô tả ảnh cho SEO..."
              />
            </div>

            <div className="sidebar-field">
              <label>URL</label>
              <div className="sidebar-url">{selected.url}</div>
            </div>

            <div className="sidebar-actions">
              <button className={`btn-copy${copied ? ' copied' : ''}`} onClick={() => copyUrl(selected.url)}>
                {copied ? 'Đã copy' : 'Copy URL'}
              </button>
              <button className="btn-del" onClick={() => handleDelete(selected.id)}>
                Xóa
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
