'use client'
export default function AppearanceHeaderPage() {
  return (
    <div>
      <div className="page-header"><h1>Header & Menu</h1></div>
      <div className="card form-layout">
        <div className="form-group"><label>Logo vị trí</label><select defaultValue="left"><option value="left">Bên trái</option><option value="center">Chính giữa</option></select></div>
        <div className="form-group"><label>Menu chính</label>
          <div style={{background:'#f8f9fb',borderRadius:8,padding:16}}>
            <p style={{fontSize:13,color:'#5f6b7a',margin:0}}>Menu được quản lý tự động từ cấu trúc trang. Các trang được đánh dấu "Xuất bản" sẽ hiển thị trong menu.</p>
            <ul style={{fontSize:13,marginTop:8,paddingLeft:20,color:'#333'}}>
              <li>Trang chủ</li><li>Sản phẩm → Vay tín chấp, Thẻ tín dụng</li><li>Tin tức</li><li>Đăng ký vay</li>
            </ul>
          </div>
        </div>
        <div className="form-group"><label>Hiển thị hotline</label><select defaultValue="true"><option value="true">Có</option><option value="false">Không</option></select></div>
        <div className="form-group"><label>Sticky header</label><select defaultValue="true"><option value="true">Có</option><option value="false">Không</option></select></div>
      </div>
    </div>
  )
}
