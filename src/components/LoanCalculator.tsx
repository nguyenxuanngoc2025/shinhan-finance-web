'use client'
import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NeedConfig {
  title: string
  description: string
  image: string
  maxLoan: number
  minLoan: number
  minMonths: number
  maxMonths: number
  monthSteps: number[]
  interestRate: number
  icon: string
}

const NEED_CONFIGS: Record<string, NeedConfig> = {
  motorbike: {
    title: 'Tôi muốn mua xe máy',
    description:
      'Dù với lý do gì, Shinhan Finance luôn hân hạnh đồng hành và hỗ trợ, giúp bạn sớm hoàn thành các dự định. Đơn giản. Uy tín. Nhanh chóng.',
    image: '/images/needs/motorbike-hero.png',
    maxLoan: 300_000_000,
    minLoan: 1_000_000,
    minMonths: 6,
    maxMonths: 36,
    monthSteps: [6, 12, 18, 24, 30, 36],
    interestRate: 18,
    icon: 'fas fa-motorcycle',
  },
  'credit-card': {
    title: 'Tôi muốn Thẻ tín dụng',
    description:
      'Sở hữu thẻ tín dụng Shinhan Finance ngay hôm nay. Ưu đãi hấp dẫn, miễn lãi suất lên đến 45 ngày.',
    image: '/images/products/card.png',
    maxLoan: 100_000_000,
    minLoan: 1_000_000,
    minMonths: 6,
    maxMonths: 36,
    monthSteps: [6, 12, 18, 24, 30, 36],
    interestRate: 18,
    icon: 'far fa-credit-card',
  },
  furniture: {
    title: 'Tôi muốn mua nội thất',
    description:
      'Nâng cấp không gian sống với khoản vay ưu đãi từ Shinhan Finance. Thủ tục đơn giản, giải ngân nhanh chóng.',
    image: 'https://shinhanfinance.com.vn/-/1080x/nginx-cms/assets/homepage/home-furnishing.png',
    maxLoan: 300_000_000,
    minLoan: 1_000_000,
    minMonths: 6,
    maxMonths: 48,
    monthSteps: [6, 12, 18, 24, 30, 36, 42, 48],
    interestRate: 18,
    icon: 'fas fa-couch',
  },
  laptop: {
    title: 'Tôi muốn vay mua laptop',
    description:
      'Sở hữu laptop mới dễ dàng hơn với gói vay linh hoạt từ Shinhan Finance. Lãi suất cạnh tranh.',
    image: '/images/needs/laptop-hero.png',
    maxLoan: 100_000_000,
    minLoan: 1_000_000,
    minMonths: 6,
    maxMonths: 24,
    monthSteps: [6, 12, 18, 24],
    interestRate: 18,
    icon: 'fas fa-laptop',
  },
}

interface Props {
  needType: string
  onClose: () => void
}

function formatVND(val: number): string {
  return val.toLocaleString('vi-VN')
}

