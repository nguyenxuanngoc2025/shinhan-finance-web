import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

  // Wrap content as JSON if it's a raw HTML string (only if content is in dbBody)
  if (dbBody.content && typeof dbBody.content === 'string') {
    dbBody.content = { html: dbBody.content, type: 'html' }
  }

  const { data, error } = await supabaseAdmin
    .from('posts')
    .update({
      ...dbBody,
      updated_at: new Date().toISOString(),
      published_at: body.status === 'published' 
        ? (body.published_at || new Date().toISOString()) 
        : body.status === 'scheduled' ? body.published_at : null,
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
