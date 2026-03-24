import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/cms/seed-keywords — Seed Vietnamese keywords with proper UTF-8
export async function POST() {
  // First delete existing keywords with broken encoding
  await supabaseAdmin.from('seo_keyword_plan').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const keywords = [
    // San pham (Products) — 25 keywords
    { keyword: 'vay tín chấp shinhan', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-03-20' },
    { keyword: 'vay tiêu dùng không thế chấp', keyword_cluster: 'san-pham', difficulty: 'easy', scheduled_date: '2026-03-21' },
    { keyword: 'thẻ tín dụng shinhan the first', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-03-22' },
    { keyword: 'lãi suất vay tín chấp shinhan', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-03-23' },
    { keyword: 'vay trả góp điện thoại shinhan', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-04-12' },
    { keyword: 'mở thẻ tín dụng online', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-04-01' },
    { keyword: 'hạn mức thẻ tín dụng the first', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-04-16' },
    { keyword: 'vay mua xe trả góp shinhan', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-04-22' },
    { keyword: 'phí thường niên thẻ shinhan', keyword_cluster: 'san-pham', difficulty: 'easy', scheduled_date: '2026-05-05' },
    { keyword: 'ưu đãi thẻ tín dụng shinhan', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-05-10' },
    { keyword: 'vay tín chấp 300 triệu', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-05-15' },
    { keyword: 'vay online nhanh trong ngày', keyword_cluster: 'san-pham', difficulty: 'hard', scheduled_date: '2026-05-20' },
    { keyword: 'đăng ký thẻ tín dụng miễn phí', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-05-25' },
    { keyword: 'Shinhan Bank giải ngân nhanh', keyword_cluster: 'san-pham', difficulty: 'medium', scheduled_date: '2026-06-01' },
    { keyword: 'vay tín chấp kỳ hạn 48 tháng', keyword_cluster: 'san-pham', difficulty: 'easy', scheduled_date: '2026-06-05' },

    // Huong dan (Guides) — 25 keywords
    { keyword: 'điều kiện vay tín chấp', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-03-24' },
    { keyword: 'hồ sơ vay tín chấp cần gì', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-03-25' },
    { keyword: 'cách đăng ký vay tín chấp online', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-03-26' },
    { keyword: 'thủ tục vay tiêu dùng', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-04-02' },
    { keyword: 'cách tính lãi suất vay', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-04-14' },
    { keyword: 'rút tiền mặt thẻ tín dụng', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-04-15' },
    { keyword: 'cách thanh toán thẻ tín dụng', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-04-20' },
    { keyword: 'quy trình duyệt vay tín chấp', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-04-25' },
    { keyword: 'giấy tờ cần thiết khi vay tiền', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-05-01' },
    { keyword: 'cách trả nợ vay đúng hạn', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-05-08' },
    { keyword: 'hướng dẫn sử dụng thẻ tín dụng', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-05-12' },
    { keyword: 'cách kiểm tra hạn mức tín dụng', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-05-18' },
    { keyword: 'tất toán khoản vay trước hạn', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-05-22' },
    { keyword: 'cách nâng hạn mức thẻ tín dụng', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-06-02' },
    { keyword: 'cách đọc hợp đồng vay', keyword_cluster: 'huong-dan', difficulty: 'easy', scheduled_date: '2026-06-08' },

    // So sanh (Comparisons) — 15 keywords
    { keyword: 'so sánh shinhan vs fe credit', keyword_cluster: 'so-sanh', difficulty: 'hard', scheduled_date: '2026-03-27' },
    { keyword: 'so sánh lãi suất ngân hàng 2026', keyword_cluster: 'so-sanh', difficulty: 'hard', scheduled_date: '2026-03-28' },
    { keyword: 'vay tín chấp lãi suất thấp nhất', keyword_cluster: 'so-sanh', difficulty: 'hard', scheduled_date: '2026-04-03' },
    { keyword: 'so sánh thẻ tín dụng 2026', keyword_cluster: 'so-sanh', difficulty: 'hard', scheduled_date: '2026-04-28' },
    { keyword: 'top 5 công ty tài chính uy tín', keyword_cluster: 'so-sanh', difficulty: 'hard', scheduled_date: '2026-05-03' },
    { keyword: 'shinhan hay home credit tốt hơn', keyword_cluster: 'so-sanh', difficulty: 'hard', scheduled_date: '2026-05-28' },
    { keyword: 'bảng lãi suất vay tiêu dùng 2026', keyword_cluster: 'so-sanh', difficulty: 'hard', scheduled_date: '2026-06-10' },
    { keyword: 'thẻ tín dụng nào tốt nhất 2026', keyword_cluster: 'so-sanh', difficulty: 'hard', scheduled_date: '2026-06-15' },

    // Tai chinh (Finance knowledge) — 20 keywords
    { keyword: 'quản lý tài chính cá nhân', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-03-29' },
    { keyword: 'cách tiết kiệm tiền hiệu quả', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-03-30' },
    { keyword: 'kiến thức tín dụng cơ bản', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-04-19' },
    { keyword: 'lập kế hoạch tài chính gia đình', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-04-24' },
    { keyword: 'cách xây dựng điểm tín dụng', keyword_cluster: 'tai-chinh', difficulty: 'medium', scheduled_date: '2026-05-06' },
    { keyword: 'sai lầm khi vay tín chấp', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-05-16' },
    { keyword: 'mẹo quản lý nợ hiệu quả', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-06-03' },
    { keyword: 'tầm quan trọng bảo hiểm khoản vay', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-06-12' },
    { keyword: 'hiểu về lãi suất kép', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-06-20' },
    { keyword: 'thu nhập thụ động cho người đi làm', keyword_cluster: 'tai-chinh', difficulty: 'easy', scheduled_date: '2026-06-25' },

    // Long-tail — 20 keywords
    { keyword: 'vay không cần chứng minh thu nhập', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-04-06' },
    { keyword: 'vay tín chấp bao lâu duyệt', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-04-07' },
    { keyword: 'trả nợ trước hạn có mất phí không', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-04-08' },
    { keyword: 'vay tiền nhanh trong ngày', keyword_cluster: 'long-tail', difficulty: 'medium', scheduled_date: '2026-04-13' },
    { keyword: 'vay tín chấp cho sinh viên', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-04-17' },
    { keyword: 'vay tín chấp lương 5 triệu', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-04-18' },
    { keyword: 'nợ xấu có vay được không', keyword_cluster: 'long-tail', difficulty: 'medium', scheduled_date: '2026-04-27' },
    { keyword: 'vay tín chấp có cần bảo lãnh', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-05-04' },
    { keyword: 'vay hỗ trợ công nghệ thông tin', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-05-11' },
    { keyword: 'vay tín chấp cho freelancer', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-05-19' },
    { keyword: 'vay qua ứng dụng shinhan', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-05-26' },
    { keyword: 'bị từ chối vay phải làm sao', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-06-06' },
    { keyword: 'vay tín chấp cho người mới đi làm', keyword_cluster: 'long-tail', difficulty: 'easy', scheduled_date: '2026-06-14' },

    // Thuong hieu (Brand) — 10 keywords
    { keyword: 'Shinhan Bank có uy tín không', keyword_cluster: 'thuong-hieu', difficulty: 'medium', scheduled_date: '2026-04-04' },
    { keyword: 'đánh giá Shinhan Bank 2026', keyword_cluster: 'thuong-hieu', difficulty: 'medium', scheduled_date: '2026-04-05' },
    { keyword: 'Shinhan Bank chi nhánh gần nhất', keyword_cluster: 'thuong-hieu', difficulty: 'easy', scheduled_date: '2026-04-21' },
    { keyword: 'hotline Shinhan Bank', keyword_cluster: 'thuong-hieu', difficulty: 'easy', scheduled_date: '2026-04-26' },
    { keyword: 'Shinhan Bank số điện thoại', keyword_cluster: 'thuong-hieu', difficulty: 'easy', scheduled_date: '2026-05-02' },
    { keyword: 'tuyển dụng Shinhan Bank', keyword_cluster: 'thuong-hieu', difficulty: 'easy', scheduled_date: '2026-05-24' },

    // Tin tuc (News) — 10 keywords
    { keyword: 'lãi suất ngân hàng tháng 4 2026', keyword_cluster: 'tin-tuc', difficulty: 'easy', scheduled_date: '2026-04-09' },
    { keyword: 'giá vàng hôm nay và vay tín chấp', keyword_cluster: 'tin-tuc', difficulty: 'medium', scheduled_date: '2026-04-10' },
    { keyword: 'chính sách tín dụng mới 2026', keyword_cluster: 'tin-tuc', difficulty: 'medium', scheduled_date: '2026-04-11' },
    { keyword: 'ngân hàng nhà nước giảm lãi suất', keyword_cluster: 'tin-tuc', difficulty: 'medium', scheduled_date: '2026-05-14' },
    { keyword: 'thị trường tài chính việt nam 2026', keyword_cluster: 'tin-tuc', difficulty: 'medium', scheduled_date: '2026-05-21' },
    { keyword: 'dự báo lãi suất quý 3 2026', keyword_cluster: 'tin-tuc', difficulty: 'medium', scheduled_date: '2026-06-18' },
  ]

  const { data, error } = await supabaseAdmin
    .from('seo_keyword_plan')
    .insert(keywords)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: `Seeded ${data.length} keywords successfully`, count: data.length })
}
