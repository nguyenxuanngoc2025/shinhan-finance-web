'use client'

import { useState, useEffect, useCallback } from 'react'

type ProductConfig = {
  name: string
  min_rate?: number
  max_rate?: number
  max_amount?: number
  min_amount?: number
  max_term_months?: number
  min_term_months?: number
  term_options?: number[]
  max_salary_multiplier?: number
  min_salary?: number
  disbursement_hours?: number
  early_termination_fee_pct?: number
  min_down_payment_pct?: number
  cash_advance_pct?: number
  interest_free_days?: number
  installment_rate?: number
  reward_points_pct?: number
  annual_fee_first_year?: number
  cash_withdrawal_fee_pct?: number
  features?: string[]
  age_range_female?: string
  age_range_male?: string
  [key: string]: unknown
}

function formatVND(n: number) {
  return n.toLocaleString('vi-VN')
}

function calcMonthly(amount: number, termMonths: number, annualRate: number) {
  const r = annualRate / 100 / 12
  const n = termMonths
  if (r === 0) return amount / n
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const FIELD_LABELS: Record<string, string> = {
  min_rate: 'Lãi suất tối thiểu (%/năm)',
  max_rate: 'Lãi suất tối đa (%/năm)',
  max_amount: 'Hạn mức vay tối đa (VNĐ)',
  min_amount: 'Khoản vay tối thiểu (VNĐ)',
  max_term_months: 'Kỳ hạn tối đa (tháng)',
  min_term_months: 'Kỳ hạn tối thiểu (tháng)',
  max_salary_multiplier: 'Hệ số lương tối đa (x lần)',
  min_salary: 'Thu nhập tối thiểu (VNĐ)',
  disbursement_hours: 'Thời gian giải ngân (giờ)',
  early_termination_fee_pct: 'Phí tất toán trước hạn (%)',
  min_down_payment_pct: 'Tỷ lệ trả trước tối thiểu (%)',
  cash_advance_pct: 'Rút tiền mặt (% hạn mức)',
  interest_free_days: 'Miễn lãi suất (ngày)',
  installment_rate: 'Lãi suất trả góp (%)',
  reward_points_pct: 'Điểm thưởng (%)',
  annual_fee_first_year: 'Phí thường niên năm đầu (VNĐ)',
  cash_withdrawal_fee_pct: 'Phí rút tiền mặt (%)',
  age_range_female: 'Độ tuổi nữ',
  age_range_male: 'Độ tuổi nam',
}

const PRODUCT_ICONS: Record<string, string> = {
  vay_tin_chap: '',
  vay_tra_gop: '',
  the_tin_dung: '',
}

const PRODUCT_COLORS: Record<string, string> = {
  vay_tin_chap: '#0078D4',
  vay_tra_gop: '#28a745',
  the_tin_dung: '#e85d26',
}

export default function RatesManagement() {
  const [products, setProducts] = useState<Record<string, ProductConfig>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, Record<string, string>>>({})

  const fetchData = useCallback(() => {
    fetch('/api/cms/settings?key=loan_products')
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          setProducts(res.data)
          // Initialize edit values
          const vals: Record<string, Record<string, string>> = {}
          for (const [key, config] of Object.entries(res.data as Record<string, ProductConfig>)) {
            vals[key] = {}
            for (const [field, value] of Object.entries(config)) {
              if (field === 'features' || field === 'name' || field === 'term_options') continue
              vals[key][field] = String(value)
            }
          }
          setEditValues(vals)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSave = async (productKey: string) => {
    setSaving(productKey)
    const updates: Record<string, unknown> = {}
    const current = products[productKey]
    const edits = editValues[productKey] || {}

    for (const [field, strVal] of Object.entries(edits)) {
      if (field === 'age_range_female' || field === 'age_range_male') {
        updates[field] = strVal
      } else {
        const num = Number(strVal)
        if (!isNaN(num) && num !== (current as Record<string, unknown>)[field]) {
          updates[field] = num
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      setSaving(null)
      return
    }

    // Auto-update features templates with new values
    const merged = { ...current, ...updates }
    if (current.features) {
      updates.features = current.features.map(f =>
        f.replace(/\{(\w+)\}/g, (_, key) => {
          const val = (merged as Record<string, unknown>)[key]
          if (key === 'max_amount_text') {
            const amt = (merged.max_amount || 0) as number
            return amt >= 1000000000
              ? `${amt / 1000000000} tỷ`
              : amt >= 1000000
                ? `${amt / 1000000} triệu`
                : formatVND(amt)
          }
          return val !== undefined ? String(val) : `{${key}}`
        })
      )
    }

    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_key: productKey, ...updates }),
      })
      if (res.ok) {
        setSaved(productKey)
        setTimeout(() => setSaved(null), 2000)
        fetchData()
      }
    } finally {
      setSaving(null)
    }
  }

  const updateField = (productKey: string, field: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [productKey]: { ...prev[productKey], [field]: value },
    }))
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Đang tải cấu hình...</div>
  }

  return (
    <>
      <style>{`
        .rates-page h1 { font-size: 20px; font-weight: 700; margin: 0 0 4px; }
        .rates-page .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
        .product-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 16px; overflow: hidden; }
        .product-header { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f3f4f6; }
        .product-header .icon { font-size: 22px; }
        .product-header h2 { font-size: 16px; font-weight: 700; margin: 0; }
        .product-header .badge { font-size: 11px; padding: 2px 8px; border-radius: 100px; color: #fff; }
        .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px 18px; }
        .field-group { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: 12px; font-weight: 600; color: #6b7280; }
        .field-input { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; font-family: 'Segoe UI', sans-serif; transition: border-color 0.12s; }
        .field-input:focus { outline: none; border-color: #0078D4; box-shadow: 0 0 0 2px rgba(0,120,212,0.1); }
        .field-hint { font-size: 11px; color: #9ca3af; }
        .product-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-top: 1px solid #f3f4f6; background: #fafbfc; }
        .save-btn { padding: 8px 20px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .save-btn.primary { background: #0078D4; color: #fff; }
        .save-btn.primary:hover { background: #005a9e; }
        .save-btn.saved { background: #28a745; color: #fff; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .preview-box { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 16px; margin: 0 18px 16px; }
        .preview-box h4 { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px; }
        .preview-item { font-size: 13px; color: #374151; padding: 2px 0; }
        .preview-item strong { color: #0078D4; }
        .formula-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin: 0 18px 16px; }
        .formula-box h4 { font-size: 12px; font-weight: 700; color: #92400e; margin: 0 0 6px; }
        .formula-box code { background: #fef3c7; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
        .formula-result { font-size: 13px; color: #92400e; margin-top: 6px; }
        @media (max-width: 768px) { .fields-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="rates-page">
        <h1>Quản lý Lãi suất &amp; Tham số</h1>
        <p className="subtitle">Thay đổi tại đây sẽ tự động cập nhật trên toàn bộ website (trang sản phẩm, bảng tính, FAQ...)</p>

        {Object.entries(products).map(([key, config]) => {
          const color = PRODUCT_COLORS[key] || '#0078D4'
          const icon = PRODUCT_ICONS[key] || ''
          const edits = editValues[key] || {}
          const numericFields = Object.keys(config).filter(f =>
            f !== 'name' && f !== 'features' && f !== 'term_options' && FIELD_LABELS[f]
          )

          // Calculate example for loan products
          const minRate = Number(edits.min_rate || config.min_rate || 0)
          const maxAmount = Number(edits.max_amount || config.max_amount || 0)
          const maxTerm = Number(edits.max_term_months || config.max_term_months || 12)

          return (
            <div key={key} className="product-section">
              <div className="product-header">
                <span className="icon">{icon}</span>
                <h2>{config.name}</h2>
                <span className="badge" style={{ background: color }}>{key.replace(/_/g, ' ')}</span>
              </div>

              <div className="fields-grid">
                {numericFields.map(field => (
                  <div key={field} className="field-group">
                    <label className="field-label">{FIELD_LABELS[field]}</label>
                    <input
                      className="field-input"
                      type={field.includes('age') ? 'text' : 'number'}
                      value={edits[field] ?? ''}
                      onChange={e => updateField(key, field, e.target.value)}
                      step={field.includes('pct') || field.includes('rate') || field.includes('points') ? '0.1' : '1'}
                    />
                    {field === 'max_amount' && maxAmount > 0 && (
                      <span className="field-hint">= {maxAmount >= 1e6 ? `${maxAmount / 1e6} triệu` : formatVND(maxAmount)} VNĐ</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Formula preview for loan products */}
              {config.min_rate !== undefined && maxAmount > 0 && (
                <div className="formula-box">
                  <h4>Công thức tính khoản thanh toán hàng tháng</h4>
                  <p style={{ fontSize: 13, margin: '4px 0' }}>
                    <code>PMT = P × r × (1+r)^n / ((1+r)^n - 1)</code>
                  </p>
                  <p style={{ fontSize: 12, color: '#92400e', margin: '4px 0' }}>
                    P = Dư nợ gốc &nbsp;|&nbsp; r = lãi suất tháng ({minRate}% / 12 = {(minRate / 12).toFixed(3)}%) &nbsp;|&nbsp; n = số kỳ
                  </p>
                  <div className="formula-result">
                    <strong>Ví dụ:</strong> Vay {formatVND(Math.min(maxAmount, 60000000))} VNĐ, {Math.min(maxTerm, 12)} tháng, lãi {minRate}%/năm
                    → Thanh toán hàng tháng: <strong>{formatVND(Math.round(calcMonthly(Math.min(maxAmount, 60000000), Math.min(maxTerm, 12), minRate)))} VNĐ</strong>
                  </div>
                </div>
              )}

              {/* Features preview */}
              {config.features && config.features.length > 0 && (
                <div className="preview-box">
                  <h4>Xem trước hiển thị trên website</h4>
                  {config.features.map((f, i) => (
                    <div key={i} className="preview-item">- {f}</div>
                  ))}
                </div>
              )}

              <div className="product-footer">
                <span style={{ fontSize: 12, color: '#9ca3af' }}>
                  {config.term_options && `Kỳ hạn: ${config.term_options.join(', ')} tháng`}
                </span>
                <button
                  className={`save-btn ${saved === key ? 'saved' : 'primary'}`}
                  disabled={saving === key}
                  onClick={() => handleSave(key)}
                >
                  {saving === key ? 'Đang lưu...' : saved === key ? 'Đã lưu!' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
