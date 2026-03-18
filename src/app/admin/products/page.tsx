'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  interest_rate: string
  loan_limit: string
  loan_term: string
  order_index: number
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    setLoading(true)
    fetch('/api/cms/products')
      .then(r => r.json())
      .then(res => { setProducts(res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const deleteProduct = async (id: string) => {
    if (!confirm('Xóa sản phẩm này?')) return
    await fetch(`/api/cms/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  return (
    <div>
      <div className="page-header">
        <h1>Sản phẩm</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Thêm sản phẩm</Link>
      </div>

      {loading ? (
        <div className="card"><p style={{textAlign:'center',padding:'2rem',color:'#888'}}>Đang tải...</p></div>
      ) : products.length === 0 ? (
        <div className="card empty-state">
          <p>Chưa có sản phẩm nào</p>
          <Link href="/admin/products/new" className="btn-primary">Tạo sản phẩm đầu tiên</Link>
        </div>
      ) : (
        <div className="card">
          <table className="data-table" style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Lãi suất</th>
                <th>Hạn mức</th>
                <th>Kỳ hạn</th>
                <th style={{width:'80px'}}>Trạng thái</th>
                <th style={{width:'120px'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong><br/><small style={{color:'#888'}}>/{p.slug}</small></td>
                  <td>{p.interest_rate || '—'}</td>
                  <td>{p.loan_limit || '—'}</td>
                  <td>{p.loan_term || '—'}</td>
                  <td>
                    <span style={{background: p.status === 'active' ? '#e6f4ea' : '#fce8e6', color: p.status === 'active' ? '#1e7e34' : '#c62828', padding:'2px 8px',borderRadius:'10px',fontSize:'12px'}}>
                      {p.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link href={`/admin/products/${p.id}`} className="btn-action btn-edit">Sửa</Link>
                      <button onClick={() => deleteProduct(p.id)} className="btn-action btn-delete">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
