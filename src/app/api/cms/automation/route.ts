import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/cms/automation — List all automation modules
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('automation_config')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// PUT /api/cms/automation — Update module config
export async function PUT(request: Request) {
  const body = await request.json()

  if (!body.module_key) {
    return NextResponse.json({ error: 'module_key is required' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.enabled !== undefined) updateData.enabled = body.enabled
  if (body.config !== undefined) updateData.config = body.config
  if (body.status !== undefined) updateData.status = body.status
  if (body.last_run_at !== undefined) updateData.last_run_at = body.last_run_at
  if (body.last_error !== undefined) updateData.last_error = body.last_error
  if (body.stats !== undefined) updateData.stats = body.stats

  const { data, error } = await supabaseAdmin
    .from('automation_config')
    .update(updateData)
    .eq('module_key', body.module_key)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/cms/automation/test — Test a module connection
export async function POST(request: Request) {
  const body = await request.json()
  const moduleKey = body.module_key as string

  if (moduleKey === 'auto_fanpage') {
    // Test Facebook connection
    const pageId = body.config?.page_id
    const accessToken = body.config?.access_token

    if (!pageId || !accessToken) {
      return NextResponse.json({
        success: false,
        message: 'Vui lòng điền Facebook Page ID và Access Token'
      })
    }

    try {
      const fbRes = await fetch(`https://graph.facebook.com/v18.0/${pageId}?access_token=${accessToken}&fields=name,id`)
      const fbData = await fbRes.json()

      if (fbData.error) {
        return NextResponse.json({
          success: false,
          message: `Lỗi kết nối: ${fbData.error.message}`
        })
      }

      // Update config in DB
      await supabaseAdmin
        .from('automation_config')
        .update({
          config: body.config,
          status: 'ready',
          updated_at: new Date().toISOString()
        })
        .eq('module_key', 'auto_fanpage')

      return NextResponse.json({
        success: true,
        message: `✅ Kết nối thành công với Fanpage: ${fbData.name}`,
        page_name: fbData.name
      })
    } catch (e) {
      return NextResponse.json({
        success: false,
        message: `Không thể kết nối: ${e instanceof Error ? e.message : 'Unknown error'}`
      })
    }
  }

  // Generic test — just mark as ready
  return NextResponse.json({
    success: true,
    message: `Module ${moduleKey} sẵn sàng hoạt động`
  })
}