export default function LoanCalculator({ needType, onClose }: Props) {
  const config = NEED_CONFIGS[needType] || NEED_CONFIGS.motorbike

  const [income, setIncome] = useState<number>(0)
  const [loanAmount, setLoanAmount] = useState<number>(config.minLoan)
  const [months, setMonths] = useState<number>(config.minMonths)

  const maxLoanAvailable = useMemo(() => {
    if (income <= 0) return config.maxLoan
    return Math.min(income * 15, config.maxLoan)
  }, [income, config.maxLoan])

  const loanPercent = useMemo(() => {
    return ((loanAmount - config.minLoan) / (maxLoanAvailable - config.minLoan)) * 100
  }, [loanAmount, config.minLoan, maxLoanAvailable])

  const monthPercent = useMemo(() => {
    return ((months - config.minMonths) / (config.maxMonths - config.minMonths)) * 100
  }, [months, config.minMonths, config.maxMonths])

  const handleIncomeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0
      setIncome(val)
    },
    []
  )

  const isFormValid = income > 0

  return (
    <div className="loan-calc-section" id="loan-calculator">
      {/* Back button - top left */}
      <button className="loan-calc-back" onClick={onClose}>
        <i className="fas fa-arrow-left"></i>
        <span>Quay lại</span>
      </button>

      <div className="loan-calc-grid">
        {/* ===== LEFT COLUMN: Form ===== */}
        <div className="loan-calc-left">
          {/* Header row: icon + title + desc + badge */}
          <div className="loan-calc-header">
            <div className="loan-calc-icon-wrap">
              <i className={config.icon}></i>
            </div>
            <div className="loan-calc-header-text">
              <div className="loan-calc-title-row">
                <h3 className="loan-calc-title">{config.title}</h3>
                <span className="loan-calc-badge">
                  <i className="far fa-dot-circle"></i>
                  Vay đến {formatVND(config.maxLoan / 1_000_000)} triệu
                </span>
              </div>
              <p className="loan-calc-desc">{config.description}</p>
            </div>
          </div>

          {/* Thu nhập + Có thể vay tối đa on same row */}
          <div className="loan-calc-row-2col">
            <div className="loan-calc-field loan-calc-field-half">
              <label className="loan-calc-label">
                Thu nhập hàng tháng (VNĐ) <span className="required">*</span>
              </label>
              <div className="loan-calc-input-wrap">
                <input
                  type="text"
                  className="loan-calc-input"
                  placeholder="0"
                  value={income > 0 ? formatVND(income) : ''}
                  onChange={handleIncomeChange}
                />
              </div>
            </div>
            <div className="loan-calc-field loan-calc-field-half">
              <div className="loan-calc-max-row">
                <i className="fas fa-exchange-alt loan-calc-convert-icon"></i>
                <div>
                  <span className="loan-calc-label-sm">Có thể vay tối đa* (VNĐ)</span>
                  <span className="loan-calc-max-value">{formatVND(maxLoanAvailable)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bạn cần vay */}
          <div className="loan-calc-field">
            <div className="loan-calc-slider-header">
              <input
                type="text"
                className="loan-calc-input-inline"
                value={formatVND(loanAmount)}
                readOnly
              />
            </div>
            <div className="loan-calc-slider-row">
              <span className="loan-calc-slider-label-left">Bạn cần vay<br/>(VNĐ)</span>
              <div className="loan-calc-slider-track">
                <input
                  type="range"
                  className="loan-calc-slider"
                  min={config.minLoan}
                  max={maxLoanAvailable}
                  step={1_000_000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  style={{ '--pct': `${loanPercent}%` } as React.CSSProperties}
                />
                <div className="loan-calc-slider-labels">
                  <span>{formatVND(config.minLoan)}</span>
                  <span>{formatVND(maxLoanAvailable)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trong thời gian */}
          <div className="loan-calc-field">
            <div className="loan-calc-slider-row">
              <span className="loan-calc-slider-label-left">Trong thời<br/>gian</span>
              <div className="loan-calc-slider-track">
                <div className="loan-calc-duration-head">
                  <select
                    className="loan-calc-select-sm"
                    value={months}
                    onChange={(e) => setMonths(parseInt(e.target.value))}
                  >
                    {config.monthSteps.map((m) => (
                      <option key={m} value={m}>{m} tháng</option>
                    ))}
                  </select>
                </div>
                <input
                  type="range"
                  className="loan-calc-slider"
                  min={config.minMonths}
                  max={config.maxMonths}
                  step={6}
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value))}
                  style={{ '--pct': `${monthPercent}%` } as React.CSSProperties}
                />
                <div className="loan-calc-slider-labels">
                  <span>{config.minMonths} tháng</span>
                  <span>{config.maxMonths} tháng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lãi suất + CTA row */}
          <div className="loan-calc-bottom-row">
            <div className="loan-calc-interest-block">
              <span className="loan-calc-label-sm">Lãi suất minh họa tối thiểu (%/năm)*</span>
              <span className="loan-calc-interest">{config.interestRate}%</span>
            </div>
            <Link
              href="/dang-ky-vay"
              className={`loan-calc-cta${isFormValid ? '' : ' disabled'}`}
            >
              Tìm sản phẩm vay phù hợp
            </Link>
          </div>
        </div>

        {/* ===== RIGHT COLUMN: Image only ===== */}
        <div className="loan-calc-right">
          <div className="loan-calc-image">
            <Image src={config.image} alt={config.title} width={400} height={300} style={{objectFit:'contain', width:'100%', height:'auto', maxHeight:'300px'}} />
          </div>
        </div>
      </div>
    </div>
  )
}
