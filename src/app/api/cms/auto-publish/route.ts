import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'site_shinhan' } }
)

// GET /api/cms/auto-publish?secret=xxx
// Called by cron every hour to publish scheduled posts whose time has come
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  // Simple secret to prevent unauthorized access
  if (secret !== process.env.CRON_SECRET && secret !== 'shinhan2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date().toISOString()

  // Find scheduled posts whose published_at <= now
  const { data: duePosts, error: fetchError } = await supabase
    .from('posts')
    .select('id, title, published_at')
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
      published_at: post.published_at,
      success: !error,
      error: error?.message
    })
  }

  const successCount = results.filter(r => r.success).length
  return NextResponse.json({
    published: successCount,
    total_due: duePosts.length,
    results,
    timestamp: now
  })
}
