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
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/cms/posts')
      const data = await res.json()
      setPosts(data.data || [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return
    await fetch(`/api/cms/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Bài viết</h1>
        <Link href="/admin/posts/new" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Tạo bài viết
        </Link>
      </div>

      {loading ? (
        <div className="empty-state">Đang tải...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ opacity: 0.3, marginBottom: 12 }}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>Chưa có bài viết nào</p>
          <Link href="/admin/posts/new" className="btn-primary" style={{ marginTop: 12 }}>Tạo bài viết đầu tiên</Link>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>SEO</th>
              <th>Ngày tạo</th>
              <th style={{ width: 100 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td><Link href={`/admin/posts/${post.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>{post.title}</Link></td>
                <td>{post.category || '—'}</td>
                <td><span className={`badge badge-${post.status === 'published' ? 'done' : 'new'}`}>{post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span></td>
                <td>{post.seo_score ? `${post.seo_score}/100` : '—'}</td>
                <td>{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
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
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
