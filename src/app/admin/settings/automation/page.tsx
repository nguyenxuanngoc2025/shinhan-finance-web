'use client'

import { useState, useEffect, useCallback } from 'react'

type AutomationModule = {
  id: string
  module_key: string
  module_name: string
  enabled: boolean
  config: Record<string, unknown>
  status: string
  last_run_at: string | null
  last_error: string | null
  stats: Record<string, unknown>
}

const MODULE_ICONS: Record<string, string> = {
  shinhan_scraper: '📰',
  ai_finance_news: '📝',
  seo_planner: '📊',
  auto_fanpage: '📱',
}

const MODULE_DESCRIPTIONS: Record<string, string> = {
  shinhan_scraper: 'Tự động lấy tin tức, hình ảnh từ website chính hãng. Bài viết sẽ hiển thị trên Trang chủ.',
  ai_finance_news: 'AI tổng hợp tin tài chính từ 12 nguồn VN + quốc tế → viết bài SEO tự động mỗi ngày.',
  seo_planner: 'Lên kế hoạch từ khóa + chủ đề bài viết cho tuần tới. Đảm bảo phủ đều từ khóa ngành.',
  auto_fanpage: 'Mỗi bài viết mới trên website → tự động đăng lên Facebook Fanpage kèm hình ảnh + link.',
}

