'use client'
import { useState, useEffect } from 'react'

type Block = { id: string; block_type: string; template: string; content: any; order_index: number; visible: boolean }

export default function AppearanceHomepagePage() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cms/homepage-blocks').then(r => r.json()).then(res => { setBlocks(res.data || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const BLOCK_LABELS: Record<string, string> = { hero_slider: 'Banner Slider', product_grid: 'Sản phẩm', value_props: 'Giá trị', testimonials: 'Đánh giá KH', news_grid: 'Tin tức', partners: 'Đối tác', awards: 'Giải thưởng' }

  return (
    <div>
      <div className="page-header"><h1>Bố cục trang chủ</h1></div>
      {loading ? <div className="card"><p style={{textAlign:'center',padding:'2rem'}}>Đang tải...</p></div> : (
        <div className="card" style={{padding:20}}>
          <p style={{fontSize:13,color:'#5f6b7a',marginBottom:16}}>Kéo thả để sắp xếp các section trên trang chủ</p>
          {blocks.length === 0 ? <p style={{color:'#888'}}>Chưa có block nào. Seed data sẽ tự tạo các blocks mặc định.</p> : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {blocks.sort((a,b) => a.order_index - b.order_index).map(b => (
                <div key={b.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',background:b.visible?'#f8f9fb':'#fce8e6',borderRadius:8,border:'1px solid #e5e7eb'}}>
                  <span style={{cursor:'grab',color:'#9ca3af'}}>⠿</span>
                  <span style={{flex:1,fontWeight:500,fontSize:14}}>{BLOCK_LABELS[b.block_type] || b.block_type}</span>
                  <small style={{color:'#888'}}>{b.template}</small>
                  <span style={{fontSize:12,padding:'2px 8px',borderRadius:10,background:b.visible?'#e6f4ea':'#fce8e6',color:b.visible?'#1e7e34':'#c62828'}}>{b.visible ? 'Hiện' : 'Ẩn'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
