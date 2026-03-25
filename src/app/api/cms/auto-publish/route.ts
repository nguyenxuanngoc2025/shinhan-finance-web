import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// NOTE: Telegram notification for auto-publish is handled by n8n workflow
// "[Shinhan] Auto Publish Scheduled Posts" — DO NOT add Telegram here.

// GET /api/cms/auto-publish?secret=xxx
// Called by cron to publish scheduled posts whose published_at time has come
export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'site_shinhan' } }
  )
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
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

  return NextResponse.json({
    published: successCount,
    total_due: duePosts.length,
    remaining,
    results,
    timestamp: now,
  })
}
