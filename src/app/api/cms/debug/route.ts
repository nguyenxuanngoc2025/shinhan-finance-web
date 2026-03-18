import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use public schema client to query information_schema
const supabasePublic = createClient(
  'https://studio.ngocnguyenxuan.com',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzIxMjUyMDAsImV4cCI6MTkyOTg5MTYwMH0.EswkDe7Zm8fNHw2pc08qoDYz5ahrk8koVHydLDQQSYU'
)

export async function GET() {
  const { data, error } = await supabasePublic.rpc('get_table_columns', {
    p_schema: 'site_shinhan'
  })

  if (error) {
    // Fallback: try raw fetch with Accept-Profile
    const res = await fetch('https://studio.ngocnguyenxuan.com/rest/v1/sliders?select=*&limit=0', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzIxMjUyMDAsImV4cCI6MTkyOTg5MTYwMH0.EswkDe7Zm8fNHw2pc08qoDYz5ahrk8koVHydLDQQSYU',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzIxMjUyMDAsImV4cCI6MTkyOTg5MTYwMH0.EswkDe7Zm8fNHw2pc08qoDYz5ahrk8koVHydLDQQSYU',
        'Accept-Profile': 'site_shinhan',
        'Prefer': 'return=representation',
      }
    })
    // The response headers contain column info via content-profile
    const slidersDef = res.headers.get('content-profile')
    
    // Also try to insert with wrong columns to get error message listing valid columns
    const { supabaseAdmin } = await import('@/lib/supabase')
    
    const { error: insertErr } = await supabaseAdmin.from('sliders').insert({ _test_: true })
    const { error: insertErr2 } = await supabaseAdmin.from('products').insert({ _test_: true })

    return NextResponse.json({
      rpc_error: error.message,
      slider_insert_err: insertErr?.message,
      product_insert_err: insertErr2?.message,
      slidersDef,
    })
  }

  return NextResponse.json({ data })
}
