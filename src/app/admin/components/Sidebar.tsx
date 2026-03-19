'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// SVG icons as inline components
const icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  page: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  article: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4z" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>,
  product: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  slider: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><polyline points="9 11 12 14 15 11"/></svg>,
  lead: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  card: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  partner: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  award: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  media: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  calculator: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  palette: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/></svg>,
  header: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>,
  footer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/></svg>,
  layout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  seo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  sitemap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="2" width="6" height="4" rx="1"/><rect x="2" y="18" width="6" height="4" rx="1"/><rect x="16" y="18" width="6" height="4" rx="1"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="5" y1="14" x2="19" y2="14"/><line x1="5" y1="14" x2="5" y2="18"/><line x1="19" y1="14" x2="19" y2="18"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  key: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
}

type MenuItem = {
  label: string
  href: string
  icon: keyof typeof icons
}

type MenuGroup = {
  id: string
  label: string
  icon: keyof typeof icons
  collapsible: boolean
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    id: 'overview',
    label: 'Tổng quan',
    icon: 'dashboard',
    collapsible: false,
    items: [{ label: 'Tổng quan', href: '/admin', icon: 'dashboard' }],
  },
  {
    id: 'content',
    label: 'Nội dung',
    icon: 'article',
    collapsible: true,
    items: [
      { label: 'Trang', href: '/admin/pages', icon: 'page' },
      { label: 'Bài viết', href: '/admin/posts', icon: 'article' },
      { label: 'Sản phẩm', href: '/admin/products', icon: 'product' },
      { label: 'Slider', href: '/admin/sliders', icon: 'slider' },
    ],
  },
  {
    id: 'customers',
    label: 'Khách hàng',
    icon: 'lead',
    collapsible: false,
    items: [{ label: 'Khách hàng', href: '/admin/leads', icon: 'lead' }],
  },
  {
    id: 'brand',
    label: 'Thương hiệu',
    icon: 'award',
    collapsible: true,
    items: [
      { label: 'Đối tác', href: '/admin/partners', icon: 'partner' },
      { label: 'Giải thưởng', href: '/admin/awards', icon: 'award' },
    ],
  },
  {
    id: 'media',
    label: 'Thư viện',
    icon: 'media',
    collapsible: false,
    items: [{ label: 'Hình ảnh', href: '/admin/media', icon: 'media' }],
  },
  {
    id: 'tools',
    label: 'Công cụ',
    icon: 'calculator',
    collapsible: true,
    items: [
      { label: 'Tính lãi suất', href: '/admin/calculators/interest_rate', icon: 'calculator' },
      { label: 'Tính khoản vay', href: '/admin/calculators/loan_payment', icon: 'calculator' },
      { label: 'Phí & Lệ phí', href: '/admin/calculators/fees', icon: 'calculator' },
    ],
  },
  {
    id: 'appearance',
    label: 'Giao diện',
    icon: 'palette',
    collapsible: true,
    items: [
      { label: 'Cài đặt chung', href: '/admin/appearance/general', icon: 'settings' },
      { label: 'Màu sắc & Font', href: '/admin/appearance/theme', icon: 'palette' },
      { label: 'Header & Menu', href: '/admin/appearance/header', icon: 'header' },
      { label: 'Footer', href: '/admin/appearance/footer', icon: 'footer' },
      { label: 'Bố cục trang chủ', href: '/admin/appearance/homepage', icon: 'layout' },
    ],
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: 'seo',
    collapsible: true,
    items: [
      { label: 'Cài đặt SEO', href: '/admin/seo/settings', icon: 'seo' },
      { label: 'Điểm SEO các trang', href: '/admin/seo/scores', icon: 'chart' },
      { label: 'Sitemap', href: '/admin/seo/sitemap', icon: 'sitemap' },
      { label: 'Robots.txt', href: '/admin/seo/robots', icon: 'file' },
    ],
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: 'settings',
    collapsible: true,
    items: [
      { label: 'Lãi suất & Tham số', href: '/admin/settings/rates', icon: 'calculator' },
      { label: 'Mã theo dõi', href: '/admin/settings/tracking', icon: 'chart' },
      { label: 'Thông tin tài khoản', href: '/admin/settings/account', icon: 'user' },
      { label: 'Người dùng', href: '/admin/settings/users', icon: 'partner' },
      { label: 'API Keys', href: '/admin/settings/api-keys', icon: 'key' },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  // Auto-detect which group has active item
  const findActiveGroup = () => {
    for (const group of menuGroups) {
      for (const item of group.items) {
        const itemPath = item.href.split('?')[0]
        if (pathname === itemPath || (itemPath !== '/admin' && pathname.startsWith(itemPath))) {
          return group.id
        }
      }
    }
    return 'overview'
  }

  const [expandedGroup, setExpandedGroup] = useState<string | null>(findActiveGroup)

  // Update expanded group when route changes
  useEffect(() => {
    setExpandedGroup(findActiveGroup())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(prev => prev === groupId ? null : groupId)
  }

  const isItemActive = (href: string) => {
    const itemPath = href.split('?')[0]
    const itemQuery = href.includes('?') ? href.split('?')[1] : ''
    const currentQuery = typeof window !== 'undefined' ? window.location.search.replace('?', '') : ''
    
    // If item has query params, match both path and query
    if (itemQuery) {
      return pathname === itemPath && currentQuery === itemQuery
    }
    // Otherwise match path only
    return pathname === itemPath || (itemPath !== '/admin' && pathname.startsWith(itemPath))
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-text">NexOn CMS</span>
          <span className="sidebar-logo-badge">v1.0</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuGroups.map((group) => {
            const isExpanded = expandedGroup === group.id
            const hasActiveItem = group.items.some(item => isItemActive(item.href))

            // Non-collapsible: render as single link
            if (!group.collapsible) {
              const item = group.items[0]
              return (
                <Link
                  key={group.id}
                  href={item.href}
                  className={`sidebar-item sidebar-item-single ${isItemActive(item.href) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  {icons[group.icon]}
                  {group.label}
                </Link>
              )
            }

            // Collapsible group
            return (
              <div key={group.id} className={`sidebar-group ${isExpanded ? 'expanded' : ''} ${hasActiveItem ? 'has-active' : ''}`}>
                <button
                  className="sidebar-group-toggle"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isExpanded}
                >
                  {icons[group.icon]}
                  <span className="sidebar-group-label">{group.label}</span>
                  <svg className="sidebar-group-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>

                <div className="sidebar-group-items" style={{ maxHeight: isExpanded ? `${group.items.length * 34}px` : '0' }}>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`sidebar-subitem ${isItemActive(item.href) ? 'active' : ''}`}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">A</div>
            <div>
              <div className="sidebar-user-name">Admin</div>
              <div className="sidebar-user-role">Quản trị viên</div>
            </div>
          </div>
          <button className="sidebar-item sidebar-logout-btn">
            {icons.logout}
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  )
}
