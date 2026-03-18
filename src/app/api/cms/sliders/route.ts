import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const all = searchParams.get('all') === 'true'

  let query = supabaseAdmin.from('sliders').select('*').order('order_index')
  // By default, only return visible sliders (for frontend)
  // Admin CMS can pass ?all=true to get everything
  if (!all) {
    query = query.eq('visible', true)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await supabaseAdmin.from('sliders').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
