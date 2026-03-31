'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

type MediaItem = {
  id: string
  filename: string
  url: string
  alt_text: string
  mime_type: string
  size: number
}

type ImageAlign = 'left' | 'center' | 'right' | 'full'
type ImageSize  = 'small' | 'medium' | 'large' | 'full'

interface Props {
  onInsert: (html: string) => void
  onClose: () => void
}

const SIZE_MAP: Record<ImageSize, string> = {
  small:  '35%',
  medium: '55%',
  large:  '80%',
  full:   '100%',
}

const ALIGN_STYLES: Record<ImageAlign, string> = {
  left:   'float:left; margin:8px 20px 8px 0;',
  center: 'display:block; margin:12px auto;',
  right:  'float:right; margin:8px 0 8px 20px;',
  full:   'display:block; margin:12px 0; width:100%;',
}

function buildImgHtml(url: string, alt: string, align: ImageAlign, size: ImageSize) {
  const widthPct = SIZE_MAP[size]
  let wrapStyle = ''
  let imgStyle  = `max-width:100%; height:auto; border-radius:8px;`

  if (align === 'full') {
    wrapStyle = 'display:block; margin:12px 0; clear:both;'
    imgStyle += ' width:100%;'
  } else if (align === 'center') {
    wrapStyle = `display:block; margin:12px auto; width:${size === 'full' ? '100%' : widthPct}; clear:both;`
  } else {
    wrapStyle = `${ALIGN_STYLES[align]} width:${widthPct};`
  }

  return `<figure style="${wrapStyle}"><img src="${url}" alt="${alt}" style="${imgStyle}" /><figcaption style="font-size:12px;color:#6b7280;text-align:center;margin-top:4px;"></figcaption></figure><p style="clear:both"><br></p>`
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1e6) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1e6).toFixed(1)} MB`
}

export default function ImageInsertModal({ onInsert, onClose }: Props) {
  const [tab, setTab] = useState<'library' | 'upload' | 'url'>('library')
  const [files, setFiles] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [altText, setAltText] = useState('')
  const [align, setAlign] = useState<ImageAlign>('center')
  const [size, setSize]   = useState<ImageSize>('large')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchMedia = useCallback(() => {
    setLoading(true)
    fetch('/api/cms/media')
      .then(r => r.json())
      .then(res => { setFiles(res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  async function handleUpload(fileList: FileList | File[]) {
    const arr = Array.from(fileList)
    if (!arr.length) return
    const allowedMimes = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml','image/avif','image/bmp']
    const allowedExts  = ['jpg','jpeg','png','gif','webp','svg','avif','bmp']
    const invalid = arr.find(f => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
      return !allowedMimes.includes(f.type) && !allowedExts.includes(ext)
    })
    if (invalid) { alert(`"${invalid.name}": Định dạng không hỗ trợ`); return }
    const oversized = arr.find(f => f.size > 5 * 1024 * 1024)
    if (oversized) { alert(`"${oversized.name}" vượt quá 5MB`); return }

    setUploading(true)
    const fd = new FormData()
    arr.forEach(f => fd.append('files', f))
    try {
      const res  = await fetch('/api/cms/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.data?.[0]) {
        setSelected(data.data[0])
        setAltText(data.data[0].alt_text || '')
        setTab('library')
      }
      fetchMedia()
    } catch { alert('Upload thất bại') }
    finally { setUploading(false) }
  }

  function handleInsert() {
    const url = selected?.url || urlInput.trim()
    if (!url) return
    const html = buildImgHtml(url, altText || (selected?.alt_text ?? 'ảnh'), align, size)
    onInsert(html)
    onClose()
  }

  const filtered = search
    ? files.filter(f => f.filename.toLowerCase().includes(search.toLowerCase()))
    : files

  // Preview of current URL
  const previewUrl = selected?.url || urlInput

  return (
    <>
      <style>{`
        .iim-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.6); z-index:99999; display:flex; align-items:center; justify-content:center; animation:iimFadeIn 0.15s; backdrop-filter:blur(4px); }
        .iim-modal  { background:#fff; border-radius:16px; width:96vw; max-width:820px; max-height:88vh; display:flex; flex-direction:column; box-shadow:0 32px 100px rgba(0,0,0,0.3); animation:iimSlideUp 0.2s; }
        .iim-head   { padding:16px 20px; display:flex; align-items:center; gap:12px; border-bottom:1px solid #f0f1f3; }
        .iim-head h3{ font-size:16px; font-weight:700; color:#1e293b; margin:0; flex:1; }
        .iim-close  { width:32px; height:32px; border-radius:8px; border:none; background:#f1f5f9; color:#64748b; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
        .iim-close:hover { background:#fee2e2; color:#dc2626; }
        .iim-body   { display:flex; flex:1; overflow:hidden; min-height:0; }
        .iim-left   { flex:1; display:flex; flex-direction:column; border-right:1px solid #f0f1f3; min-width:0; overflow:hidden; }
        .iim-right  { width:260px; display:flex; flex-direction:column; padding:16px; gap:14px; overflow-y:auto; }

        .iim-tabs   { display:flex; gap:0; padding:12px 16px 0; border-bottom:1px solid #f0f1f3; }
        .iim-tab    { padding:8px 16px; font-size:13px; font-weight:600; border:none; background:transparent; cursor:pointer; color:#6b7280; border-bottom:2px solid transparent; transition:all 0.15s; }
        .iim-tab.active { color:#0078D4; border-bottom-color:#0078D4; }

        .iim-panel  { flex:1; overflow-y:auto; padding:12px 16px 16px; display:flex; flex-direction:column; gap:10px; }
        .iim-search { width:100%; padding:8px 12px 8px 32px; border:1.5px solid #e2e6ed; border-radius:8px; font-size:13px; outline:none;
          background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E") no-repeat 8px center/16px; }
        .iim-search:focus { border-color:#0078D4; }
        .iim-grid   { display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:8px; }
        .iim-item   { border-radius:8px; overflow:hidden; cursor:pointer; border:2.5px solid transparent; transition:all 0.15s; background:#f8f9fa; }
        .iim-item:hover { border-color:#93c5fd; transform:translateY(-2px); }
        .iim-item.sel { border-color:#0078D4; }
        .iim-item img { width:100%; height:80px; object-fit:cover; display:block; }
        .iim-item-name { padding:3px 6px; font-size:10px; color:#6b7280; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        .iim-dropzone { border:2px dashed #d4dae5; border-radius:10px; padding:28px 16px; text-align:center; cursor:pointer; transition:all 0.2s; }
        .iim-dropzone:hover,.iim-dropzone.dg { border-color:#0078D4; background:#f0f7ff; }
        .iim-dropzone p { margin:8px 0 0; font-size:13px; color:#4b5563; }
        .iim-dropzone small { font-size:11px; color:#9ca3af; }

        .iim-url-row { display:flex; gap:8px; }
        .iim-url-inp { flex:1; padding:8px 12px; border:1.5px solid #d4dae5; border-radius:8px; font-size:13px; outline:none; }
        .iim-url-inp:focus { border-color:#0078D4; }

        /* Right panel styles */
        .iim-preview { background:#f8f9fa; border-radius:10px; overflow:hidden; min-height:120px; display:flex; align-items:center; justify-content:center; }
        .iim-preview img { max-width:100%; max-height:160px; object-fit:contain; display:block; }
        .iim-preview-empty { color:#d1d5db; font-size:32px; }
        .iim-label  { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
        .iim-inp    { width:100%; padding:7px 10px; border:1.5px solid #d1d5db; border-radius:6px; font-size:13px; outline:none; font-family:inherit; }
        .iim-inp:focus { border-color:#0078D4; }

        .iim-align-group,.iim-size-group { display:flex; gap:6px; flex-wrap:wrap; }
        .iim-align-btn,.iim-size-btn { flex:1; min-width:0; padding:7px 4px; border:1.5px solid #d1d5db; border-radius:6px; background:#fff; font-size:11px; font-weight:600; cursor:pointer; text-align:center; color:#4b5563; transition:all 0.15s; }
        .iim-align-btn:hover,.iim-size-btn:hover { border-color:#0078D4; color:#0078D4; }
        .iim-align-btn.sel,.iim-size-btn.sel { border-color:#0078D4; background:#eff8ff; color:#0078D4; }

        .iim-insert { width:100%; padding:11px; border:none; border-radius:8px; background:#0078D4; color:#fff; font-size:14px; font-weight:700; cursor:pointer; transition:background 0.15s; margin-top:auto; }
        .iim-insert:hover { background:#005ea6; }
        .iim-insert:disabled { opacity:0.4; cursor:not-allowed; }

        .iim-spinner { width:18px; height:18px; border:2.5px solid rgba(0,120,212,0.2); border-top-color:#0078D4; border-radius:50%; animation:iimSpin 0.5s linear infinite; }

        @keyframes iimFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes iimSlideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform: translateY(0) } }
        @keyframes iimSpin    { to { transform:rotate(360deg) } }
      `}</style>

      <div className="iim-overlay" onClick={onClose}>
        <div className="iim-modal" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="iim-head">
            <h3>Chèn ảnh vào bài viết</h3>
            <button className="iim-close" onClick={onClose}>✕</button>
          </div>

          <div className="iim-body">
            {/* ===== LEFT: Library / Upload / URL ===== */}
            <div className="iim-left">
              <div className="iim-tabs">
                {(['library','upload','url'] as const).map(t => (
                  <button key={t} className={`iim-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                    {t === 'library' ? 'Thư viện' : t === 'upload' ? 'Upload' : 'URL'}
                  </button>
                ))}
              </div>

              {tab === 'library' && (
                <div className="iim-panel">
                  <input className="iim-search" placeholder="Tìm kiếm ảnh..." value={search} onChange={e => setSearch(e.target.value)} />
                  {loading ? (
                    <div style={{ display:'flex', justifyContent:'center', padding:20 }}><div className="iim-spinner" /></div>
                  ) : filtered.length === 0 ? (
                    <div style={{ textAlign:'center', color:'#9ca3af', padding:24, fontSize:13 }}>
                      {search ? `Không tìm thấy "${search}"` : 'Chưa có ảnh trong thư viện'}
                    </div>
                  ) : (
                    <div className="iim-grid">
                      {filtered.map(f => (
                        <div
                          key={f.id}
                          className={`iim-item${selected?.id === f.id ? ' sel' : ''}`}
                          onClick={() => { setSelected(f); setAltText(f.alt_text || '') }}
                          title={`${f.filename} · ${formatFileSize(f.size)}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.url} alt={f.alt_text || f.filename} loading="lazy" />
                          <div className="iim-item-name">{f.filename}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'upload' && (
                <div className="iim-panel">
                  <div
                    className={`iim-dropzone${dragOver ? ' dg' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files) }}
                    onClick={() => fileRef.current?.click()}
                  >
                    {uploading ? (
                      <div style={{ display:'flex', justifyContent:'center' }}><div className="iim-spinner" /></div>
                    ) : (
                      <>
                        <div style={{ fontSize:36, opacity:0.3 }}>📤</div>
                        <p><strong style={{ color:'#0078D4' }}>Kéo thả</strong> hoặc click để chọn file</p>
                        <small>JPG, PNG, WebP, GIF, SVG, AVIF — tối đa 5MB</small>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" multiple
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/avif,.jpg,.jpeg,.png,.gif,.webp,.svg,.avif"
                    style={{ display:'none' }}
                    onChange={e => { if (e.target.files) handleUpload(e.target.files); e.target.value = '' }}
                  />
                </div>
              )}

              {tab === 'url' && (
                <div className="iim-panel">
                  <div className="iim-label">URL ảnh</div>
                  <div className="iim-url-row">
                    <input
                      className="iim-url-inp"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && urlInput.trim()) setTab('library') }}
                      autoFocus
                    />
                  </div>
                  {urlInput && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={urlInput} alt="preview" style={{ maxWidth:'100%', maxHeight:200, objectFit:'contain', borderRadius:8, marginTop:8 }} />
                  )}
                </div>
              )}
            </div>

            {/* ===== RIGHT: Settings ===== */}
            <div className="iim-right">
              {/* Preview */}
              <div className="iim-preview">
                {previewUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={previewUrl} alt="preview" />
                  : <span className="iim-preview-empty">🖼️</span>
                }
              </div>

              {/* Alt text */}
              <div>
                <div className="iim-label">Alt text (SEO)</div>
                <input className="iim-inp" placeholder="Mô tả ảnh..." value={altText} onChange={e => setAltText(e.target.value)} />
              </div>

              {/* Alignment */}
              <div>
                <div className="iim-label">Vị trí ảnh</div>
                <div className="iim-align-group">
                  {([
                    { v: 'left',   label: '⬅ Trái' },
                    { v: 'center', label: '↔ Giữa' },
                    { v: 'right',  label: '➡ Phải' },
                    { v: 'full',   label: '⬛ Full' },
                  ] as const).map(({ v, label }) => (
                    <button key={v} className={`iim-align-btn${align === v ? ' sel' : ''}`} onClick={() => setAlign(v)}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="iim-label">Kích thước</div>
                <div className="iim-size-group">
                  {([
                    { v: 'small',  label: 'Nhỏ\n35%' },
                    { v: 'medium', label: 'Vừa\n55%' },
                    { v: 'large',  label: 'Lớn\n80%' },
                    { v: 'full',   label: 'Full\n100%' },
                  ] as const).map(({ v, label }) => (
                    <button key={v} className={`iim-size-btn${size === v ? ' sel' : ''}`}
                      style={{ fontSize:11, lineHeight:1.3 }}
                      onClick={() => setSize(v)}>
                      {label.split('\n').map((l, i) => <span key={i} style={{ display:'block' }}>{l}</span>)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insert button */}
              <button
                className="iim-insert"
                disabled={!previewUrl}
                onClick={handleInsert}
              >
                Chèn ảnh vào bài
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
