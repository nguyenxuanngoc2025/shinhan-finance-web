'use client'

import { useState, useEffect } from 'react'

type Lead = {
  id: string
  form_type: string
  full_name: string
  phone: string
  email: string
  id_number: string
  income: string
  loan_amount: string
  card_type: string
  source_page: string
  status: string
  notes: string
  created_at: string
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  new: { label: 'Mới', bg: '#e3f2fd', color: '#1565c0' },
  contacted: { label: 'Đã liên hệ', bg: '#fff3e0', color: '#e65100' },
  qualified: { label: 'Tiềm năng', bg: '#e8f5e9', color: '#2e7d32' },
  converted: { label: 'Đã chuyển đổi', bg: '#e0f7fa', color: '#00695c' },
  lost: { label: 'Đã mất', bg: '#fce4ec', color: '#c62828' },
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const fetchLeads = () => {
    setLoading(true)
    fetch('/api/cms/leads')
      .then(r => r.json())
      .then(res => { setLeads(res.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchLeads() }, [])

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.form_type === filter || l.status === filter)

  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <div className="page-header">
        <h1>Đăng ký vay / Mở thẻ</h1>
        <span style={{color:'#888',fontSize:'14px'}}>{leads.length} đơn đăng ký</span>
      </div>

      {/* Filter tabs */}
      <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'loan', label: 'Đăng ký vay' },
          { key: 'card', label: 'Mở thẻ' },
          { key: 'new', label: 'Mới' },
          { key: 'contacted', label: 'Đã liên hệ' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{padding:'6px 14px',borderRadius:'8px',border: filter === f.key ? '2px solid #0078D4' : '1px solid #e0e0e0',background: filter === f.key ? '#e3f2fd' : '#fff',color: filter === f.key ? '#0078D4' : '#333',cursor:'pointer',fontSize:'13px',fontWeight: filter === f.key ? 600 : 400}}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card"><p style={{textAlign:'center',padding:'2rem',color:'#888'}}>Đang tải...</p></div>
      ) : filteredLeads.length === 0 ? (
        <div className="card empty-state">
          <p>Chưa có đơn đăng ký nào</p>
          <small>Đơn đăng ký sẽ xuất hiện khi khách hàng gửi form trên website</small>
        </div>
      ) : (
        <div className="card">
          <table className="data-table" style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
                <th style={{width:'80px'}}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(l => {
                const st = STATUS_MAP[l.status] || STATUS_MAP.new
                return (
                  <tr key={l.id}>
                    <td><strong>{l.full_name}</strong>{l.email && <><br/><small style={{color:'#888'}}>{l.email}</small></>}</td>
                    <td>{l.phone}</td>
                    <td>{l.form_type === 'loan' ? 'Vay' : 'Thẻ'}</td>
                    <td><span style={{background:st.bg,color:st.color,padding:'2px 8px',borderRadius:'10px',fontSize:'12px'}}>{st.label}</span></td>
                    <td><small>{formatDate(l.created_at)}</small></td>
                    <td><button onClick={() => setSelectedLead(l)} className="btn-action btn-edit">Xem</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selectedLead && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={() => setSelectedLead(null)}>
          <div style={{background:'#fff',borderRadius:'12px',padding:'24px',maxWidth:'500px',width:'90%',maxHeight:'80vh',overflowY:'auto'}} onClick={e => e.stopPropagation()}>
            <h3 style={{margin:'0 0 16px'}}>Chi tiết đơn đăng ký</h3>
            <div style={{display:'grid',gap:'12px'}}>
              <div><strong>Họ tên:</strong> {selectedLead.full_name}</div>
              <div><strong>Số điện thoại:</strong> {selectedLead.phone}</div>
              {selectedLead.email && <div><strong>Email:</strong> {selectedLead.email}</div>}
              {selectedLead.id_number && <div><strong>CMND/CCCD:</strong> {selectedLead.id_number}</div>}
              {selectedLead.income && <div><strong>Thu nhập:</strong> {selectedLead.income}</div>}
              {selectedLead.loan_amount && <div><strong>Số tiền vay:</strong> {selectedLead.loan_amount}</div>}
              {selectedLead.card_type && <div><strong>Loại thẻ:</strong> {selectedLead.card_type}</div>}
              <div><strong>Loại form:</strong> {selectedLead.form_type === 'loan' ? 'Đăng ký vay' : 'Mở thẻ'}</div>
              <div><strong>Trạng thái:</strong> {STATUS_MAP[selectedLead.status]?.label || selectedLead.status}</div>
              {selectedLead.source_page && <div><strong>Trang nguồn:</strong> {selectedLead.source_page}</div>}
              <div><strong>Ngày gửi:</strong> {formatDate(selectedLead.created_at)}</div>
              {selectedLead.notes && <div><strong>Ghi chú:</strong> {selectedLead.notes}</div>}
            </div>
            <button onClick={() => setSelectedLead(null)} className="btn-primary" style={{marginTop:'20px',width:'100%'}}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  )
}
