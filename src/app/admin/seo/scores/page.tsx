'use client'
import { useState, useEffect } from 'react'

type PageSeo = { title: string; slug: string; seo_title: string; seo_description: string; seo_score: number }

export default function SeoScoresPage() {
  const [pages, setPages] = useState<PageSeo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cms/pages').then(r => r.json()).then(res => { setPages(res.data || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const avgScore = pages.length > 0 ? Math.round(pages.reduce((a, p) => a + (p.seo_score || 0), 0) / pages.length) : 0

  return (
    <div>
      <div className="page-header"><h1>Điểm SEO các trang</h1></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
        <div className="card" style={{padding:16,textAlign:'center'}}><div style={{fontSize:32,fontWeight:700,color:avgScore>70?'#28a745':avgScore>40?'#ffc107':'#dc3545'}}>{avgScore}%</div><small style={{color:'#888'}}>Điểm trung bình</small></div>
        <div className="card" style={{padding:16,textAlign:'center'}}><div style={{fontSize:32,fontWeight:700,color:'#28a745'}}>{pages.filter(p=>(p.seo_score||0)>=70).length}</div><small style={{color:'#888'}}>Tốt (≥70)</small></div>
        <div className="card" style={{padding:16,textAlign:'center'}}><div style={{fontSize:32,fontWeight:700,color:'#dc3545'}}>{pages.filter(p=>(p.seo_score||0)<40).length}</div><small style={{color:'#888'}}>Cần cải thiện (&lt;40)</small></div>
      </div>
      {loading ? <div className="card"><p style={{textAlign:'center',padding:'2rem'}}>Đang tải...</p></div> : pages.length === 0 ? <div className="card empty-state"><p>Chưa có trang nào</p></div> : (
        <div className="card">
          <table className="data-table" style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th>Trang</th><th>SEO Title</th><th style={{width:120}}>Điểm</th></tr></thead>
            <tbody>{pages.map(p => (
              <tr key={p.slug}><td><strong>{p.title}</strong><br/><small style={{color:'#888'}}>/{p.slug}</small></td><td><small>{p.seo_title || '—'}</small></td>
                <td><div style={{display:'flex',alignItems:'center',gap:6}}><div style={{flex:1,height:8,borderRadius:4,background:'#e0e0e0',overflow:'hidden'}}><div style={{width:`${p.seo_score||0}%`,height:'100%',borderRadius:4,background:(p.seo_score||0)>70?'#28a745':(p.seo_score||0)>40?'#ffc107':'#dc3545'}}/></div><span style={{fontSize:12,fontWeight:600}}>{p.seo_score||0}%</span></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
