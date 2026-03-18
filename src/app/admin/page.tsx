'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type DashboardStats = {
  leads: number
  posts: number
  products: number
  sliders: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ leads: 0, posts: 0, products: 0, sliders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/leads').then(r => r.json()).then(d => d.data?.length || 0).catch(() => 0),
      fetch('/api/cms/posts').then(r => r.json()).then(d => d.data?.length || 0).catch(() => 0),
      fetch('/api/cms/products').then(r => r.json()).then(d => d.data?.length || 0).catch(() => 0),
      fetch('/api/cms/sliders?all=true').then(r => r.json()).then(d => d.data?.length || 0).catch(() => 0),
    ]).then(([leads, posts, products, sliders]) => {
      setStats({ leads, posts, products, sliders })
      setLoading(false)
    })
  }, [])

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
        <div className="stat-card">
          <div className="stat-card-label">Slider / Banner</div>
          <div className="stat-card-value">{loading ? '...' : stats.sliders}</div>
          <div className="stat-card-change">{stats.sliders > 0 ? `${stats.sliders} slider` : 'Chưa thêm slider'}</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="section-header">
        <h2 className="section-title">Thao tác nhanh</h2>
      </div>
      <div className="quick-actions">
        <Link href="/admin/posts" className="quick-action">
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
        <Link href="/admin/leads?type=loan" className="quick-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          Xem leads mới
        </Link>
        <Link href="/admin/appearance/homepage" className="quick-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          Tùy chỉnh giao diện
        </Link>
      </div>

      {/* Recent leads */}
      <div className="section-header">
        <h2 className="section-title">Đơn đăng ký gần đây</h2>
        <Link href="/admin/leads?type=loan" className="section-link">Xem tất cả</Link>
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
          <tr>
            <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
              Chưa có đơn đăng ký nào
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
