'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

type MediaItem = {
  id: string
  filename: string
  url: string
  alt_text: string
  mime_type: string
  size: number
  created_at?: string
}

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  /** Compact mode: smaller trigger, no label row */
  compact?: boolean
  /** Aspect ratio hint for preview */
  aspect?: 'square' | 'wide' | 'logo'
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1e6) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1e6).toFixed(1)} MB`
}

export default function ImagePicker({
  value,
  onChange,
  label = 'Ảnh',
  placeholder = 'Chọn hoặc upload ảnh',
  compact = false,
  aspect = 'square',
}: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [search, setSearch] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [selectedPreview, setSelectedPreview] = useState<MediaItem | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const fetchMedia = useCallback(() => {
    setLoading(true)
    fetch('/api/cms/media')
      .then(r => r.json())
      .then(res => { setFiles(res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function openPicker() {
    setOpen(true)
    setSearch('')
    setSelectedPreview(null)
    setShowUrlInput(false)
    setUrlInput('')
    fetchMedia()
  }

  async function handleUpload(fileList: FileList | File[]) {
    const arr = Array.from(fileList)
    if (arr.length === 0) return

    // Quick validation
    const oversized = arr.find(f => f.size > 5 * 1024 * 1024)
    if (oversized) {
      alert(`Ảnh "${oversized.name}" vượt quá 5MB`)
      return
    }

    setUploading(true)
    setUploadProgress(`Đang tải ${arr.length} ảnh...`)
    const formData = new FormData()
    arr.forEach(f => formData.append('files', f))
    try {
      const res = await fetch('/api/cms/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.errors?.length) {
        alert(`Lỗi: ${data.errors.join('\n')}`)
      }
      if (data.data?.[0]?.url) {
        onChange(data.data[0].url)
        setOpen(false)
      }
      fetchMedia()
    } catch {
      alert('Upload thất bại. Vui lòng thử lại.')
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  function selectImage(item: MediaItem) {
    onChange(item.url)
    setOpen(false)
  }

  function applyUrl() {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setOpen(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const filtered = search
    ? files.filter(f => f.filename.toLowerCase().includes(search.toLowerCase()) || f.url.toLowerCase().includes(search.toLowerCase()))
    : files

  // Aspect-based preview sizing
  const previewStyles: Record<string, React.CSSProperties> = {
    square: { width: 64, height: 64, borderRadius: 8 },
    wide: { width: 120, height: 64, borderRadius: 8 },
    logo: { width: 100, height: 48, borderRadius: 6 },
  }

  const triggerPreviewStyle = previewStyles[aspect] || previewStyles.square

  return (
    <>
      <style>{`
        /* ===== TRIGGER ===== */
        .imgp-trigger {
          display: flex; align-items: center; gap: 14px;
          border: 1.5px dashed #d1d5db; border-radius: 12px;
          padding: 10px 14px; cursor: pointer;
          transition: all 0.2s ease;
          background: #fafbfc;
          position: relative;
        }
        .imgp-trigger:hover { border-color: #0078D4; background: #f0f7ff; }
        .imgp-trigger.has-value { border-style: solid; border-color: #e0e5ec; background: #fff; }
        .imgp-trigger.compact { padding: 6px 10px; gap: 10px; }

        .imgp-preview {
          flex-shrink: 0; background: #f0f1f3;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; position: relative;
        }
        .imgp-preview img { width: 100%; height: 100%; object-fit: contain; }
        .imgp-empty-icon { color: #bfc5cf; font-size: 22px; }

        .imgp-info { flex: 1; min-width: 0; }
        .imgp-label { font-size: 11px; font-weight: 600; color: #8b95a5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        .imgp-val { font-size: 13px; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
        .imgp-val.empty { color: #a3aebf; font-weight: 400; font-style: italic; }

        .imgp-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
        .imgp-btn {
          padding: 5px 12px; border-radius: 6px;
          border: 1px solid #dde1e8; background: #fff;
          font-size: 12px; font-weight: 600; color: #4b5563;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
        }
        .imgp-btn:hover { border-color: #0078D4; color: #0078D4; background: #eff8ff; }
        .imgp-btn-clear {
          width: 26px; height: 26px; border-radius: 50%;
          border: none; background: #fee2e2; color: #dc2626;
          cursor: pointer; font-size: 13px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; opacity: 0.7;
        }
        .imgp-btn-clear:hover { opacity: 1; background: #fecaca; transform: scale(1.1); }

        /* ===== MODAL ===== */
        .imgp-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.55);
          z-index: 10000; display: flex; align-items: center; justify-content: center;
          animation: imgpFadeIn 0.15s ease;
          backdrop-filter: blur(4px);
        }
        .imgp-modal {
          background: #fff; border-radius: 16px;
          width: 92vw; max-width: 700px; max-height: 82vh;
          display: flex; flex-direction: column;
          box-shadow: 0 24px 80px rgba(0,0,0,0.25);
          animation: imgpSlideUp 0.2s ease;
        }

        /* Header */
        .imgp-header {
          padding: 16px 20px; display: flex; align-items: center; gap: 12px;
          border-bottom: 1px solid #f0f1f3;
        }
        .imgp-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; flex: 1; }
        .imgp-header-close {
          width: 32px; height: 32px; border-radius: 8px;
          border: none; background: #f1f5f9; color: #64748b;
          cursor: pointer; font-size: 18px; font-weight: 500;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .imgp-header-close:hover { background: #fee2e2; color: #dc2626; }

        /* Drop zone */
        .imgp-dropzone {
          margin: 16px 20px 0; padding: 24px 16px;
          border: 2px dashed #d4dae5; border-radius: 12px;
          text-align: center; cursor: pointer;
          transition: all 0.2s; background: #fafbfc;
        }
        .imgp-dropzone:hover, .imgp-dropzone.active {
          border-color: #0078D4; background: #f0f7ff;
        }
        .imgp-dropzone-row {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          flex-wrap: wrap;
        }
        .imgp-drop-icon { font-size: 30px; opacity: 0.35; }
        .imgp-drop-text { font-size: 14px; color: #4b5563; font-weight: 500; }
        .imgp-drop-text strong { color: #0078D4; cursor: pointer; }
        .imgp-drop-text strong:hover { text-decoration: underline; }
        .imgp-drop-hint { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .imgp-drop-or {
          font-size: 11px; color: #b0b8c9; font-weight: 600; text-transform: uppercase;
          padding: 4px 10px; background: #f1f5f9; border-radius: 20px;
        }
        .imgp-url-toggle {
          border: none; background: none; color: #0078D4; font-size: 12px;
          font-weight: 600; cursor: pointer; padding: 4px 0; text-decoration: underline;
        }

        /* URL input */
        .imgp-url-row {
          display: flex; gap: 8px; margin: 12px 20px 0;
        }
        .imgp-url-input {
          flex: 1; padding: 8px 12px; border: 1.5px solid #d4dae5; border-radius: 8px;
          font-size: 13px; outline: none; transition: border-color 0.15s;
        }
        .imgp-url-input:focus { border-color: #0078D4; }
        .imgp-url-apply {
          padding: 8px 16px; border-radius: 8px; border: none;
          background: #0078D4; color: #fff; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.15s; white-space: nowrap;
        }
        .imgp-url-apply:hover { background: #0063b1; }

        /* Search + Library */
        .imgp-search-row { padding: 12px 20px 0; }
        .imgp-search {
          width: 100%; padding: 9px 14px 9px 36px;
          border: 1.5px solid #e2e6ed; border-radius: 8px;
          font-size: 13px; outline: none; transition: border-color 0.15s;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E") no-repeat 10px center / 16px;
        }
        .imgp-search:focus { border-color: #0078D4; }

        .imgp-body { flex: 1; overflow-y: auto; padding: 12px 20px 20px; }
        .imgp-count { font-size: 11px; color: #9ca3af; margin-bottom: 8px; font-weight: 500; }

        .imgp-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 10px;
        }
        .imgp-item {
          position: relative; border-radius: 10px; overflow: hidden;
          cursor: pointer; border: 2.5px solid transparent;
          transition: all 0.15s; background: #f8f9fa;
        }
        .imgp-item:hover { border-color: #93c5fd; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .imgp-item.selected { border-color: #0078D4; }
        .imgp-item img { width: 100%; height: 88px; object-fit: cover; display: block; }
        .imgp-item-name {
          padding: 4px 8px; font-size: 10px; color: #6b7280;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          background: #f9fafb; border-top: 1px solid #f0f1f3;
        }
        .imgp-item-check {
          position: absolute; top: 6px; right: 6px;
          width: 22px; height: 22px; border-radius: 50%;
          background: #0078D4; color: #fff;
          font-size: 12px; font-weight: 700;
          display: none; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,120,212,0.4);
        }
        .imgp-item.selected .imgp-item-check { display: flex; }

        .imgp-empty {
          text-align: center; padding: 40px 20px; color: #9ca3af; font-size: 13px;
        }
        .imgp-empty-icon { font-size: 36px; opacity: 0.3; margin-bottom: 8px; }

        /* Uploading */
        .imgp-upload-bar {
          margin: 12px 20px; padding: 14px 16px;
          background: #f0f7ff; border-radius: 10px;
          display: flex; align-items: center; gap: 12px;
          border: 1px solid #bfdbfe;
        }
        .imgp-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(0,120,212,0.2);
          border-top-color: #0078D4; border-radius: 50%;
          animation: imgpSpin 0.5s linear infinite; flex-shrink: 0;
        }
        .imgp-upload-text { font-size: 13px; color: #1e40af; font-weight: 500; }

        /* Footer */
        .imgp-footer {
          padding: 12px 20px; border-top: 1px solid #f0f1f3;
          display: flex; justify-content: space-between; align-items: center;
        }
        .imgp-footer-hint { font-size: 11px; color: #9ca3af; }
        .imgp-footer-btn {
          padding: 8px 20px; border-radius: 8px;
          border: none; background: #0078D4; color: #fff;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: background 0.15s;
        }
        .imgp-footer-btn:hover { background: #005ea6; }
        .imgp-footer-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @keyframes imgpFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes imgpSlideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes imgpSpin { to { transform: rotate(360deg) } }

        @media (max-width: 640px) {
          .imgp-modal { width: 98vw; max-height: 90vh; border-radius: 12px; }
          .imgp-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 6px; }
          .imgp-item img { height: 70px; }
        }
      `}</style>

      {/* ===== TRIGGER BUTTON ===== */}
      <div
        className={`imgp-trigger${value ? ' has-value' : ''}${compact ? ' compact' : ''}`}
        onClick={openPicker}
      >
        <div className="imgp-preview" style={triggerPreviewStyle}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" />
          ) : (
            <span className="imgp-empty-icon">🖼️</span>
          )}
        </div>
        <div className="imgp-info">
          {!compact && <div className="imgp-label">{label}</div>}
          <div className={`imgp-val${!value ? ' empty' : ''}`}>
            {value ? value.split('/').pop() : placeholder}
          </div>
        </div>
        <div className="imgp-actions">
          <button type="button" className="imgp-btn" onClick={e => { e.stopPropagation(); openPicker() }}>
            {value ? '✏️ Đổi' : '📎 Chọn'}
          </button>
          {value && (
            <button
              type="button" className="imgp-btn-clear"
              onClick={e => { e.stopPropagation(); onChange('') }}
              title="Xóa ảnh"
            >✕</button>
          )}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {open && (
        <div className="imgp-overlay" onClick={() => setOpen(false)}>
          <div className="imgp-modal" ref={modalRef} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="imgp-header">
              <h3>📁 Chọn ảnh</h3>
              <button className="imgp-header-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Drop zone + Upload */}
            <div
              className={`imgp-dropzone${dragOver ? ' active' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="imgp-dropzone-row">
                <span className="imgp-drop-icon">📤</span>
                <div>
                  <div className="imgp-drop-text">
                    Kéo thả ảnh vào đây hoặc <strong>click để chọn file</strong>
                  </div>
                  <div className="imgp-drop-hint">JPEG, PNG, GIF, WebP, SVG — tối đa 5MB</div>
                </div>
                <span className="imgp-drop-or">hoặc</span>
                <button
                  type="button"
                  className="imgp-url-toggle"
                  onClick={e => { e.stopPropagation(); setShowUrlInput(!showUrlInput) }}
                >
                  {showUrlInput ? 'Ẩn' : 'Nhập URL'}
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files) handleUpload(e.target.files); e.target.value = '' }}
            />

            {/* URL input */}
            {showUrlInput && (
              <div className="imgp-url-row">
                <input
                  type="text"
                  className="imgp-url-input"
                  placeholder="https://example.com/image.png"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') applyUrl() }}
                  autoFocus
                />
                <button type="button" className="imgp-url-apply" onClick={applyUrl}>
                  Áp dụng
                </button>
              </div>
            )}

            {/* Upload progress */}
            {uploading && (
              <div className="imgp-upload-bar">
                <div className="imgp-spinner" />
                <span className="imgp-upload-text">{uploadProgress}</span>
              </div>
            )}

            {/* Search */}
            <div className="imgp-search-row">
              <input
                type="text"
                className="imgp-search"
                placeholder="Tìm kiếm trong thư viện..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Grid */}
            <div className="imgp-body">
              {loading ? (
                <div className="imgp-upload-bar" style={{ margin: 0 }}>
                  <div className="imgp-spinner" />
                  <span className="imgp-upload-text">Đang tải thư viện...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="imgp-empty">
                  <div className="imgp-empty-icon">📭</div>
                  {search ? `Không tìm thấy "${search}"` : 'Thư viện trống — tải ảnh lên ở trên'}
                </div>
              ) : (
                <>
                  <div className="imgp-count">{filtered.length} ảnh {search && `cho "${search}"`}</div>
                  <div className="imgp-grid">
                    {filtered.map(f => (
                      <div
                        key={f.id}
                        className={`imgp-item${selectedPreview?.id === f.id ? ' selected' : ''}`}
                        onClick={() => {
                          // Single click = select and confirm immediately
                          selectImage(f)
                        }}
                        onMouseEnter={() => setSelectedPreview(f)}
                        title={`${f.filename}\n${formatFileSize(f.size)}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.url} alt={f.alt_text || f.filename} loading="lazy" />
                        <div className="imgp-item-name">{f.filename}</div>
                        <div className="imgp-item-check">✓</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer with preview */}
            <div className="imgp-footer">
              <span className="imgp-footer-hint">
                {selectedPreview
                  ? `${selectedPreview.filename} • ${formatFileSize(selectedPreview.size)}`
                  : 'Click ảnh để chọn'}
              </span>
              <button
                type="button"
                className="imgp-footer-btn"
                onClick={() => setOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
