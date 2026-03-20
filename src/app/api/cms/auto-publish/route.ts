import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const TELEGRAM_BOT = '7975037249:AAH80O6iBn8-b9N90dN7LlWwkYtW1IYABAI'
const TELEGRAM_GROUP = '-5185351978'

async function sendTelegram(text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_GROUP, text, parse_mode: 'HTML' }),
    })
  } catch {
    // Silent fail — don't block publish
  }
}

// GET /api/cms/auto-publish?secret=xxx
// Called by cron to publish scheduled posts whose time has come
export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'site_shinhan' } }
  )
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const alert = searchParams.get('alert') === 'true'

  if (secret !== process.env.CRON_SECRET && secret !== 'shinhan2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date().toISOString()

  // Find scheduled posts whose published_at <= now
  const { data: duePosts, error: fetchError } = await supabase
    .from('posts')
    .select('id, title, slug, published_at')
    .eq('status', 'scheduled')
    .lte('published_at', now)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!duePosts || duePosts.length === 0) {
    return NextResponse.json({ published: 0, message: 'No posts due for publishing' })
  }

  // Update each post to published
  const results = []
  for (const post of duePosts) {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'published' })
      .eq('id', post.id)

    results.push({
      id: post.id,
      title: post.title,
      slug: post.slug,
      success: !error,
      error: error?.message,
    })
  }

  const successCount = results.filter(r => r.success).length

  // Count remaining scheduled
  const { count: remaining } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'scheduled')

  // Send Telegram notification
  if (alert && successCount > 0) {
    const titles = results
      .filter(r => r.success)
      .map(r => `• <a href="https://tuvanvienshinhan.com/tin-tuc/${r.slug}">${r.title}</a>`)
      .join('\n')

    await sendTelegram(
      `📰 <b>Auto-Publish: ${successCount} bài mới</b>\n\n` +
      `${titles}\n\n` +
      `📅 Còn lại: ${remaining ?? '?'} bài scheduled\n` +
      `⏰ ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
    )
  }

  return NextResponse.json({
    published: successCount,
    total_due: duePosts.length,
    remaining,
    results,
    timestamp: now,
  })
}
