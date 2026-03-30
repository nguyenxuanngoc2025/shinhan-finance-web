import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', 'post_categories')
    .single()

  if (error || !data) {
    return NextResponse.json({ data: [] })
  }

  return NextResponse.json({ data: data.value || [] })
}

export async function PUT(req: Request) {
  try {
    const { categories } = await req.json()
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'categories must be an array' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert(
        { key: 'post_categories', value: categories, grp: 'cms' },
        { onConflict: 'key' }
      )

    if (error) throw error

    return NextResponse.json({ message: 'Saved successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
