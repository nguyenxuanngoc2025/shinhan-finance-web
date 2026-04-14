import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sanitizeHtmlContent, wrapContentForStorage, extractFirstImage } from '@/lib/contentUtils'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  // Extract only fields that exist in the DB schema to avoid 500 errors from extra UI fields
  const allowedFields = [
    'title', 'slug', 'excerpt', 'content', 'cover_image', 'category', 'tags',
    'seo_title', 'seo_description', 'status', 'published_at', 'source',
    'priority', 'auto_generated', 'source_url', 'keyword_target', 'author', 'canonical_url'
  ]
  const dbBody: any = {}
  allowedFields.forEach(f => {
    if (f in body) dbBody[f] = body[f]
  })

  // BUG #1+2 FIX: Sanitize and normalize content format
  if ('content' in dbBody) {
    if (typeof dbBody.content === 'string') {
      // Raw HTML string → wrap into standard object, strip DOCTYPE
      dbBody.content = wrapContentForStorage(dbBody.content)
    } else if (dbBody.content && typeof dbBody.content === 'object' && 'html' in dbBody.content) {
      // Already wrapped → just sanitize the html inside
      dbBody.content = {
        html: sanitizeHtmlContent(dbBody.content.html || ''),
        type: 'html',
      }
    }
    
    // Auto-extract cover image if not provided
    if (!dbBody.cover_image && typeof dbBody.content?.html === 'string') {
      const extractedImage = extractFirstImage(dbBody.content.html)
      if (extractedImage) {
        dbBody.cover_image = extractedImage
      }
    }
  }

  // BUG #6 FIX: Fetch current published_at before updating
  // Only set published_at if status is actually changing
  const { data: current } = await supabaseAdmin
    .from('posts')
    .select('status, published_at')
    .eq('id', id)
    .single()

  let published_at: string | null = current?.published_at || null

  if (body.status === 'published') {
    if (current?.status !== 'published') {
      // Status changing to published for the first time → set now
      published_at = body.published_at || new Date().toISOString()
    } else {
      // Already published → preserve original published_at (don't reset)
      published_at = current?.published_at || body.published_at || new Date().toISOString()
    }
  } else if (body.status === 'scheduled') {
    published_at = body.published_at || null
  } else {
    // draft → null
    published_at = null
  }

  const { data, error } = await supabaseAdmin
    .from('posts')
    .update({
      ...dbBody,
      updated_at: new Date().toISOString(),
      published_at,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
