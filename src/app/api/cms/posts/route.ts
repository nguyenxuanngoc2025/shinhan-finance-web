import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/cms/posts — List posts with optional filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source')
  const priority = searchParams.get('priority')
  const category = searchParams.get('category')
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')
  const page = parseInt(searchParams.get('page') || '1')
  const excludePriority = searchParams.get('exclude_priority')

  const sortBy = searchParams.get('sort_by') || 'published_at'

  let query = supabaseAdmin
    .from('posts')
    .select('*', { count: 'exact' })
    .order(sortBy, { ascending: false })

  // Apply filters
  if (source) query = query.eq('source', source)
  if (priority) query = query.eq('priority', priority)
  if (excludePriority) query = query.neq('priority', excludePriority)
  if (category) query = query.eq('category', category)
  if (status && status !== 'all') query = query.eq('status', status)
  else if (!status) query = query.eq('status', 'published') // default: only published

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  })
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
      content: body.content ? { html: body.content, type: 'html' } : { html: '', type: 'html' },
      cover_image: body.cover_image || null,
      category: body.category || null,
      tags: body.tags || [],
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      status: body.status || 'draft',
      published_at: body.status === 'published' 
        ? new Date().toISOString() 
        : body.status === 'scheduled' ? body.published_at : null,
      // Auto SEO fields
      source: body.source || 'manual',
      priority: body.priority || 'normal',
      auto_generated: body.auto_generated || false,
      source_url: body.source_url || null,
      keyword_target: body.keyword_target || null,
      author: body.author || null,
      canonical_url: body.canonical_url || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
