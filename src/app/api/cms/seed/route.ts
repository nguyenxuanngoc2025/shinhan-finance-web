import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const results: Record<string, any> = {}

  // 1. Seed Sliders — delete existing then insert fresh
  await supabaseAdmin.from('sliders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const sliders = [
    { title: 'Chào Cuộc Sống Chất Lượng', description: 'Phát triển tương lai thịnh vượng và hiện thực hóa nhiều ước mơ của khách hàng', image: '/images/banners/banner-1.png', cta_text: 'Đăng ký vay ngay', cta_link: '/dang-ky-vay', order_index: 1, visible: true },
    { title: 'Vì Tương Lai Tươi Đẹp Của Bạn', description: 'Hỗ trợ tài chính tiêu dùng, phục vụ đời sống, chăm sóc chất lượng sống', image: '/images/banners/banner-2.jpg', cta_text: 'Đăng ký vay ngay', cta_link: '/dang-ky-vay', order_index: 2, visible: true },
    { title: 'Lý Do Bạn Vay?', description: 'Thay vì mơ ước, tôi biến ước mơ thành hiện thực', image: '/images/banners/banner-3.png', cta_text: 'Đăng ký vay nhanh online', cta_link: '/dang-ky-vay', order_index: 3, visible: true },
    { title: 'Giải Pháp Tài Chính Hoàn Hảo', description: 'Hoàn tiền đến 5% khi mua sắm. Miễn phí thường niên năm đầu.', image: '/images/banners/banner-4.jpg', cta_text: 'Mở thẻ ngay', cta_link: '/dang-ky-vay', order_index: 4, visible: true },
  ]

  const { data: slidersData, error: slidersError } = await supabaseAdmin
    .from('sliders')
    .insert(sliders)
    .select('id, title')

  results.sliders = { count: slidersData?.length || 0, error: slidersError?.message || null }

  // 2. Verify existing
  const { count: postCount } = await supabaseAdmin.from('posts').select('*', { count: 'exact', head: true })
  const { count: prodCount } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true })
  results.posts = { count: postCount || 0 }
  results.products = { count: prodCount || 0 }

  return NextResponse.json({ success: true, results })
}
