import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

// ──────── Rate Limiting (in-memory, per IP) ────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5 // max 5 submissions per window

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true
  }
  return false
}

// ──────── Input Sanitization ────────
function sanitize(input: string | undefined, maxLength = 200): string {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>'";&]/g, '') // Remove dangerous chars
    .trim()
    .slice(0, maxLength)
}

function isValidVietnamesePhone(phone: string): boolean {
  // Vietnamese phone: 0xxx or +84xxx, 9-11 digits
  const cleaned = phone.replace(/[\s\-().+]/g, '')
  return /^(0|84)\d{8,10}$/.test(cleaned)
}

// ──────── Telegram Config ────────
function getTelegramConfig() {
  try {
    const settingsPath = path.join(process.cwd(), 'src/data/site-settings.json')
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
    return settings.telegram || { bot_token: '', chat_id: '' }
  } catch {
    return { bot_token: '', chat_id: '' }
  }
}

async function sendTelegramNotification(lead: Record<string, string>) {
  const config = getTelegramConfig()
  if (!config.bot_token || !config.chat_id) return

  const formLabel = lead.form_type === 'loan' ? 'ĐĂNG KÝ VAY' : 'MỞ THẺ TÍN DỤNG'

  const lines = [
    `Kính gửi Quý Anh/Chị,`,
    ``,
    `Hệ thống website Shinhan Bank vừa ghi nhận thêm một yêu cầu **${formLabel}** mới từ khách hàng. Dưới đây là thông tin chi tiết:`,
    ``,
    `* Họ và tên: ${lead.full_name}`,
    `* Số điện thoại: ${lead.phone}`,
    ...(lead.email       ? [`* Email: ${lead.email}`]                                             : []),
    ...(lead.loan_amount ? [`* Số tiền mong muốn: ${Number(lead.loan_amount).toLocaleString('vi-VN')} VNĐ`]  : []),
    ...(lead.loan_term   ? [`* Kỳ hạn dự kiến: ${lead.loan_term} tháng`]                                   : []),
    ...(lead.product_name? [`* Sản phẩm quan tâm: ${lead.product_name}`]                                     : []),
    ...(lead.province    ? [`* Tỉnh/Thành phố: ${lead.province}`]                                          : []),
    ...(lead.income      ? [`* Mức thu nhập: ${Number(lead.income).toLocaleString('vi-VN')} VNĐ/tháng`]   : []),
    ...(lead.purpose     ? [`* Mục đích vay: ${lead.purpose}`]                                          : []),
    ``,
    `- Thời gian ghi nhận: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
    `- Nguồn truy cập: tuvanvienshinhan.com`,
    ``,
    `Trân trọng,`,
    `Hệ thống Tự động hóa Shinhan Web`
  ]

  const message = lines.join('\n')

  try {
    await fetch(`https://api.telegram.org/bot${config.bot_token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chat_id,
        text: message,
        parse_mode: 'Markdown',
      }),
    })
  } catch (err) {
    console.error('Telegram notification failed:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Sanitize all inputs
    const full_name = sanitize(body.full_name, 100)
    const phone = sanitize(body.phone, 15)
    const email = sanitize(body.email, 100)
    const form_type = sanitize(body.form_type, 20) || 'loan'
    const loan_amount = sanitize(body.loan_amount, 20)
    const loan_term = sanitize(body.loan_term, 10)
    const product_name = sanitize(body.product_name, 100)
    const province = sanitize(body.province, 50)
    const income = sanitize(body.income, 20)
    const purpose = sanitize(body.purpose, 200)
    const occupation = sanitize(body.occupation, 100)
    const company = sanitize(body.company, 200)
    const income_source = sanitize(body.income_source, 50)
    const card_type = sanitize(body.card_type, 50)

    // Validate required fields
    if (!full_name || !phone) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc (họ tên, số điện thoại).' }, { status: 400 })
    }

    // Validate phone format
    if (!isValidVietnamesePhone(phone)) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ.' }, { status: 400 })
    }

    // Insert into Supabase
    const { data, error } = await supabaseAdmin.from('leads').insert({
      form_type,
      full_name,
      phone,
      email,
      loan_amount,
      loan_term,
      product_name,
      province,
      income,
      purpose,
      occupation,
      company,
      income_source,
      card_type,
      source_page: 'tuvanvienshinhan.com',
      status: 'new',
      ip_address: ip, // Track IP for anti-fraud
    }).select().single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Không thể lưu thông tin. Vui lòng thử lại.' }, { status: 500 })
    }

    // Send Telegram notification (async, don't block response)
    sendTelegramNotification({ form_type, full_name, phone, email, loan_amount, loan_term, product_name, province, income, purpose })

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Lead submit error:', err)
    return NextResponse.json({ error: 'Lỗi xử lý request' }, { status: 400 })
  }
}
