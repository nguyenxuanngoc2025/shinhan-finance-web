import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  try {
    // Optionally secure with a secret key passed via headers or query params
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.PAYLOAD_SECRET}`) {
      // Basic security for cron: checking with payload secret
      // You can also just keep it public if you don't care, but better safe.
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: posts, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('id, slug, published_at')
      .eq('status', 'scheduled')
      .lte('published_at', new Date().toISOString())

    if (fetchError) throw fetchError

    if (!posts || posts.length === 0) {
      return NextResponse.json({ message: 'No posts to publish', count: 0 })
    }

    const ids = posts.map(p => p.id)

    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update({ status: 'published' })
      .in('id', ids)

    if (updateError) throw updateError

    return NextResponse.json({ 
      message: 'Successfully published scheduled posts', 
      count: ids.length,
      published_slugs: posts.map(p => p.slug)
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
