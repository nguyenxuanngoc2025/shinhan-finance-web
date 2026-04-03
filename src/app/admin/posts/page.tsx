'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  slug: string
  category: string
  status: string
  seo_score: number
  created_at: string
  published_at: string
  source: string
  cover_image: string
  keyword_target: string
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  published: { label: 'Đã xuất bản', className: 'badge-done' },
  scheduled: { label: 'Lên lịch', className: 'badge-scheduled' },
  draft: { label: 'Bản nháp', className: 'badge-new' },
}

const CATEGORY_LABELS: Record<string, string> = {
  blog: 'Blog',
  'khuyen-mai': 'Khuyến mại',
  'su-kien': 'Sự kiện',
  'thong-bao': 'Thông báo',
}

type FilterStatus = 'all' | 'published' | 'scheduled' | 'draft'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const ITEMS_PER_PAGE = 50

  useEffect(() => {
    fetchPosts(page, filter)
  }, [page, filter])

  async function fetchPosts(currentPage: number, currentFilter: FilterStatus) {
    setLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams({
        status: currentFilter === 'all' ? 'all' : currentFilter,
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString()
      })

      const res = await fetch(`/api/cms/posts?${params.toString()}`)
      const json = await res.json()
      
      setPosts(json.data || [])
      if (json.pagination) {
        setTotalPages(json.pagination.totalPages || 1)
        setTotalItems(json.pagination.total || 0)
      }

    } catch (e) {
      console.error('Fetch posts error:', e)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(newFilter: FilterStatus) {
    setFilter(newFilter)
    setPage(1) // Reset to first page
  }

  async function deletePost(id: string) {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return
    await fetch(`/api/cms/posts/${id}`, { method: 'DELETE' })
    fetchPosts(page, filter)
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  function getScheduleInfo(post: Post) {
    if (post.status !== 'scheduled' || !post.published_at) return null
    const pubDate = new Date(post.published_at)
    const now = new Date()
    const diff = Math.ceil((pubDate.getTime() - now.getTime()) / 86400000)
    if (diff <= 0) return 'Hôm nay'
    if (diff === 1) return 'Ngày mai'
    return `${diff} ngày nữa`
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Bài viết</h1>
        <Link href="/admin/posts/new" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Tạo bài viết
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: 20, padding: '4px',
        background: 'var(--bg-secondary, #f5f5f5)', borderRadius: '8px', width: 'fit-content'
      }}>
        {(['all', 'published', 'scheduled', 'draft'] as FilterStatus[]).map(s => (
          <button
            key={s}
            onClick={() => handleFilterChange(s)}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: filter === s ? 600 : 400,
              background: filter === s ? '#fff' : 'transparent',
              color: filter === s ? 'var(--accent, #007bc3)' : '#666',
              boxShadow: filter === s ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {s === 'all' ? 'Tất cả' : STATUS_CONFIG[s]?.label || s}
            {filter === s && (
              <span style={{
                marginLeft: 6, fontSize: '0.7rem', opacity: 0.7,
                background: 'var(--accent, #007bc3)',
                color: '#fff',
                padding: '1px 6px', borderRadius: '10px',
              }}>
                {totalItems}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">Đang tải...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ opacity: 0.3, marginBottom: 12 }}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>{filter === 'all' ? 'Chưa có bài viết nào' : `Không có bài viết ${STATUS_CONFIG[filter]?.label || ''}`}</p>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>{filter === 'scheduled' ? 'Ngày đăng dự kiến' : 'Ngày'}</th>
                <th>SEO</th>
                <th style={{ width: 100 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => {
                const sConfig = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft
                const scheduleInfo = getScheduleInfo(post)
                return (
                  <tr key={post.id}>
                    <td>
                      {post.cover_image ? (
                        <div style={{
                          width: 36, height: 36, borderRadius: '6px', overflow: 'hidden',
                          background: '#f0f0f0', flexShrink: 0
                        }}>
                          <img src={post.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: '6px',
                          background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td>
                      <Link href={`/admin/posts/${post.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                        {post.title}
                      </Link>
                      {post.keyword_target && (
                        <div style={{ fontSize: '0.7rem', color: '#999', marginTop: 2 }}>
                          {post.keyword_target}
                        </div>
                      )}
                    </td>
                    <td>{CATEGORY_LABELS[post.category] || post.category || '—'}</td>
                    <td>
                      <span className={`badge ${sConfig.className}`}>{sConfig.label}</span>
                      {scheduleInfo && (
                        <div style={{ fontSize: '0.7rem', color: '#e8a54b', marginTop: 2 }}>{scheduleInfo}</div>
                      )}
                    </td>
                    <td>
                      {post.status === 'scheduled'
                        ? formatDate(post.published_at)
                        : formatDate(post.published_at || post.created_at)
                      }
                    </td>
                    <td>{post.seo_score ? `${post.seo_score}/100` : '—'}</td>
                    <td>
                      <div className="action-btns">
                        <Link href={`/admin/posts/${post.id}`} className="action-btn" title="Sửa">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </Link>
                        <button className="action-btn danger" onClick={() => deletePost(post.id)} title="Xóa">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
              marginTop: '24px', padding: '16px 0', borderTop: '1px solid #eee'
            }}>
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="btn-action"
                style={{ padding: '6px 12px', background: '#fff', border: '1px solid #ddd' }}
              >
                Trước
              </button>
              
              <div style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>
                Trang {page} / {totalPages}
                <span style={{ marginLeft: '12px', color: '#999', fontWeight: 400 }}>
                  ({totalItems} bài viết)
                </span>
              </div>
              
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="btn-action"
                style={{ padding: '6px 12px', background: '#fff', border: '1px solid #ddd' }}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}

