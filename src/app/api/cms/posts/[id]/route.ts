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

  // Remove fields that don't exist in DB schema
  const { id: _id, created_at: _cat, updated_at: _uat, ...cleanBody } = body
  // Wrap content as JSON if it's a raw HTML string
  if (cleanBody.content && typeof cleanBody.content === 'string') {
    cleanBody.content = { html: cleanBody.content, type: 'html' }
  }

  const { data, error } = await supabaseAdmin
    .from('posts')
    .update({
      ...cleanBody,
      updated_at: new Date().toISOString(),
      published_at: body.status === 'published' 
        ? (body.published_at || new Date().toISOString()) 
        : body.status === 'scheduled' ? body.published_at : null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
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
