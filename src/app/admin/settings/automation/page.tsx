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

// ── Module info for non-technical users ──
const MODULE_INFO: Record<string, {
  icon: string
  friendlyName: string
  whatItDoes: string
  howItWorks: string
  whatYouNeed: string
  schedule: string
  benefit: string
  color: string
  gradient: string
}> = {
  shinhan_scraper: {
    icon: '📰',
    friendlyName: 'Cập nhật tin Shinhan',
    whatItDoes: 'Tự động lấy tin tức mới nhất từ website chính hãng Shinhan Bank và đăng lên trang web của bạn.',
    howItWorks: 'Hệ thống sẽ kiểm tra website Shinhan Bank 3 lần/tuần. Khi có bài viết mới, nó sẽ tự động sao chép nội dung, hình ảnh và đăng lên mục "Tin tức" trên Trang chủ website của bạn.',
    whatYouNeed: 'Không cần làm gì. Tính năng này hoạt động tự động hoàn toàn.',
    schedule: 'Thứ 2 • Thứ 4 • Thứ 6 — lúc 8:00 sáng',
    benefit: 'Website luôn có tin mới nhất từ Shinhan, tăng uy tín thương hiệu',
    color: '#0078D4',
    gradient: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
  },
  ai_finance_news: {
    icon: '✍️',
    friendlyName: 'Viết bài tự động',
    whatItDoes: 'AI tự động viết bài về tài chính, vay vốn, thẻ tín dụng mỗi ngày để tăng lượng truy cập từ Google.',
    howItWorks: 'Mỗi sáng, hệ thống đọc tin từ các nguồn uy tín (VnExpress, CafeF, Vietstock...), sau đó viết lại thành bài viết mới với góc nhìn của Shinhan Bank. Bài sẽ lên mục "Blog".',
    whatYouNeed: 'Không cần làm gì. Bài viết sẽ tự động xuất hiện trong mục Blog trên website.',
    schedule: 'Mỗi ngày — lúc 7:00 sáng',
    benefit: 'Mỗi tháng thêm 30 bài viết SEO → thu hút khách hàng từ Google',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
  },
  seo_planner: {
    icon: '📅',
    friendlyName: 'Lên lịch nội dung',
    whatItDoes: 'Tự động lên kế hoạch chủ đề bài viết cho tuần tới, đảm bảo phủ đều các từ khóa quan trọng.',
    howItWorks: 'Mỗi tối Chủ nhật, hệ thống xem danh sách 73 từ khóa đã chuẩn bị sẵn, chọn ra 7 chủ đề cho tuần mới, và sắp xếp lịch đăng bài — mỗi ngày 1 bài.',
    whatYouNeed: 'Không cần làm gì. Kế hoạch được lên tự động.',
    schedule: 'Chủ nhật — lúc 10:00 tối',
    benefit: 'Nội dung đều đặn, không bị trùng lặp, phủ đúng từ khóa mục tiêu',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
  },
  auto_fanpage: {
    icon: '📱',
    friendlyName: 'Đăng Facebook tự động',
    whatItDoes: 'Mỗi khi có bài viết mới trên website, hệ thống tự động đăng lên Facebook Fanpage kèm hình ảnh và link.',
    howItWorks: 'Cứ 30 phút, hệ thống kiểm tra xem có bài mới chưa đăng lên Facebook. Nếu có, nó sẽ tạo bài đăng với tiêu đề, mô tả ngắn, và link về website.',
    whatYouNeed: 'Bạn cần cung cấp thông tin Fanpage Facebook (hướng dẫn bên dưới).',
    schedule: 'Kiểm tra mỗi 30 phút',
    benefit: 'Fanpage luôn cập nhật, tiết kiệm thời gian đăng bài thủ công',
    color: '#1877f2',
    gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
  },
}

