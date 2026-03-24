import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// One-time migration endpoint: seed 'general' settings into Supabase
// so they survive Docker container rebuilds
export async function POST() {
  const generalSettings = {
    site_name: 'Shinhan Bank',
    site_description: 'Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam',
    logo: '/uploads/2026-03/images-1773893841492.png',
    footer_logo: '/uploads/2026-03/shinhan_logo_2-1773900518115.svg',
    favicon: '',
    contact_phone: '0969 930 328',
    contact_email: 'cskh@tuvanvienshinhan.com',
    zalo_number: '0969930328',
    facebook_url: '',
    address: '',
  }

  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert(
      {
        key: 'general',
        value: JSON.stringify(generalSettings),
        grp: 'appearance',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: generalSettings })
}
