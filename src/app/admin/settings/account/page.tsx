'use client'
export default function AccountPage() {
  return (
    <div>
      <div className="page-header"><h1>Thông tin tài khoản</h1></div>
      <div className="card form-layout">
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:'#e8f0fe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700,color:'#007acc'}}>A</div>
          <div><strong style={{fontSize:16}}>Admin</strong><br/><small style={{color:'#888'}}>admin@shinhanfinance.com</small></div>
        </div>
        <div className="form-group"><label>Họ tên</label><input type="text" defaultValue="Admin" /></div>
        <div className="form-group"><label>Email</label><input type="email" defaultValue="admin@shinhanfinance.com" /></div>
        <div className="form-group"><label>Vai trò</label><input type="text" value="Quản trị viên" disabled style={{background:'#f3f4f6'}} /></div>
        <h3 style={{margin:'24px 0 12px',fontSize:14,color:'#5f6b7a'}}>Đổi mật khẩu</h3>
        <div className="form-group"><label>Mật khẩu hiện tại</label><input type="password" /></div>
        <div className="form-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="form-group"><label>Mật khẩu mới</label><input type="password" /></div>
          <div className="form-group"><label>Xác nhận</label><input type="password" /></div>
        </div>
        <div className="form-actions"><button className="btn-primary">Lưu thay đổi</button></div>
      </div>
    </div>
  )
}
