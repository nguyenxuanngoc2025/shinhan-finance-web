'use client'
export default function UsersPage() {
  const users = [
    { name: 'Admin', email: 'admin@shinhanfinance.com', role: 'Quản trị viên', lastLogin: '18/03/2026' },
  ]

  return (
    <div>
      <div className="page-header"><h1>Người dùng</h1><button className="btn-primary">+ Thêm người dùng</button></div>
      <div className="card">
        <table className="data-table" style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Đăng nhập gần nhất</th><th style={{width:80}}>Thao tác</th></tr></thead>
          <tbody>{users.map((u, i) => (
            <tr key={i}>
              <td style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:'#e8f0fe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:600,color:'#007acc'}}>{u.name[0]}</div>
                <strong>{u.name}</strong>
              </td>
              <td>{u.email}</td>
              <td><span style={{background:'#e8f0fe',color:'#007acc',padding:'2px 8px',borderRadius:10,fontSize:12}}>{u.role}</span></td>
              <td><small>{u.lastLogin}</small></td>
              <td><button className="btn-action btn-edit">Sửa</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
