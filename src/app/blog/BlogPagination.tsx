'use client'

import Link from 'next/link'

export default function BlogPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem'
    }}>
      <Link
        href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : '#'}
        aria-disabled={currentPage === 1}
        style={{
          padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd',
          background: currentPage === 1 ? '#f5f5f5' : '#fff',
          cursor: currentPage === 1 ? 'default' : 'pointer',
          textDecoration: 'none', color: '#333',
          pointerEvents: currentPage === 1 ? 'none' : 'auto',
        }}
      >
        ← Trước
      </Link>
      <span style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
        Trang {currentPage}/{totalPages}
      </span>
      <Link
        href={currentPage < totalPages ? `/blog?page=${currentPage + 1}` : '#'}
        aria-disabled={currentPage === totalPages}
        style={{
          padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd',
          background: currentPage === totalPages ? '#f5f5f5' : '#fff',
          cursor: currentPage === totalPages ? 'default' : 'pointer',
          textDecoration: 'none', color: '#333',
          pointerEvents: currentPage === totalPages ? 'none' : 'auto',
        }}
      >
        Sau →
      </Link>
    </div>
  )
}
