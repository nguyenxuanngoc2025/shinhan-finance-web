'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type DashboardStats = {
  leads: number
  posts: number
  products: number
  scheduled: number
}

type Lead = {
  id: string
  form_type: string
  full_name: string
  phone: string
  email: string
  source_page: string
  status: string
  created_at: string
}

type AutoModule = {
  key: string
  name: string
  status: 'ok' | 'warning' | 'error'
  message: string
  n8n_active?: boolean
}

type AutoHealth = {
  overall: string
  modules: AutoModule[]
  content: { published: number; scheduled: number; nextPublish: string | null; warning: string | null }
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  new: { label: 'Mới', bg: '#e3f2fd', color: '#1565c0' },
  contacted: { label: 'Đã liên hệ', bg: '#fff3e0', color: '#e65100' },
  qualified: { label: 'Tiềm năng', bg: '#e8f5e9', color: '#2e7d32' },
  converted: { label: 'Đã chuyển đổi', bg: '#e0f7fa', color: '#00695c' },
  lost: { label: 'Đã mất', bg: '#fce4ec', color: '#c62828' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ leads: 0, posts: 0, products: 0, scheduled: 0 })
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [autoHealth, setAutoHealth] = useState<AutoHealth | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/leads').then(r => r.json()).then(d => {
        const leads = d.data || []
        setRecentLeads(leads.slice(0, 5))
        return leads.length
      }).catch(() => 0),
      fetch('/api/cms/posts').then(r => r.json()).then(d => {
        const all = d.data || []
        const scheduled = all.filter((p: { status: string }) => p.status === 'scheduled').length
        return { total: all.length, scheduled }
      }).catch(() => ({ total: 0, scheduled: 0 })),
      fetch('/api/cms/products').then(r => r.json()).then(d => d.data?.length || 0).catch(() => 0),
      fetch('/api/cms/automation-health?secret=shinhan2026').then(r => r.json()).catch(() => null),
    ]).then(([leads, postData, products, health]) => {
      const pd = postData as { total: number; scheduled: number }
      setStats({ leads: leads as number, posts: pd.total, products, scheduled: pd.scheduled })
      if (health?.modules) setAutoHealth(health)
      setLoading(false)
    })
  }, [])

  const statusEmoji = (s: string) => s === 'ok' ? '🟢' : s === 'warning' ? '🟡' : '🔴'

  return (
    <>
      <h1 className="page-title">Tổng quan</h1>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-label">Tổng Leads</div>
          <div className="stat-card-value">{loading ? '...' : stats.leads}</div>
          <div className="stat-card-change">{stats.leads > 0 ? `${stats.leads} đơn đăng ký` : 'Chưa có dữ liệu'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Tổng bài viết</div>
          <div className="stat-card-value">{loading ? '...' : stats.posts}</div>
          <div className="stat-card-change">{stats.posts > 0 ? `${stats.posts} bài viết` : 'Chưa có bài viết'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Sản phẩm</div>
          <div className="stat-card-value">{loading ? '...' : stats.products}</div>
          <div className="stat-card-change">{stats.products > 0 ? `${stats.products} sản phẩm` : 'Chưa thêm sản phẩm'}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid #16a34a' }}>
          <div className="stat-card-label">📅 Bài lên lịch</div>
          <div className="stat-card-value">{loading ? '...' : stats.scheduled}</div>
          <div className="stat-card-change" style={{ color: '#16a34a' }}>Tự đăng khi đến hạn</div>
        </div>
      </div>

      {/* Automation Status */}
      {autoHealth && (
        <>
          <div className="section-header">
            <h2 className="section-title">🤖 Tự động hóa</h2>
            <Link href="/admin/settings/automation" className="section-link">Quản lý →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 28 }}>
            {autoHealth.modules.map(m => (
              <div key={m.key} style={{
                background: '#fff',
                border: `1px solid ${m.status === 'ok' ? '#d1fae5' : m.status === 'warning' ? '#fef3c7' : '#fecaca'}`,
                borderRadius: 10,
                padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span>{statusEmoji(m.status)}</span>
                  <strong style={{ fontSize: 13, color: '#1f2937' }}>{m.name}</strong>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{m.message}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Quick actions */}
      <div className="section-header">
        <h2 className="section-title">Thao tác nhanh</h2>
      </div>
      <div className="quick-actions">
        <Link href="/admin/posts/new" className="quick-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Tạo bài viết mới
        </Link>
        <Link href="/admin/products" className="quick-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Thêm sản phẩm
        </Link>
        <Link href="/admin/leads" className="quick-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          Xem leads mới
        </Link>
        <Link href="/admin/settings/rates" className="quick-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          Cài đặt lãi suất
        </Link>
      </div>

      {/* Recent leads */}
      <div className="section-header">
        <h2 className="section-title">Đơn đăng ký gần đây</h2>
        <Link href="/admin/leads" className="section-link">Xem tất cả</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Loại</th>
            <th>Điện thoại</th>
            <th>Nguồn</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                Đang tải...
              </td>
            </tr>
          ) : recentLeads.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                Chưa có đơn đăng ký nào
              </td>
            </tr>
          ) : (
            recentLeads.map(lead => {
              const st = STATUS_MAP[lead.status] || STATUS_MAP.new
              return (
                <tr key={lead.id}>
                  <td>
                    <strong>{lead.full_name}</strong>
                    {lead.email && <><br/><small style={{ color: '#888' }}>{lead.email}</small></>}
                  </td>
                  <td>{lead.form_type === 'loan' ? '💰 Vay' : '💳 Thẻ'}</td>
                  <td>{lead.phone}</td>
                  <td><small>{lead.source_page || '—'}</small></td>
                  <td>
                    <span style={{
                      background: st.bg,
                      color: st.color,
                      padding: '2px 10px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      {st.label}
                    </span>
                  </td>
                  <td>
                    <small title={formatDate(lead.created_at)}>{timeAgo(lead.created_at)}</small>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </>
  )
}

