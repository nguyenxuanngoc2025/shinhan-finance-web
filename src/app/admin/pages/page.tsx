'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type PageInfo = {
  slug: string
  title: string
  editable: boolean
}

const PAGE_ROUTES: Record<string, { path: string; description: string }> = {
  'san-pham': { path: '/san-pham', description: 'Danh sách sản phẩm tài chính (vay tín chấp, trả góp, thẻ tín dụng)' },
  'dang-ky-vay': { path: '/dang-ky-vay', description: 'Form đăng ký vay trực tuyến' },
  'mo-the': { path: '/mo-the', description: 'Đăng ký mở thẻ tín dụng THE FIRST' },
  'hoi-dap': { path: '/hoi-dap', description: 'Câu hỏi thường gặp' },
  'chinh-sach-bao-mat': { path: '/chinh-sach-bao-mat', description: 'Chính sách bảo mật thông tin' },
  'huong-dan-thanh-toan': { path: '/huong-dan-thanh-toan', description: 'Hướng dẫn các phương thức thanh toán' },
  'mien-tru-trach-nhiem': { path: '/mien-tru-trach-nhiem', description: 'Điều khoản miễn trừ trách nhiệm' },
  'quy-tac-ung-xu': { path: '/quy-tac-ung-xu', description: 'Quy tắc ứng xử doanh nghiệp' },
  'trach-nhiem-xa-hoi': { path: '/trach-nhiem-xa-hoi', description: 'Hoạt động trách nhiệm xã hội CSR' },
}

const SUB_PAGES = [
  { slug: 'san-pham/vay-tin-chap', title: 'Vay tín chấp cá nhân', parent: 'san-pham', path: '/san-pham/vay-tin-chap', description: 'Chi tiết sản phẩm vay tín chấp, bảng tính lãi, FAQ' },
  { slug: 'san-pham/vay-tra-gop', title: 'Vay trả góp', parent: 'san-pham', path: '/san-pham/vay-tra-gop', description: 'Chi tiết sản phẩm vay trả góp, bảng tính, FAQ' },
  { slug: 'san-pham/the-tin-dung', title: 'Thẻ tín dụng THE FIRST', parent: 'san-pham', path: '/san-pham/the-tin-dung', description: 'Chi tiết thẻ tín dụng, ưu đãi, biểu phí' },
]

export default function PagesManagement() {
  const [pages, setPages] = useState<PageInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cms/settings?key=pages')
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          const list = Object.entries(res.data).map(([slug, info]) => ({
            slug,
            title: (info as Record<string, string>).title,
            editable: (info as Record<string, boolean>).editable,
          }))
          setPages(list)
        }
      })
      .catch(() => {
        setPages(Object.entries(PAGE_ROUTES).map(([slug]) => ({
          slug, title: PAGE_ROUTES[slug].description.split('(')[0].trim(), editable: true,
        })))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <style>{`
        .pages-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .pages-header h1 { font-size: 20px; font-weight: 700; margin: 0; }
        .page-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 8px; overflow: hidden; transition: all 0.15s; }
        .page-card:hover { border-color: #0078D4; box-shadow: 0 2px 8px rgba(0,120,212,0.08); }
        .page-row { display: flex; align-items: center; padding: 12px 16px; gap: 12px; }
        .page-icon { width: 36px; height: 36px; background: #f0f7ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .page-icon svg { width: 18px; height: 18px; color: #0078D4; }
        .page-info { flex: 1; min-width: 0; }
        .page-title { font-size: 14px; font-weight: 600; color: #1a1a2e; }
        .page-path { font-size: 12px; color: #9ca3af; font-family: monospace; }
        .page-desc { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .page-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .page-btn { padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; font-size: 12px; cursor: pointer; color: #374151; transition: all 0.12s; text-decoration: none; display: flex; align-items: center; gap: 4px; }
        .page-btn:hover { border-color: #0078D4; color: #0078D4; }
        .page-btn.primary { background: #0078D4; color: #fff; border-color: #0078D4; }
        .page-btn.primary:hover { background: #005a9e; }
        .sub-pages { padding: 0 16px 12px 64px; }
        .sub-page-row { display: flex; align-items: center; padding: 8px 12px; gap: 8px; border-left: 2px solid #e5e7eb; margin-left: 4px; }
        .sub-page-row:hover { border-left-color: #0078D4; }
        .section-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding: 16px 0 6px; }
        .rates-link { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: linear-gradient(135deg, #0078D4 0%, #00b4d8 100%); border-radius: 10px; color: #fff; text-decoration: none; margin-bottom: 20px; transition: transform 0.15s; }
        .rates-link:hover { transform: translateY(-1px); }
        .rates-link h3 { font-size: 14px; margin: 0; }
        .rates-link p { font-size: 12px; opacity: 0.8; margin: 2px 0 0; }
      `}</style>

      <div className="pages-header">
        <h1>Quản lý Trang</h1>
      </div>

      <Link href="/admin/settings/rates" className="rates-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/></svg>
        <div>
          <h3>Quản lý Lãi suất &amp; Công thức</h3>
          <p>Chỉnh sửa % lãi suất, hạn mức vay, kỳ hạn — tự cập nhật trên toàn website</p>
        </div>
      </Link>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Đang tải...</div>
      ) : (
        <>
          <div className="section-label">Trang chính</div>
          {pages.map(page => {
            const route = PAGE_ROUTES[page.slug]
            const subs = SUB_PAGES.filter(s => s.parent === page.slug)
            return (
              <div key={page.slug} className="page-card">
                <div className="page-row">
                  <div className="page-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div className="page-info">
                    <div className="page-title">{page.title}</div>
                    <div className="page-path">{route?.path || `/${page.slug}`}</div>
                    {route?.description && <div className="page-desc">{route.description}</div>}
                  </div>
                  <div className="page-actions">
                    <a href={route?.path || `/${page.slug}`} target="_blank" rel="noopener" className="page-btn">Xem</a>
                  </div>
                </div>
                {subs.length > 0 && (
                  <div className="sub-pages">
                    {subs.map(sub => (
                      <div key={sub.slug} className="sub-page-row">
                        <div className="page-info">
                          <div className="page-title" style={{ fontSize: 13 }}>{sub.title}</div>
                          <div className="page-path">{sub.path}</div>
                        </div>
                        <div className="page-actions">
                          <a href={sub.path} target="_blank" rel="noopener" className="page-btn">Xem</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <div className="section-label" style={{ marginTop: 20 }}>Trang hệ thống</div>
          <div className="page-card">
            <div className="page-row">
              <div className="page-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div>
              <div className="page-info"><div className="page-title">Trang chủ</div><div className="page-path">/</div></div>
              <div className="page-actions"><a href="/" target="_blank" rel="noopener" className="page-btn">Xem</a></div>
            </div>
          </div>
          <div className="page-card">
            <div className="page-row">
              <div className="page-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4z" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/></svg></div>
              <div className="page-info"><div className="page-title">Bản tin &amp; Tin tức</div><div className="page-path">/tin-tuc</div></div>
              <div className="page-actions">
                <Link href="/admin/posts" className="page-btn primary">Quản lý</Link>
                <a href="/tin-tuc" target="_blank" rel="noopener" className="page-btn">Xem</a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
