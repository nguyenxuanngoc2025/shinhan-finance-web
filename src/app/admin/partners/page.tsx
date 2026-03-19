'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ImagePicker from '../components/ImagePicker'

type Partner = { id: string; name: string; logo: string; url: string; order_index: number; visible: boolean }

export default function PartnersPage() {
  const [items, setItems] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', logo: '', url: '', order_index: 1, visible: true })
  const [editId, setEditId] = useState<string | null>(null)

  const fetchData = () => { setLoading(true); fetch('/api/cms/partners').then(r => r.json()).then(res => { setItems(res.data || []); setLoading(false) }).catch(() => setLoading(false)) }
  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) { await fetch(`/api/cms/partners/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }) }
    else { await fetch('/api/cms/partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }) }
    setShowForm(false); setEditId(null); setForm({ name: '', logo: '', url: '', order_index: 1, visible: true }); fetchData()
  }

  const startEdit = (p: Partner) => { setForm({ name: p.name, logo: p.logo, url: p.url, order_index: p.order_index, visible: p.visible }); setEditId(p.id); setShowForm(true) }
  const deleteItem = async (id: string) => { if (!confirm('Xóa đối tác này?')) return; await fetch(`/api/cms/partners/${id}`, { method: 'DELETE' }); fetchData() }

  return (
    <div>
      <div className="page-header"><h1>Đối tác</h1><button className="btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', logo: '', url: '', order_index: 1, visible: true }) }}>+ Thêm đối tác</button></div>
      {showForm && (
        <form onSubmit={handleSubmit} className="card form-layout" style={{marginBottom:16}}>
          <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div className="form-group"><label>Tên</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label>URL website</label><input type="text" value={form.url} onChange={e => setForm({...form, url: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>Logo</label><ImagePicker value={form.logo} onChange={v => setForm({...form, logo: v})} label="Logo đối tác" aspect="logo" /></div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editId ? 'Cập nhật' : 'Thêm'}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </form>
      )}
      {loading ? <div className="card"><p style={{textAlign:'center',padding:'2rem',color:'#888'}}>Đang tải...</p></div> : items.length === 0 ? <div className="card empty-state"><p>Chưa có đối tác nào</p></div> : (
        <div className="card">
          <table className="data-table" style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={{width:60}}>#</th><th style={{width:80}}>Logo</th><th>Tên</th><th>Website</th><th style={{width:80}}>Thao tác</th></tr></thead>
            <tbody>{items.map(p => (
              <tr key={p.id}><td>{p.order_index}</td><td>{p.logo && <Image src={p.logo} alt={p.name} width={50} height={30} style={{objectFit:'contain'}} />}</td><td><strong>{p.name}</strong></td><td><small>{p.url || '—'}</small></td><td><div className="action-buttons"><button onClick={() => startEdit(p)} className="btn-action btn-edit">Sửa</button><button onClick={() => deleteItem(p.id)} className="btn-action btn-delete">Xóa</button></div></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
