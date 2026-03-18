'use client'
export default function AppearanceFooterPage() {
  return (
    <div>
      <div className="page-header"><h1>Footer</h1></div>
      <div className="card form-layout">
        <div className="form-group"><label>Hiển thị logo footer</label><select defaultValue="true"><option value="true">Có</option><option value="false">Không</option></select></div>
        <div className="form-group"><label>Số cột footer</label><select defaultValue="4"><option value="3">3 cột</option><option value="4">4 cột</option></select></div>
        <div className="form-group">
          <label>Copyright text</label>
          <input type="text" defaultValue="© 2026 Shinhan Finance. Mọi quyền được bảo lưu." />
        </div>
        <div className="form-group">
          <label>Mạng xã hội</label>
          <div style={{background:'#f8f9fb',borderRadius:8,padding:16}}>
            <div className="form-group"><label style={{fontSize:12}}>Facebook</label><input type="text" defaultValue="https://facebook.com/shinhanfinancevn" /></div>
            <div className="form-group"><label style={{fontSize:12}}>Zalo</label><input type="text" defaultValue="https://zalo.me/shinhanfinancevn" /></div>
            <div className="form-group"><label style={{fontSize:12}}>YouTube</label><input type="text" defaultValue="https://youtube.com/@shinhanfinancevn" /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
