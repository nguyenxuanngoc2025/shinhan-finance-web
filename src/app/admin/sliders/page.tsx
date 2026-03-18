'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Slider = {
  id: string
  title: string
  description: string
  image: string
  cta_text: string
  cta_link: string
  order_index: number
  visible: boolean
}

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSliders = () => {
    setLoading(true)
    fetch('/api/cms/sliders?all=true')
      .then(r => r.json())
      .then(res => { setSliders(res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchSliders() }, [])

  const toggleVisibility = async (id: string, visible: boolean) => {
    await fetch(`/api/cms/sliders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !visible }),
    })
    fetchSliders()
  }

  const deleteSlider = async (id: string) => {
    if (!confirm('Xóa slider này?')) return
    await fetch(`/api/cms/sliders/${id}`, { method: 'DELETE' })
    fetchSliders()
  }

  return (
    <div>
      <div className="page-header">
        <h1>Slider / Banner</h1>
        <Link href="/admin/sliders/new" className="btn-primary">+ Thêm slider</Link>
      </div>

      {loading ? (
        <div className="card"><p style={{textAlign:'center',padding:'2rem',color:'#888'}}>Đang tải...</p></div>
      ) : sliders.length === 0 ? (
        <div className="card empty-state">
          <p>Chưa có slider nào</p>
          <Link href="/admin/sliders/new" className="btn-primary">Tạo slider đầu tiên</Link>
        </div>
      ) : (
        <div className="card">
          <table className="data-table" style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{width:'60px'}}>#</th>
                <th style={{width:'80px'}}>Ảnh</th>
                <th>Tiêu đề</th>
                <th>CTA</th>
                <th style={{width:'80px'}}>Hiển thị</th>
                <th style={{width:'120px'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((s) => (
                <tr key={s.id}>
                  <td>{s.order_index}</td>
                  <td>
                    <Image src={s.image || '/images/placeholder.jpg'} alt={s.title || ''} width={60} height={36} style={{objectFit:'cover',borderRadius:'4px'}} />
                  </td>
                  <td>
                    <strong>{s.title}</strong>
                    <br/><small style={{color:'#888'}}>{s.description?.substring(0, 60)}...</small>
                  </td>
                  <td><small>{s.cta_text} → {s.cta_link}</small></td>
                  <td>
                    <button onClick={() => toggleVisibility(s.id, s.visible)} className={`btn-toggle ${s.visible ? 'active' : ''}`} style={{background:s.visible?'#28a745':'#ccc',color:'#fff',border:'none',borderRadius:'12px',padding:'2px 10px',fontSize:'12px',cursor:'pointer'}}>
                      {s.visible ? 'Bật' : 'Tắt'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link href={`/admin/sliders/${s.id}`} className="btn-action btn-edit">Sửa</Link>
                      <button onClick={() => deleteSlider(s.id)} className="btn-action btn-delete">Xóa</button>
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
