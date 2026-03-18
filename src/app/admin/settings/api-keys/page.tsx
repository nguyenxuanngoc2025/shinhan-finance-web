'use client'
import { useState } from 'react'

type ApiKey = { id: string; name: string; key: string; created: string; active: boolean }

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: '1', name: 'N8N Integration', key: 'sk_live_shinhan_n8n_xxxxx', created: '2026-03-01', active: true },
    { id: '2', name: 'Mobile App', key: 'sk_live_shinhan_app_xxxxx', created: '2026-03-15', active: false },
  ])
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')

  const createKey = () => {
    if (!newName) return
    const newKey = { id: Date.now().toString(), name: newName, key: `sk_live_shinhan_${Math.random().toString(36).substr(2,8)}`, created: new Date().toISOString().split('T')[0], active: true }
    setKeys([...keys, newKey]); setNewName(''); setShowNew(false)
  }

  const toggleKey = (id: string) => setKeys(keys.map(k => k.id === id ? {...k, active: !k.active} : k))
  const deleteKey = (id: string) => { if (confirm('Xóa API key này?')) setKeys(keys.filter(k => k.id !== id)) }

  return (
    <div>
      <div className="page-header"><h1>API Keys</h1><button className="btn-primary" onClick={() => setShowNew(true)}>+ Tạo API Key</button></div>
      {showNew && (
        <div className="card form-layout" style={{marginBottom:16}}>
          <div className="form-group"><label>Tên API Key</label><input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="VD: N8N Workflow" /></div>
          <div className="form-actions"><button className="btn-primary" onClick={createKey}>Tạo</button><button className="btn-secondary" onClick={() => setShowNew(false)}>Hủy</button></div>
        </div>
      )}
      <div className="card">
        <table className="data-table" style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><th>Tên</th><th>API Key</th><th>Ngày tạo</th><th style={{width:80}}>Trạng thái</th><th style={{width:100}}>Thao tác</th></tr></thead>
          <tbody>{keys.map(k => (
            <tr key={k.id}>
              <td><strong>{k.name}</strong></td>
              <td><code style={{fontSize:12,background:'#f3f4f6',padding:'2px 6px',borderRadius:4}}>{k.key.substring(0,20)}...</code></td>
              <td><small>{k.created}</small></td>
              <td><button onClick={() => toggleKey(k.id)} style={{background:k.active?'#28a745':'#ccc',color:'#fff',border:'none',borderRadius:12,padding:'2px 10px',fontSize:12,cursor:'pointer'}}>{k.active ? 'Bật' : 'Tắt'}</button></td>
              <td><button onClick={() => deleteKey(k.id)} className="btn-action btn-delete">Xóa</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
