'use client'

import { useState, useRef } from 'react'

type MediaItem = {
  id: string
  filename: string
  url: string
  alt_text: string
  mime_type: string
  size: number
}

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
}

export default function ImagePicker({ value, onChange, label = 'Ảnh', placeholder = 'Chọn hoặc upload ảnh' }: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'library' | 'upload'>('library')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    setOpen(true)
    fetchMedia()
  }

  function fetchMedia() {
    setLoading(true)
    fetch('/api/cms/media')
      .then(r => r.json())
      .then(res => { setFiles(res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  async function handleUpload(fileList: FileList | File[]) {
    const arr = Array.from(fileList)
    if (arr.length === 0) return
    setUploading(true)
    const formData = new FormData()
    arr.forEach(f => formData.append('files', f))
    try {
      const res = await fetch('/api/cms/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.data?.[0]?.url) {
        // Auto-select the first uploaded file
        onChange(data.data[0].url)
        setOpen(false)
      }
      fetchMedia()
    } catch {
      alert('Upload thất bại')
    } finally {
      setUploading(false)
    }
  }

  function selectImage(url: string) {
    onChange(url)
    setOpen(false)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  const filtered = search
    ? files.filter(f => f.filename.toLowerCase().includes(search.toLowerCase()))
    : files

  return (
    <>
      <style>{`
        .ip-trigger { display: flex; align-items: center; gap: 12px; border: 1px solid #d1d5db; border-radius: 10px; padding: 8px 12px; cursor: pointer; transition: all 0.2s; background: #fff; }
        .ip-trigger:hover { border-color: #0078D4; }
        .ip-preview { width: 56px; height: 56px; border-radius: 6px; object-fit: cover; background: #f3f4f6; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .ip-preview img { width: 100%; height: 100%; object-fit: cover; }
        .ip-preview-empty { font-size: 24px; opacity: 0.3; }
        .ip-info { flex: 1; min-width: 0; }
        .ip-label { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 2px; }
        .ip-value { font-size: 13px; color: #1a1a2e; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ip-value.empty { color: #9ca3af; font-style: italic; }
        .ip-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid #d1d5db; background: #f9fafb; font-size: 12px; font-weight: 600; color: #374151; cursor: pointer; white-space: nowrap; transition: all 0.15s; }
        .ip-btn:hover { border-color: #0078D4; color: #0078D4; background: #eff6ff; }
        .ip-clear { padding: 4px 8px; border: none; background: none; cursor: pointer; color: #9ca3af; font-size: 18px; }
        .ip-clear:hover { color: #dc2626; }

        .ip-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.15s; }
        .ip-modal { background: #fff; border-radius: 14px; width: 90vw; max-width: 760px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; }
        .ip-modal-header { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 12px; }
        .ip-modal-header h3 { font-size: 16px; font-weight: 700; color: #1a1a2e; margin: 0; }
        .ip-modal-close { margin-left: auto; width: 32px; height: 32px; border: none; background: #f3f4f6; border-radius: 8px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .ip-modal-close:hover { background: #fef2f2; color: #dc2626; }
        .ip-tabs { display: flex; border-bottom: 1px solid #e5e7eb; }
        .ip-tab { padding: 10px 20px; font-size: 13px; font-weight: 600; border: none; background: none; cursor: pointer; color: #6b7280; border-bottom: 2px solid transparent; transition: all 0.15s; }
        .ip-tab.active { color: #0078D4; border-bottom-color: #0078D4; }
        .ip-modal-body { flex: 1; overflow-y: auto; padding: 16px 20px; }

        .ip-search { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13px; margin-bottom: 12px; outline: none; }
        .ip-search:focus { border-color: #0078D4; }
        .ip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }
        .ip-grid-item { position: relative; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.15s; }
        .ip-grid-item:hover { border-color: #93c5fd; }
        .ip-grid-item img { width: 100%; height: 90px; object-fit: cover; display: block; }
        .ip-grid-item-name { padding: 3px 6px; font-size: 10px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; background: #f9fafb; }

        .ip-drop { border: 2px dashed #d1d5db; border-radius: 12px; padding: 50px 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .ip-drop.active { border-color: #0078D4; background: rgba(0,120,212,0.04); }
        .ip-drop-icon { font-size: 42px; margin-bottom: 8px; opacity: 0.4; }
        .ip-drop-text { font-size: 15px; color: #374151; font-weight: 500; }
        .ip-drop-sub { font-size: 12px; color: #9ca3af; margin-top: 4px; }

        .ip-uploading { display: flex; align-items: center; gap: 10px; padding: 20px; }
        .ip-spin { width: 18px; height: 18px; border: 2px solid rgba(0,120,212,0.3); border-top-color: #0078D4; border-radius: 50%; animation: spin 0.5s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Trigger button */}
      <div className="ip-trigger" onClick={openPicker}>
        <div className="ip-preview">
          {value ? <img src={value} alt="Preview" /> : <div className="ip-preview-empty"></div>}
        </div>
        <div className="ip-info">
          <div className="ip-label">{label}</div>
          <div className={`ip-value${!value ? ' empty' : ''}`}>
            {value ? value.split('/').pop() : placeholder}
          </div>
        </div>
        <button type="button" className="ip-btn" onClick={e => { e.stopPropagation(); openPicker() }}>
          {value ? 'Đổi ảnh' : 'Chọn ảnh'}
        </button>
        {value && (
          <button type="button" className="ip-clear" onClick={e => { e.stopPropagation(); onChange('') }} title="Xóa ảnh">×</button>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="ip-overlay" onClick={() => setOpen(false)}>
          <div className="ip-modal" onClick={e => e.stopPropagation()}>
            <div className="ip-modal-header">
              <h3>Chọn ảnh</h3>
              <button className="ip-modal-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="ip-tabs">
              <button className={`ip-tab${tab === 'library' ? ' active' : ''}`} onClick={() => setTab('library')}>
                📁 Thư viện ({files.length})
              </button>
              <button className={`ip-tab${tab === 'upload' ? ' active' : ''}`} onClick={() => setTab('upload')}>
                📤 Upload mới
              </button>
            </div>

            <div className="ip-modal-body">
              {tab === 'library' && (
                <>
                  <input
                    type="text"
                    className="ip-search"
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {loading ? (
                    <div className="ip-uploading"><div className="ip-spin" /> Đang tải...</div>
                  ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                      {search ? 'Không tìm thấy ảnh nào' : 'Thư viện trống — chuyển sang tab Upload'}
                    </div>
                  ) : (
                    <div className="ip-grid">
                      {filtered.map(f => (
                        <div key={f.id} className="ip-grid-item" onClick={() => selectImage(f.url)} title={f.filename}>
                          <img src={f.url} alt={f.alt_text || f.filename} loading="lazy" />
                          <div className="ip-grid-item-name">{f.filename}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === 'upload' && (
                <>
                  {uploading ? (
                    <div className="ip-uploading"><div className="ip-spin" /> Đang upload...</div>
                  ) : (
                    <div
                      className={`ip-drop${dragOver ? ' active' : ''}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="ip-drop-icon">📤</div>
                      <div className="ip-drop-text">Kéo thả hoặc click để chọn ảnh</div>
                      <div className="ip-drop-sub">JPEG, PNG, GIF, WebP, SVG — Tối đa 5MB</div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => { if (e.target.files) handleUpload(e.target.files); e.target.value = '' }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