const STATUS_DISPLAY: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: '🟢 Đang hoạt động', color: '#16a34a', bg: '#f0fdf4' },
  ready: { label: '🟢 Sẵn sàng', color: '#16a34a', bg: '#f0fdf4' },
  inactive: { label: '🔴 Chưa kích hoạt', color: '#dc2626', bg: '#fef2f2' },
  error: { label: '⚠️ Có lỗi', color: '#ea580c', bg: '#fff7ed' },
  needs_config: { label: '🟡 Cần cấu hình', color: '#ca8a04', bg: '#fefce8' },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Chưa chạy'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AutomationDashboard() {
  const [modules, setModules] = useState<AutomationModule[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ key: string; msg: string; ok: boolean } | null>(null)
  const [editingConfig, setEditingConfig] = useState<string | null>(null)
  const [fbPageId, setFbPageId] = useState('')
  const [fbToken, setFbToken] = useState('')

  const fetchModules = useCallback(() => {
    fetch('/api/cms/automation')
      .then(r => r.json())
      .then(res => {
        if (res.data) setModules(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchModules() }, [fetchModules])

  const toggleModule = async (mod: AutomationModule) => {
    const newEnabled = !mod.enabled
    const newStatus = newEnabled ? 'active' : 'inactive'

    await fetch('/api/cms/automation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_key: mod.module_key, enabled: newEnabled, status: newStatus })
    })
    fetchModules()
  }

  const testConnection = async (moduleKey: string) => {
    setTesting(moduleKey)
    setTestResult(null)

    const config = moduleKey === 'auto_fanpage'
      ? { page_id: fbPageId, access_token: fbToken }
      : {}

    try {
      const res = await fetch('/api/cms/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_key: moduleKey, config })
      })
      const data = await res.json()
      setTestResult({ key: moduleKey, msg: data.message, ok: data.success })
      if (data.success) fetchModules()
    } catch {
      setTestResult({ key: moduleKey, msg: 'Lỗi kết nối', ok: false })
    }
    setTesting(null)
  }

  const activeCount = modules.filter(m => m.enabled && (m.status === 'active' || m.status === 'ready')).length
  const totalCount = modules.length
  const needsSetup = modules.filter(m => !m.enabled || m.status === 'inactive' || m.status === 'needs_config').length

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Đang tải...</div>
  }

  return (
    <>
      <style>{`
        .auto-page h1 { font-size: 20px; font-weight: 700; margin: 0 0 4px; }
        .auto-page .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
        .auto-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
        .auto-stat { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center; }
        .auto-stat .num { font-size: 28px; font-weight: 700; }
        .auto-stat .label { font-size: 12px; color: #6b7280; margin-top: 4px; }
        .mod-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 14px; overflow: hidden; transition: box-shadow 0.2s; }
        .mod-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .mod-header { display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-bottom: 1px solid #f3f4f6; }
        .mod-icon { font-size: 28px; }
        .mod-info { flex: 1; }
        .mod-name { font-size: 15px; font-weight: 700; color: #111827; margin: 0; }
        .mod-desc { font-size: 12px; color: #6b7280; margin: 2px 0 0; }
        .mod-status { padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; }
        .mod-toggle { position: relative; width: 44px; height: 24px; border-radius: 12px; background: #d1d5db; cursor: pointer; border: none; transition: background 0.2s; }
        .mod-toggle.on { background: #16a34a; }
        .mod-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .mod-toggle.on::after { transform: translateX(20px); }
        .mod-body { padding: 16px 18px; }
        .mod-meta { display: flex; gap: 20px; font-size: 12px; color: #6b7280; }
        .mod-meta span { display: flex; align-items: center; gap: 4px; }
        .config-section { margin-top: 14px; padding: 14px; background: #f9fafb; border-radius: 8px; }
        .config-section label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px; }
        .config-input { width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; margin-bottom: 10px; box-sizing: border-box; }
        .config-input:focus { outline: none; border-color: #0078D4; box-shadow: 0 0 0 2px rgba(0,120,212,0.1); }
        .test-btn { padding: 8px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; background: #0078D4; color: #fff; }
        .test-btn:hover { background: #005a9e; }
        .test-btn:disabled { opacity: 0.6; }
        .test-result { margin-top: 10px; padding: 10px; border-radius: 6px; font-size: 13px; }
        .test-result.ok { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .test-result.fail { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .help-link { font-size: 12px; color: #0078D4; cursor: pointer; text-decoration: underline; margin-top: 4px; display: inline-block; }
        @media (max-width: 768px) { .auto-summary { grid-template-columns: 1fr; } }
      `}</style>

      <div className="auto-page">
        <h1>⚙️ Trung tâm Tự động hóa</h1>
        <p className="subtitle">Quản lý các module automation — bật/tắt, cấu hình và kiểm tra trạng thái</p>

        {/* Summary cards */}
        <div className="auto-summary">
          <div className="auto-stat">
            <div className="num" style={{ color: '#16a34a' }}>{activeCount}</div>
            <div className="label">Module hoạt động</div>
          </div>
          <div className="auto-stat">
            <div className="num" style={{ color: '#ca8a04' }}>{needsSetup}</div>
            <div className="label">Cần thiết lập</div>
          </div>
          <div className="auto-stat">
            <div className="num" style={{ color: '#0078D4' }}>{totalCount}</div>
            <div className="label">Tổng module</div>
          </div>
        </div>

        {/* Module cards */}
        {modules.map(mod => {
          const statusInfo = STATUS_DISPLAY[mod.status] || STATUS_DISPLAY.inactive
          const isFanpage = mod.module_key === 'auto_fanpage'
          const isEditing = editingConfig === mod.module_key

          return (
            <div key={mod.module_key} className="mod-card">
              <div className="mod-header">
                <span className="mod-icon">{MODULE_ICONS[mod.module_key] || '🔧'}</span>
                <div className="mod-info">
                  <h3 className="mod-name">{mod.module_name}</h3>
                  <p className="mod-desc">{MODULE_DESCRIPTIONS[mod.module_key] || ''}</p>
                </div>
                <span className="mod-status" style={{ color: statusInfo.color, background: statusInfo.bg }}>
                  {statusInfo.label}
                </span>
                <button
                  className={`mod-toggle ${mod.enabled ? 'on' : ''}`}
                  onClick={() => toggleModule(mod)}
                  title={mod.enabled ? 'Tắt module' : 'Bật module'}
                />
              </div>

              <div className="mod-body">
                <div className="mod-meta">
                  <span>🕐 Lần chạy cuối: {formatDate(mod.last_run_at)}</span>
                  {mod.last_error && <span style={{ color: '#dc2626' }}>⚠️ {mod.last_error}</span>}
                </div>

                {/* Fanpage config */}
                {isFanpage && (
                  <div className="config-section">
                    <label>Facebook Page ID</label>
                    <input
                      className="config-input"
                      placeholder="Ví dụ: 123456789012345"
                      value={fbPageId || (mod.config?.page_id as string) || ''}
                      onChange={e => setFbPageId(e.target.value)}
                    />

                    <label>Facebook Page Access Token</label>
                    <input
                      className="config-input"
                      type="password"
                      placeholder="Dán Access Token từ Facebook Developer"
                      value={fbToken || (mod.config?.access_token as string) || ''}
                      onChange={e => setFbToken(e.target.value)}
                    />

                    <button
                      className="test-btn"
                      disabled={testing === mod.module_key}
                      onClick={() => testConnection(mod.module_key)}
                    >
                      {testing === mod.module_key ? '⏳ Đang kiểm tra...' : '🔗 Kiểm tra kết nối'}
                    </button>

                    <a className="help-link" href="https://developers.facebook.com/docs/pages/getting-started" target="_blank" rel="noopener noreferrer">
                      📘 Hướng dẫn lấy Page ID và Access Token
                    </a>

                    {testResult && testResult.key === mod.module_key && (
                      <div className={`test-result ${testResult.ok ? 'ok' : 'fail'}`}>
                        {testResult.msg}
                      </div>
                    )}
                  </div>
                )}

                {/* Other module configs (view-only) */}
                {!isFanpage && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      style={{ background: 'none', border: 'none', color: '#0078D4', fontSize: 12, cursor: 'pointer', padding: 0 }}
                      onClick={() => setEditingConfig(isEditing ? null : mod.module_key)}
                    >
                      {isEditing ? '▼ Ẩn cấu hình' : '▶ Xem cấu hình'}
                    </button>
                    {isEditing && (
                      <pre style={{ background: '#f9fafb', padding: 12, borderRadius: 6, fontSize: 12, marginTop: 8, overflow: 'auto' }}>
                        {JSON.stringify(mod.config, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
