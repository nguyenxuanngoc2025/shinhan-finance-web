import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { NEWS_ARTICLES } from '@/app/tin-tuc/news-data'

// POST /api/cms/sync-content — Sync hardcoded content to Supabase posts
export async function POST() {
  const results: string[] = []
  const errors: string[] = []

  for (const article of NEWS_ARTICLES) {
    // Find matching post by slug
    const { data: post } = await supabaseAdmin
      .from('posts')
      .select('id, slug, content')
      .eq('slug', article.slug)
      .single()

    if (!post) {
      errors.push(`Not found: ${article.slug}`)
      continue
    }

    // Check if content is empty (null, empty string, or empty array)
    const isEmpty = !post.content
      || post.content === ''
      || (Array.isArray(post.content) && post.content.length === 0)

    if (!isEmpty) {
      results.push(`SKIP (has content): ${article.slug}`)
      continue
    }

    // Update with hardcoded HTML content
    const { error } = await supabaseAdmin
      .from('posts')
      .update({ content: article.content })
      .eq('id', post.id)

    if (error) {
      errors.push(`ERROR ${article.slug}: ${error.message}`)
    } else {
      results.push(`SYNCED: ${article.slug}`)
    }
  }

  return NextResponse.json({ results, errors, synced: results.filter(r => r.startsWith('SYNCED')).length })
}
