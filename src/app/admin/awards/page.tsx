'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type Award = { id: string; name: string; image: string; year: number; order_index: number; visible: boolean }

export default function AwardsPage() {
  const [items, setItems] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', image: '', year: new Date().getFullYear(), order_index: 1, visible: true })
  const [editId, setEditId] = useState<string | null>(null)

  const fetchData = () => { setLoading(true); fetch('/api/cms/awards').then(r => r.json()).then(res => { setItems(res.data || []); setLoading(false) }).catch(() => setLoading(false)) }
  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) { await fetch(`/api/cms/awards/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }) }
    else { await fetch('/api/cms/awards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }) }
    setShowForm(false); setEditId(null); setForm({ name: '', image: '', year: new Date().getFullYear(), order_index: 1, visible: true }); fetchData()
  }

  const startEdit = (a: Award) => { setForm({ name: a.name, image: a.image, year: a.year, order_index: a.order_index, visible: a.visible }); setEditId(a.id); setShowForm(true) }
  const deleteItem = async (id: string) => { if (!confirm('Xóa giải thưởng này?')) return; await fetch(`/api/cms/awards/${id}`, { method: 'DELETE' }); fetchData() }

  return (
    <div>
      <div className="page-header"><h1>Giải thưởng</h1><button className="btn-primary" onClick={() => { setShowForm(true); setEditId(null) }}>+ Thêm giải thưởng</button></div>
      {showForm && (
        <form onSubmit={handleSubmit} className="card form-layout" style={{marginBottom:16}}>
          <div className="form-group"><label>Tên giải thưởng</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div className="form-group"><label>URL ảnh</label><input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
            <div className="form-group"><label>Năm</label><input type="number" value={form.year} onChange={e => setForm({...form, year: parseInt(e.target.value)})} /></div>
          </div>
          <div className="form-actions"><button type="submit" className="btn-primary">{editId ? 'Cập nhật' : 'Thêm'}</button><button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Hủy</button></div>
        </form>
      )}
      {loading ? <div className="card"><p style={{textAlign:'center',padding:'2rem',color:'#888'}}>Đang tải...</p></div> : items.length === 0 ? <div className="card empty-state"><p>Chưa có giải thưởng nào</p></div> : (
        <div className="card">
          <table className="data-table" style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={{width:60}}>Năm</th><th style={{width:80}}>Ảnh</th><th>Tên giải thưởng</th><th style={{width:80}}>Thao tác</th></tr></thead>
            <tbody>{items.map(a => (
              <tr key={a.id}><td>{a.year}</td><td>{a.image && <Image src={a.image} alt={a.name} width={50} height={50} style={{objectFit:'contain'}} />}</td><td><strong>{a.name}</strong></td><td><div className="action-buttons"><button onClick={() => startEdit(a)} className="btn-action btn-edit">Sửa</button><button onClick={() => deleteItem(a.id)} className="btn-action btn-delete">Xóa</button></div></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
