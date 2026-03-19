import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/cms/seo-keywords — List keyword plan
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabaseAdmin
    .from('seo_keyword_plan')
    .select('*')
    .order('scheduled_date', { ascending: true })
    .limit(limit)

  if (status) query = query.eq('status', status)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/cms/seo-keywords — Add keyword(s) to plan
export async function POST(request: Request) {
  const body = await request.json()

  // Support both single and batch insert
  const keywords = Array.isArray(body) ? body : [body]

  const records = keywords.map(kw => ({
    keyword: kw.keyword,
    keyword_cluster: kw.keyword_cluster || null,
    search_volume: kw.search_volume || null,
    difficulty: kw.difficulty || 'medium',
    status: kw.status || 'pending',
    scheduled_date: kw.scheduled_date || null,
    notes: kw.notes || null,
  }))

  const { data, error } = await supabaseAdmin
    .from('seo_keyword_plan')
    .insert(records)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count: data.length }, { status: 201 })
}
