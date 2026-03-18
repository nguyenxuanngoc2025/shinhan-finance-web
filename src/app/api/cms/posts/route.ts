import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/cms/posts — List all posts
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/cms/posts — Create new post
export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content || '',
      cover_image: body.cover_image || null,
      seo_image: body.seo_image || null,
      category: body.category || null,
      tags: body.tags || [],
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      status: body.status || 'draft',
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
