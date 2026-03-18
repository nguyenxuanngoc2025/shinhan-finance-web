'use client'

import { useState, useEffect, useCallback } from 'react'

type TrackingConfig = {
  google_analytics_id: string
  google_tag_manager_id: string
  google_search_console: string
  facebook_pixel_id: string
  custom_head_scripts: string
  custom_body_scripts: string
}

const EMPTY_CONFIG: TrackingConfig = {
  google_analytics_id: '',
  google_tag_manager_id: '',
  google_search_console: '',
  facebook_pixel_id: '',
  custom_head_scripts: '',
  custom_body_scripts: '',
}

const FIELDS = [
  {
    key: 'google_analytics_id' as const,
    label: 'Google Analytics 4',
    placeholder: 'G-XXXXXXXXXX',
    help: 'Measurement ID từ Google Analytics. Vào Google Analytics > Admin > Data Streams > chọn stream > copy Measurement ID.',
    helpUrl: 'https://analytics.google.com/',
    icon: 'chart',
    color: '#F9AB00',
    example: 'G-AB1CDEF2GH',
  },
  {
    key: 'google_tag_manager_id' as const,
    label: 'Google Tag Manager',
    placeholder: 'GTM-XXXXXXX',
    help: 'Container ID từ Google Tag Manager. Vào tagmanager.google.com > Workspace > copy Container ID trên góc phải.',
    helpUrl: 'https://tagmanager.google.com/',
    icon: 'tag',
    color: '#4285F4',
    example: 'GTM-P2XYZ4A',
  },
  {
    key: 'google_search_console' as const,
    label: 'Google Search Console',
    placeholder: 'abc123xyz...',
    help: 'Mã xác minh từ Google Search Console. Vào Search Console > Settings > Ownership verification > HTML tag > copy phần content="..." (chỉ lấy giá trị bên trong dấu ngoặc kép).',
    helpUrl: 'https://search.google.com/search-console',
    icon: 'search',
    color: '#34A853',
    example: 'dXh5a2R3aG9...',
  },
  {
    key: 'facebook_pixel_id' as const,
    label: 'Facebook Pixel',
    placeholder: '1234567890',
    help: 'Pixel ID từ Facebook Events Manager. Vào business.facebook.com > Events Manager > Data Sources > chọn Pixel > copy Pixel ID.',
    helpUrl: 'https://business.facebook.com/events_manager',
    icon: 'fb',
    color: '#1877F2',
    example: '987654321012345',
  },
]

const SVG_ICONS: Record<string, React.ReactNode> = {
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  tag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  fb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
}

