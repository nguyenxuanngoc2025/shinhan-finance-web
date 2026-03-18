import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('calculators').select('*').order('slug')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('calculators')
    .update({ params: body.params, updated_at: new Date().toISOString() })
    .eq('slug', body.slug)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