const STATUS_MAP: Record<string, { label: string; icon: string; desc: string }> = {
  active:       { label: 'Đang hoạt động', icon: '🟢', desc: 'Tính năng đang chạy đúng lịch' },
  ready:        { label: 'Sẵn sàng chạy',  icon: '🟢', desc: 'Đã thiết lập xong, chờ bật' },
  inactive:     { label: 'Chưa bật',        icon: '⚪', desc: 'Nhấn nút để bật tính năng này' },
  error:        { label: 'Tạm dừng',        icon: '🟠', desc: 'Có sự cố, liên hệ bộ phận kỹ thuật' },
  needs_config: { label: 'Cần thiết lập',   icon: '🟡', desc: 'Vui lòng điền thông tin bên dưới' },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(hours / 24)

  if (hours < 1) return 'Vừa xong'
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function AutomationDashboard() {
  const [modules, setModules] = useState<AutomationModule[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ key: string; msg: string; ok: boolean } | null>(null)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [fbPageId, setFbPageId] = useState('')
  const [fbToken, setFbToken] = useState('')
  const [healthData, setHealthData] = useState<{
    modules: { key: string; name: string; status: string; message: string; n8n_active?: boolean }[];
    content: { published: number; scheduled: number; nextPublish: string | null; warning: string | null };
  } | null>(null)

  const fetchModules = useCallback(() => {
    Promise.all([
      fetch('/api/cms/automation').then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/cms/automation-health?secret=shinhan2026').then(r => r.json()).catch(() => null),
    ]).then(([automationRes, healthRes]) => {
      let mods: AutomationModule[] = automationRes.data || []

      // Merge health API real status into automation modules
      if (healthRes?.modules) {
        setHealthData(healthRes)
        const healthMap = new Map(healthRes.modules.map((h: { key: string; status: string; message: string; n8n_active?: boolean }) => [h.key, h]))

        // Ensure all health modules exist in mods
        for (const hm of healthRes.modules) {
          if (!mods.find((m: AutomationModule) => m.module_key === hm.key)) {
            mods.push({
              id: hm.key,
              module_key: hm.key,
              module_name: hm.name,
              enabled: hm.n8n_active || false,
              config: {},
              status: hm.n8n_active ? 'active' : 'inactive',
              last_run_at: null,
              last_error: null,
              stats: {},
            })
          }
        }

        // Update each mod with real health status
        mods = mods.map((m: AutomationModule) => {
          const h = healthMap.get(m.module_key) as { status: string; message: string; n8n_active?: boolean } | undefined
          if (h) {
            return {
              ...m,
              enabled: h.n8n_active || m.enabled,
              status: h.n8n_active ? 'active' : (m.status === 'needs_config' ? 'needs_config' : 'inactive'),
              last_error: h.status === 'error' ? h.message : m.last_error,
            }
          }
          return m
        })
      }

      // Auto-load saved FB config
      const fb = mods.find((m: AutomationModule) => m.module_key === 'auto_fanpage')
      if (fb?.config?.page_id) setFbPageId(fb.config.page_id as string)
      if (fb?.config?.access_token) setFbToken(fb.config.access_token as string)

      setModules(mods)
      setLoading(false)
    })
  }, [])

  useEffect(() => { fetchModules() }, [fetchModules])

  const toggleModule = async (mod: AutomationModule) => {
    // If Fanpage and no config, expand instead
    if (mod.module_key === 'auto_fanpage' && !mod.enabled && (!fbPageId || !fbToken)) {
      setExpandedModule('auto_fanpage')
      return
    }

    const newEnabled = !mod.enabled
    const newStatus = newEnabled ? 'active' : 'inactive'

    await fetch('/api/cms/automation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_key: mod.module_key, enabled: newEnabled, status: newStatus })
    })
    fetchModules()
  }

  const testConnection = async () => {
    setTesting('auto_fanpage')
    setTestResult(null)

    try {
      const res = await fetch('/api/cms/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_key: 'auto_fanpage', config: { page_id: fbPageId, access_token: fbToken } })
      })
      const data = await res.json()
      setTestResult({ key: 'auto_fanpage', msg: data.message, ok: data.success })
      if (data.success) fetchModules()
    } catch {
      setTestResult({ key: 'auto_fanpage', msg: 'Không thể kết nối. Vui lòng kiểm tra lại thông tin.', ok: false })
    }
    setTesting(null)
  }

  const activeCount = modules.filter(m => m.enabled && (m.status === 'active' || m.status === 'ready')).length
  const totalCount = modules.length

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Đang tải thông tin...</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .atp { max-width: 800px; }
        .atp-header { margin-bottom: 28px; }
        .atp-header h1 { font-size: 22px; font-weight: 700; margin: 0 0 6px; color: #111827; }
        .atp-header p { color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5; }

        /* Overview banner */
        .atp-overview { background: linear-gradient(135deg, #0d2e5c 0%, #1a5ba8 100%); border-radius: 16px; padding: 24px 28px; color: #fff; margin-bottom: 28px; display: flex; align-items: center; gap: 20px; }
        .atp-overview-left { flex: 1; }
        .atp-overview-left h2 { font-size: 16px; font-weight: 600; margin: 0 0 6px; opacity: 0.9; }
        .atp-overview-left p { font-size: 13px; opacity: 0.7; margin: 0; line-height: 1.5; }
        .atp-overview-right { display: flex; gap: 16px; }
        .atp-ov-stat { text-align: center; background: rgba(255,255,255,0.12); border-radius: 12px; padding: 14px 20px; min-width: 80px; }
        .atp-ov-stat .n { font-size: 28px; font-weight: 700; }
        .atp-ov-stat .l { font-size: 11px; opacity: 0.7; margin-top: 2px; }

        /* Module card */
        .atp-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; margin-bottom: 16px; overflow: hidden; transition: all 0.25s ease; }
        .atp-card:hover { border-color: #d1d5db; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .atp-card-top { padding: 20px 22px; cursor: pointer; }
        .atp-card-row1 { display: flex; align-items: flex-start; gap: 14px; }
        .atp-card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
        .atp-card-main { flex: 1; min-width: 0; }
        .atp-card-title { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .atp-card-title h3 { font-size: 15px; font-weight: 700; color: #111827; margin: 0; }
        .atp-card-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
        .atp-card-desc { font-size: 13px; color: #6b7280; line-height: 1.5; margin: 0; }
        .atp-card-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        /* Toggle switch */
        .atp-toggle { position: relative; width: 48px; height: 26px; border-radius: 13px; background: #d1d5db; cursor: pointer; border: none; transition: all 0.25s; flex-shrink: 0; }
        .atp-toggle.on { background: #16a34a; }
        .atp-toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .atp-toggle.on::after { transform: translateX(22px); }
        .atp-toggle-label { font-size: 11px; color: #6b7280; text-align: center; }

        /* Schedule & status row */
        .atp-card-meta { display: flex; gap: 16px; margin-top: 10px; flex-wrap: wrap; }
        .atp-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #9ca3af; background: #f9fafb; padding: 4px 10px; border-radius: 6px; }

        /* Expand section */
        .atp-expand { border-top: 1px solid #f3f4f6; padding: 0 22px; max-height: 0; overflow: hidden; transition: all 0.3s ease; }
        .atp-expand.open { max-height: 800px; padding: 18px 22px; }
        .atp-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .atp-detail-box { padding: 14px; background: #f9fafb; border-radius: 10px; }
        .atp-detail-box h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; margin: 0 0 6px; }
        .atp-detail-box p { font-size: 13px; color: #374151; margin: 0; line-height: 1.5; }

        /* Fanpage config */
        .atp-fb-setup { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px; }
        .atp-fb-setup h4 { font-size: 14px; font-weight: 700; color: #1e40af; margin: 0 0 4px; }
        .atp-fb-setup .sub { font-size: 12px; color: #3b82f6; margin: 0 0 14px; }
        .atp-fb-step { display: flex; gap: 10px; margin-bottom: 12px; }
        .atp-fb-step-num { width: 24px; height: 24px; border-radius: 50%; background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
        .atp-fb-step-content { flex: 1; }
        .atp-fb-step-content label { display: block; font-size: 13px; font-weight: 600; color: #1e3a5f; margin-bottom: 4px; }
        .atp-fb-step-content .hint { font-size: 11px; color: #6b7280; margin: 0 0 6px; }
        .atp-fb-input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box; transition: all 0.2s; background: #fff; }
        .atp-fb-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        .atp-fb-actions { display: flex; gap: 10px; align-items: center; margin-top: 16px; flex-wrap: wrap; }
        .atp-fb-btn { padding: 10px 22px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .atp-fb-btn.primary { background: #3b82f6; color: #fff; }
        .atp-fb-btn.primary:hover { background: #2563eb; }
        .atp-fb-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .atp-fb-help { font-size: 12px; color: #3b82f6; text-decoration: none; }
        .atp-fb-help:hover { text-decoration: underline; }
        .atp-fb-result { margin-top: 12px; padding: 12px 14px; border-radius: 8px; font-size: 13px; }
        .atp-fb-result.ok { background: #f0fdf4; color: #16a34a; border: 1px solid #86efac; }
        .atp-fb-result.fail { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }

        /* Expand toggle */
        .atp-expand-btn { display: flex; align-items: center; gap: 4px; background: none; border: none; color: #6b7280; font-size: 12px; cursor: pointer; padding: 4px 0; margin-top: 6px; }
        .atp-expand-btn:hover { color: #374151; }
        .atp-expand-btn svg { width: 14px; height: 14px; transition: transform 0.2s; }
        .atp-expand-btn.open svg { transform: rotate(180deg); }

        @media (max-width: 768px) {
          .atp-overview { flex-direction: column; text-align: center; }
          .atp-card-row1 { flex-wrap: wrap; }
          .atp-detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="atp">
        {/* Header */}
        <div className="atp-header">
          <h1>🤖 Hệ thống Tự động hóa</h1>
          <p>Quản lý các tính năng tự động — website tự đăng bài, tự cập nhật, tự lên Facebook mà không cần bạn làm gì.</p>
        </div>

        {/* Overview banner */}
        <div className="atp-overview">
          <div className="atp-overview-left">
            <h2>Tổng quan hệ thống</h2>
            <p>
              {activeCount === totalCount
                ? '🎉 Tất cả tính năng đang hoạt động bình thường!'
                : activeCount > 0
                  ? `${activeCount} tính năng đang chạy. Bật thêm các tính năng khác để tối đa hiệu quả.`
                  : 'Chưa có tính năng nào được bật. Hãy bật các tính năng bên dưới để bắt đầu.'}
            </p>
          </div>
          <div className="atp-overview-right">
            <div className="atp-ov-stat">
              <div className="n">{activeCount}</div>
              <div className="l">Đang chạy</div>
            </div>
            <div className="atp-ov-stat">
              <div className="n">{totalCount}</div>
              <div className="l">Tổng cộng</div>
            </div>
          </div>
        </div>

        {/* Module cards */}
        {modules.map(mod => {
          const info = MODULE_INFO[mod.module_key]
          if (!info) return null
          const statusInfo = STATUS_MAP[mod.status] || STATUS_MAP.inactive
          const isExpanded = expandedModule === mod.module_key
          const lastRun = formatDate(mod.last_run_at)
          const isFanpage = mod.module_key === 'auto_fanpage'
          const hasFbConfig = !!(fbPageId && fbToken)

          return (
            <div key={mod.module_key} className="atp-card" style={{ borderLeftColor: mod.enabled ? info.color : undefined, borderLeftWidth: mod.enabled ? 3 : 1 }}>
              <div className="atp-card-top" onClick={() => setExpandedModule(isExpanded ? null : mod.module_key)}>
                <div className="atp-card-row1">
                  <div className="atp-card-icon" style={{ background: info.gradient }}>
                    {info.icon}
                  </div>
                  <div className="atp-card-main">
                    <div className="atp-card-title">
                      <h3>{info.friendlyName}</h3>
                      <span className="atp-card-badge" style={{
                        color: mod.enabled ? '#16a34a' : '#9ca3af',
                        background: mod.enabled ? '#f0fdf4' : '#f3f4f6'
                      }}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>
                    <p className="atp-card-desc">{info.whatItDoes}</p>

                    {/* Schedule & last run */}
                    <div className="atp-card-meta">
                      <span className="atp-meta-item">🕐 {info.schedule}</span>
                      {lastRun && <span className="atp-meta-item">✅ Lần cuối: {lastRun}</span>}
                      {mod.last_error && <span className="atp-meta-item" style={{ color: '#dc2626', background: '#fef2f2' }}>⚠️ {mod.last_error}</span>}
                    </div>

                    <button className={`atp-expand-btn ${isExpanded ? 'open' : ''}`} onClick={e => { e.stopPropagation(); setExpandedModule(isExpanded ? null : mod.module_key) }}>
                      {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                  </div>

                  <div className="atp-card-actions" onClick={e => e.stopPropagation()}>
                    <div style={{ textAlign: 'center' }}>
                      <button
                        className={`atp-toggle ${mod.enabled ? 'on' : ''}`}
                        onClick={() => toggleModule(mod)}
                        title={mod.enabled ? 'Nhấn để tắt' : 'Nhấn để bật'}
                      />
                      <div className="atp-toggle-label">{mod.enabled ? 'Đang bật' : 'Đang tắt'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              <div className={`atp-expand ${isExpanded ? 'open' : ''}`}>
                <div className="atp-detail-grid">
                  <div className="atp-detail-box">
                    <h4>🔄 Cách hoạt động</h4>
                    <p>{info.howItWorks}</p>
                  </div>
                  <div className="atp-detail-box">
                    <h4>📌 Bạn cần làm gì?</h4>
                    <p>{info.whatYouNeed}</p>
                  </div>
                  <div className="atp-detail-box">
                    <h4>⏰ Lịch chạy</h4>
                    <p>{info.schedule}</p>
                  </div>
                  <div className="atp-detail-box">
                    <h4>💡 Kết quả mang lại</h4>
                    <p>{info.benefit}</p>
                  </div>
                </div>

                {/* Fanpage setup form */}
                {isFanpage && (
                  <div className="atp-fb-setup">
                    <h4>🔗 Kết nối Facebook Fanpage</h4>
                    <p className="sub">Điền 2 thông tin dưới đây để hệ thống tự động đăng bài lên Fanpage của bạn</p>

                    <div className="atp-fb-step">
                      <div className="atp-fb-step-num">1</div>
                      <div className="atp-fb-step-content">
                        <label>Nhập Page ID của Fanpage</label>
                        <p className="hint">Đây là dãy số nhận dạng Fanpage. Xem hướng dẫn lấy bên dưới.</p>
                        <input
                          className="atp-fb-input"
                          placeholder="Ví dụ: 123456789012345"
                          value={fbPageId}
                          onChange={e => setFbPageId(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="atp-fb-step">
                      <div className="atp-fb-step-num">2</div>
                      <div className="atp-fb-step-content">
                        <label>Nhập Access Token</label>
                        <p className="hint">Mã bảo mật để hệ thống có quyền đăng bài. Xem hướng dẫn lấy bên dưới.</p>
                        <input
                          className="atp-fb-input"
                          type="password"
                          placeholder="Dán mã Access Token vào đây"
                          value={fbToken}
                          onChange={e => setFbToken(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="atp-fb-actions">
                      <button
                        className="atp-fb-btn primary"
                        disabled={testing === 'auto_fanpage' || !fbPageId || !fbToken}
                        onClick={testConnection}
                      >
                        {testing === 'auto_fanpage' ? '⏳ Đang kiểm tra...' : '✅ Kiểm tra & Lưu'}
                      </button>
                      <a className="atp-fb-help" href="https://developers.facebook.com/docs/pages/getting-started" target="_blank" rel="noopener noreferrer">
                        📖 Hướng dẫn lấy Page ID và Access Token →
                      </a>
                    </div>

                    {testResult && testResult.key === 'auto_fanpage' && (
                      <div className={`atp-fb-result ${testResult.ok ? 'ok' : 'fail'}`}>
                        {testResult.ok ? '🎉 ' : '❌ '}{testResult.msg}
                      </div>
                    )}

                    {hasFbConfig && !testResult && (
                      <div className="atp-fb-result ok" style={{ marginTop: 12 }}>
                        ✅ Fanpage đã được kết nối. Hệ thống sẽ tự động đăng bài.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Content status from health API */}
        {healthData?.content && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1px solid #bbf7d0', borderRadius: 14,
            padding: '20px 24px', marginBottom: 16
          }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#166534' }}>
              📊 Báo cáo nội dung
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#16a34a' }}>{healthData.content.published}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Đã đăng</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#2563eb' }}>{healthData.content.scheduled}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Chờ đăng</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginTop: 4 }}>
                  {healthData.content.nextPublish ? new Date(healthData.content.nextPublish).toLocaleDateString('vi-VN') : '—'}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Bài tiếp theo</div>
              </div>
            </div>
            {healthData.content.warning && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, fontSize: 13, color: '#92400e' }}>
                ⚠️ {healthData.content.warning}
              </div>
            )}
          </div>
        )}

        {/* Monitoring info */}
        <div style={{
          background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12,
          padding: '18px 22px', marginBottom: 16
        }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#1e40af' }}>
            🔔 Giám sát tự động
          </h4>
          <div style={{ fontSize: 13, color: '#3b82f6', lineHeight: 1.8 }}>
            <p style={{ margin: '4px 0' }}>• Hệ thống gửi <strong>báo cáo trạng thái</strong> về Telegram mỗi 6 giờ</p>
            <p style={{ margin: '4px 0' }}>• Nếu có lỗi xảy ra → thông báo ngay lập tức</p>
            <p style={{ margin: '4px 0' }}>• Cảnh báo khi bài scheduled còn dưới 7 bài</p>
            <p style={{ margin: '4px 0' }}>• Tự động kiểm tra n8n workflows có đang active không</p>
          </div>
        </div>

        {/* Help section */}
        <div style={{
          background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12,
          padding: '18px 22px', marginTop: 8
        }}>
          <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: '#374151' }}>
            ❓ Câu hỏi thường gặp
          </h4>
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
            <p style={{ margin: '6px 0' }}><strong>Tôi có cần làm gì hàng ngày không?</strong> — Không. Sau khi bật, hệ thống chạy hoàn toàn tự động 24/7.</p>
            <p style={{ margin: '6px 0' }}><strong>Bài viết AI có chất lượng không?</strong> — Bài viết được tổng hợp từ nguồn uy tín và viết lại phù hợp. Bạn có thể vào mục Bài viết để chỉnh sửa nếu cần.</p>
            <p style={{ margin: '6px 0' }}><strong>Tôi muốn tạm dừng?</strong> — Nhấn nút tắt (toggle) bên cạnh tính năng muốn dừng. Bật lại bất kỳ lúc nào.</p>
            <p style={{ margin: '6px 0' }}><strong>Cần hỗ trợ?</strong> — Liên hệ bộ phận kỹ thuật qua email hoặc hotline.</p>
          </div>
        </div>
      </div>
    </>
  )
}