export default function TrackingSettingsPage() {
  const [config, setConfig] = useState<TrackingConfig>(EMPTY_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null)

  const fetchConfig = useCallback(() => {
    fetch('/api/cms/settings?key=tracking')
      .then(r => r.json())
      .then(res => {
        if (res.data) setConfig(prev => ({ ...prev, ...res.data }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchConfig() }, [fetchConfig])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking: config }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  const updateField = (key: keyof TrackingConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const getStatus = (value: string) => {
    if (!value?.trim()) return { label: 'Chưa cài đặt', cls: 'status-inactive' }
    return { label: 'Đang hoạt động', cls: 'status-active' }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Đang tải cấu hình...</div>
  }

  return (
    <>
      <style>{`
        .tracking-page h1 { font-size: 20px; font-weight: 700; margin: 0 0 4px; }
        .tracking-page .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
        .tracking-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 12px; overflow: hidden; transition: border-color 0.15s; }
        .tracking-card:hover { border-color: #d1d5db; }
        .tracking-card.has-value { border-left: 3px solid #28a745; }
        .tc-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
        .tc-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tc-icon svg { width: 18px; height: 18px; color: #fff; }
        .tc-info { flex: 1; }
        .tc-label { font-size: 14px; font-weight: 600; color: #1a1a2e; }
        .tc-status { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; padding: 2px 8px; border-radius: 100px; margin-left: 8px; }
        .status-active { background: #dcfce7; color: #166534; }
        .status-inactive { background: #f3f4f6; color: #9ca3af; }
        .tc-body { padding: 0 16px 14px; }
        .tc-input-group { position: relative; }
        .tc-input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; font-family: 'Consolas', 'Monaco', monospace; transition: border-color 0.12s; box-sizing: border-box; }
        .tc-input:focus { outline: none; border-color: #0078D4; box-shadow: 0 0 0 2px rgba(0,120,212,0.1); }
        .tc-input::placeholder { color: #d1d5db; }
        .tc-help-toggle { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #0078D4; cursor: pointer; margin-top: 6px; background: none; border: none; padding: 0; }
        .tc-help-toggle:hover { text-decoration: underline; }
        .tc-help-panel { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-top: 8px; font-size: 12px; color: #374151; line-height: 1.6; }
        .tc-help-panel code { background: #e5e7eb; padding: 1px 6px; border-radius: 3px; font-family: monospace; font-size: 11px; }
        .tc-help-panel a { color: #0078D4; text-decoration: none; }
        .tc-help-panel a:hover { text-decoration: underline; }
        .tc-example { margin-top: 6px; color: #9ca3af; font-size: 11px; }
        .tc-textarea { width: 100%; min-height: 100px; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; font-family: 'Consolas', 'Monaco', monospace; resize: vertical; box-sizing: border-box; transition: border-color 0.12s; }
        .tc-textarea:focus { outline: none; border-color: #0078D4; box-shadow: 0 0 0 2px rgba(0,120,212,0.1); }
        .custom-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 12px; padding: 16px; }
        .custom-section h3 { font-size: 14px; font-weight: 600; margin: 0 0 4px; color: #1a1a2e; }
        .custom-section .cs-desc { font-size: 12px; color: #6b7280; margin-bottom: 10px; }
        .save-bar { position: sticky; bottom: 0; background: #fff; border-top: 1px solid #e5e7eb; padding: 12px 0; display: flex; justify-content: space-between; align-items: center; margin-top: 20px; z-index: 10; }
        .save-btn { padding: 10px 28px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .save-btn.primary { background: #0078D4; color: #fff; }
        .save-btn.primary:hover { background: #005a9e; }
        .save-btn.saved { background: #28a745; color: #fff; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .save-note { font-size: 12px; color: #9ca3af; }
        .info-banner { background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 14px; margin-bottom: 20px; font-size: 13px; color: #1e40af; display: flex; gap: 8px; align-items: flex-start; }
        .info-banner svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; }
      `}</style>

      <div className="tracking-page">
        <h1>Mã theo dõi &amp; Tích hợp</h1>
        <p className="subtitle">Dán mã theo dõi vào đây, lưu lại và website sẽ tự động nhận — không cần chỉnh sửa code</p>

        <div className="info-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>Chỉ cần dán ID/mã vào ô tương ứng rồi nhấn <strong>Lưu thay đổi</strong>. Hệ thống sẽ tự động inject script vào toàn bộ website. Sau khi lưu, cần refresh trang để thấy hiệu lực.</span>
        </div>

        {/* Main tracking services */}
        {FIELDS.map(field => {
          const value = config[field.key]
          const status = getStatus(value)
          return (
            <div key={field.key} className={`tracking-card ${value?.trim() ? 'has-value' : ''}`}>
              <div className="tc-header">
                <div className="tc-icon" style={{ background: field.color }}>
                  {SVG_ICONS[field.icon]}
                </div>
                <div className="tc-info">
                  <span className="tc-label">{field.label}</span>
                  <span className={`tc-status ${status.cls}`}>{status.label}</span>
                </div>
              </div>
              <div className="tc-body">
                <div className="tc-input-group">
                  <input
                    className="tc-input"
                    type="text"
                    placeholder={field.placeholder}
                    value={value}
                    onChange={e => updateField(field.key, e.target.value)}
                  />
                </div>
                <button
                  className="tc-help-toggle"
                  onClick={() => setExpandedHelp(expandedHelp === field.key ? null : field.key)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  {expandedHelp === field.key ? 'Ẩn hướng dẫn' : 'Hướng dẫn lấy mã'}
                </button>
                {expandedHelp === field.key && (
                  <div className="tc-help-panel">
                    <p style={{ margin: '0 0 6px' }}>{field.help}</p>
                    <p style={{ margin: 0 }}>
                      <a href={field.helpUrl} target="_blank" rel="noopener noreferrer">Mở {field.label} →</a>
                    </p>
                    <div className="tc-example">Ví dụ: <code>{field.example}</code></div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Custom Scripts */}
        <div className="custom-section">
          <h3>Custom Head Scripts</h3>
          <p className="cs-desc">JavaScript sẽ được inject vào &lt;head&gt; của mọi trang. Dùng cho: Hotjar, Tawk.to, Crisp chat, hoặc bất kỳ tracking script nào khác.</p>
          <textarea
            className="tc-textarea"
            placeholder="// Dan JavaScript code vao day (khong can the <script>)&#10;// Vi du: Hotjar tracking code..."
            value={config.custom_head_scripts}
            onChange={e => updateField('custom_head_scripts', e.target.value)}
          />
        </div>

        <div className="custom-section">
          <h3>Custom Body Scripts</h3>
          <p className="cs-desc">JavaScript sẽ được inject cuối &lt;body&gt;, load sau khi trang đã hiển thị xong. Thích hợp cho các script không cần ưu tiên.</p>
          <textarea
            className="tc-textarea"
            placeholder="// Dan JavaScript code vao day (khong can the <script>)&#10;// Vi du: chatbot widget, popup script..."
            value={config.custom_body_scripts}
            onChange={e => updateField('custom_body_scripts', e.target.value)}
          />
        </div>

        {/* Save bar */}
        <div className="save-bar">
          <span className="save-note">Thay đổi sẽ có hiệu lực sau khi refresh trang website</span>
          <button
            className={`save-btn ${saved ? 'saved' : 'primary'}`}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? 'Đang lưu...' : saved ? 'Đã lưu thành công!' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </>
  )
}
