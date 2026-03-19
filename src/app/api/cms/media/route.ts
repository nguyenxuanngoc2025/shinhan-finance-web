import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { unlink } from 'fs/promises'
import path from 'path'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const all = searchParams.get('all')

  // DELETE ALL mode
  if (all === 'true') {
    const { data: files } = await supabaseAdmin.from('media').select('url')
    const { error } = await supabaseAdmin.from('media').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    // Try delete physical files
    if (files) {
      for (const f of files) {
        if (f.url?.startsWith('/uploads/')) {
          try { await unlink(path.join(process.cwd(), 'public', f.url)) } catch { /* ignore */ }
        }
      }
    }
    return NextResponse.json({ success: true, deleted: files?.length ?? 0 })
  }

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Get file info first
  const { data: file } = await supabaseAdmin
    .from('media')
    .select('url')
    .eq('id', id)
    .single()

  // Delete from DB
  const { error } = await supabaseAdmin.from('media').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Try to delete physical file
  if (file?.url?.startsWith('/uploads/')) {
    try {
      const filePath = path.join(process.cwd(), 'public', file.url)
      await unlink(filePath)
    } catch { /* file may not exist */ }
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request) {
  const { id, alt_text } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('media')
    .update({ alt_text })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
