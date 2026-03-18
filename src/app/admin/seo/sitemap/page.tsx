'use client'
export default function SeoSitemapPage() {
  return (
    <div>
      <div className="page-header"><h1>Sitemap</h1></div>
      <div className="card" style={{padding:20}}>
        <h3 style={{fontSize:14,marginBottom:12}}>Sitemap tự động</h3>
        <p style={{fontSize:13,color:'#5f6b7a'}}>Sitemap được tạo tự động từ danh sách trang đã xuất bản. Truy cập tại:</p>
        <div style={{display:'flex',gap:12,marginTop:12,flexWrap:'wrap'}}>
          <a href="/sitemap.xml" target="_blank" rel="noopener" className="btn-primary" style={{textDecoration:'none'}}>Xem sitemap.xml ↗</a>
          <a href="/robots.txt" target="_blank" rel="noopener" className="btn-secondary" style={{textDecoration:'none'}}>Xem robots.txt ↗</a>
        </div>
        <div style={{background:'#f8f9fb',borderRadius:8,padding:16,marginTop:24}}>
          <strong style={{fontSize:13}}>Các URL trong sitemap:</strong>
          <ul style={{fontSize:13,color:'#5f6b7a',marginTop:8,paddingLeft:20}}>
            <li><code>/</code> — Trang chủ</li>
            <li><code>/san-pham/*</code> — Trang sản phẩm</li>
            <li><code>/tin-tuc/*</code> — Bài viết tin tức</li>
            <li><code>/dang-ky-vay</code> — Form đăng ký</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
