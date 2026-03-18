'use client'

import { useRef, useCallback, useState } from 'react'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  onInsertImage?: () => void
  placeholder?: string
}

export default function RichEditor({ value, onChange, onInsertImage, placeholder = 'Bắt đầu viết nội dung...' }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showSource, setShowSource] = useState(false)

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
    // Sync content
    setTimeout(() => {
      if (editorRef.current) onChange(editorRef.current.innerHTML)
    }, 10)
  }, [onChange])

  function handleFormat(tag: string) {
    exec('formatBlock', tag)
  }

  function insertLink() {
    const url = prompt('Nhập URL:')
    if (url) exec('createLink', url)
  }

  function insertTable() {
    const rows = parseInt(prompt('Số hàng:', '3') || '3')
    const cols = parseInt(prompt('Số cột:', '3') || '3')
    let html = '<table style="width:100%;border-collapse:collapse;margin:16px 0"><thead><tr>'
    for (let c = 0; c < cols; c++) html += `<th style="border:1px solid #d1d5db;padding:8px 12px;background:#f3f4f6;text-align:left">Tiêu đề ${c + 1}</th>`
    html += '</tr></thead><tbody>'
    for (let r = 0; r < rows - 1; r++) {
      html += '<tr>'
      for (let c = 0; c < cols; c++) html += '<td style="border:1px solid #d1d5db;padding:8px 12px">Nội dung</td>'
      html += '</tr>'
    }
    html += '</tbody></table><p><br></p>'
    exec('insertHTML', html)
  }

  function insertImage() {
    if (onInsertImage) {
      onInsertImage()
    } else {
      const url = prompt('URL ảnh:')
      if (url) exec('insertHTML', `<img src="${url}" alt="Image" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" />`)
    }
  }

  // Called externally to insert an image URL from ImagePicker
  function insertImageUrl(url: string) {
    if (editorRef.current) {
      editorRef.current.focus()
      exec('insertHTML', `<img src="${url}" alt="Image" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" /><p><br></p>`)
    }
  }

  // Expose insertImageUrl to parent via data attribute
  if (typeof window !== 'undefined') {
    (window as any).__richEditorInsertImage = insertImageUrl
  }

  function insertHR() {
    exec('insertHTML', '<hr style="border:none;border-top:2px solid #e5e7eb;margin:24px 0" /><p><br></p>')
  }

  const onInput = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }, [onChange])

  return (
    <>
      <style>{`
        .re-wrap { border: 1px solid #d1d5db; border-radius: 10px; overflow: hidden; background: #fff; transition: border-color 0.2s; }
        .re-wrap:focus-within { border-color: #0078D4; box-shadow: 0 0 0 2px rgba(0,120,212,0.08); }
        .re-toolbar { display: flex; flex-wrap: wrap; gap: 2px; padding: 6px 8px; background: #f8f9fb; border-bottom: 1px solid #e5e7eb; }
        .re-btn { width: 32px; height: 30px; border: none; background: transparent; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #374151; font-size: 14px; transition: all 0.12s; }
        .re-btn:hover { background: #e5e7eb; color: #0078D4; }
        .re-btn.active { background: #dbeafe; color: #0078D4; }
        .re-sep { width: 1px; background: #d1d5db; margin: 2px 4px; }
        .re-select { height: 30px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; font-size: 12px; padding: 0 6px; cursor: pointer; color: #374151; }
        .re-editor { min-height: 360px; padding: 16px 20px; outline: none; font-size: 15px; line-height: 1.75; color: #1a1a2e; overflow-y: auto; font-family: 'Segoe UI', -apple-system, sans-serif; }
        .re-editor:empty::before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; }
        .re-editor h2 { font-size: 22px; font-weight: 700; margin: 24px 0 12px; color: #1a1a2e; }
        .re-editor h3 { font-size: 18px; font-weight: 600; margin: 20px 0 10px; color: #374151; }
        .re-editor p { margin: 8px 0; }
        .re-editor ul, .re-editor ol { margin: 8px 0; padding-left: 24px; }
        .re-editor blockquote { border-left: 3px solid #0078D4; margin: 12px 0; padding: 8px 16px; background: #f8f9fb; color: #4b5563; border-radius: 0 6px 6px 0; }
        .re-editor img { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; }
        .re-editor table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .re-editor table th, .re-editor table td { border: 1px solid #d1d5db; padding: 8px 12px; }
        .re-editor table th { background: #f3f4f6; font-weight: 600; }
        .re-editor a { color: #0078D4; text-decoration: underline; }
        .re-editor pre { background: #1e1e2e; color: #cdd6f4; padding: 16px; border-radius: 8px; font-family: 'Cascadia Code', monospace; font-size: 13px; overflow-x: auto; }
        .re-editor code { background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: 'Cascadia Code', monospace; font-size: 13px; }
        .re-editor hr { border: none; border-top: 2px solid #e5e7eb; margin: 24px 0; }
        .re-source { width: 100%; min-height: 360px; padding: 16px 20px; border: none; outline: none; font-family: 'Cascadia Code', monospace; font-size: 13px; line-height: 1.6; color: #374151; resize: vertical; background: #fafbfc; }
        .re-footer { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: #f8f9fb; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; }
      `}</style>

      <div className="re-wrap">
        <div className="re-toolbar">
          <select className="re-select" onChange={e => { handleFormat(e.target.value); e.target.value = '' }} defaultValue="">
            <option value="" disabled>Định dạng</option>
            <option value="p">Đoạn văn</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="pre">Code Block</option>
            <option value="blockquote">Trích dẫn</option>
          </select>
          <div className="re-sep" />

          <button type="button" className="re-btn" onClick={() => exec('bold')} title="In đậm (Ctrl+B)"><b>B</b></button>
          <button type="button" className="re-btn" onClick={() => exec('italic')} title="In nghiêng (Ctrl+I)"><i>I</i></button>
          <button type="button" className="re-btn" onClick={() => exec('underline')} title="Gạch chân (Ctrl+U)"><u>U</u></button>
          <button type="button" className="re-btn" onClick={() => exec('strikeThrough')} title="Gạch ngang"><s>S</s></button>
          <div className="re-sep" />

          <button type="button" className="re-btn" onClick={() => exec('insertUnorderedList')} title="Danh sách">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
          </button>
          <button type="button" className="re-btn" onClick={() => exec('insertOrderedList')} title="Danh sách số">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="3" y="8" fontSize="8" fill="currentColor" stroke="none">1</text><text x="3" y="14" fontSize="8" fill="currentColor" stroke="none">2</text><text x="3" y="20" fontSize="8" fill="currentColor" stroke="none">3</text></svg>
          </button>
          <div className="re-sep" />

          <button type="button" className="re-btn" onClick={insertLink} title="Chèn link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </button>
          <button type="button" className="re-btn" onClick={insertImage} title="Chèn ảnh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
          <button type="button" className="re-btn" onClick={insertTable} title="Chèn bảng">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
          </button>
          <button type="button" className="re-btn" onClick={insertHR} title="Đường kẻ ngang">—</button>
          <div className="re-sep" />

          <button type="button" className={`re-btn${showSource ? ' active' : ''}`} onClick={() => setShowSource(!showSource)} title="Xem mã nguồn HTML">
            {'</>'}
          </button>
        </div>

        {showSource ? (
          <textarea
            className="re-source"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        ) : (
          <div
            ref={editorRef}
            className="re-editor"
            contentEditable
            data-placeholder={placeholder}
            dangerouslySetInnerHTML={{ __html: value }}
            onInput={onInput}
            onBlur={onInput}
            suppressContentEditableWarning
          />
        )}

        <div className="re-footer">
          <span>{showSource ? 'Chế độ HTML' : 'Chế độ soạn thảo'}</span>
          <span>{value ? `${value.replace(/<[^>]*>/g, '').length} ký tự` : '0 ký tự'}</span>
        </div>
      </div>
    </>
  )
}
