'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function CalculatorEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [calc, setCalc] = useState<any>(null)
  const [paramsJson, setParamsJson] = useState('')

  useEffect(() => {
    fetch('/api/cms/calculators').then(r => r.json()).then(res => {
      const found = (res.data || []).find((c: any) => c.slug === slug)
      if (found) { setCalc(found); setParamsJson(JSON.stringify(found.params, null, 2)) }
      setLoading(false)
    })
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try { JSON.parse(paramsJson) } catch { alert('JSON không hợp lệ'); return }
    setSaving(true)
    await fetch('/api/cms/calculators', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, params: JSON.parse(paramsJson) }) })
    router.push('/admin')
    setSaving(false)
  }

  if (loading) return <div className="card"><p style={{textAlign:'center',padding:'2rem'}}>Đang tải...</p></div>
  if (!calc) return <div className="card empty-state"><p>Không tìm thấy công cụ tính toán</p></div>

  return (
    <div>
      <h1>{calc.name}</h1>
      <form onSubmit={handleSubmit} className="card form-layout">
        <div className="form-group"><label>Slug</label><input type="text" value={slug} disabled style={{background:'#f3f4f6'}} /></div>
        <div className="form-group"><label>Loại công thức</label><input type="text" value={calc.formula_type || ''} disabled style={{background:'#f3f4f6'}} /></div>
        <div className="form-group">
          <label>Tham số (JSON)</label>
          <textarea value={paramsJson} onChange={e => setParamsJson(e.target.value)} rows={12} style={{fontFamily:'monospace',fontSize:13}} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Cập nhật'}</button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Quay lại</button>
        </div>
      </form>
    </div>
  )
}
