import { NextResponse } from 'next/server'

// NOTE: This is a pure data API. Telegram notification is handled by n8n.
// n8n workflow "[Shinhan] Daily Health Report" calls this endpoint, formats and sends to Telegram.

const N8N_BASE = 'https://n8n.ngocnguyenxuan.com/api/v1'
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NTU2YjE4Ni02NWIyLTQ5ODMtYWVkZS1lY2Y1MDNlYTQyN2YiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMDJhZmIwOGItMDg2Ny00ZTMxLTk4ZmItMmNhN2JkY2YxYjQ5IiwiaWF0IjoxNzcyNzA2NjUyfQ._sBDirp58Nd2PonXfbVwlbfKBhGb7h9GogEZ7KQvjSI'
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://studio.ngocnguyenxuan.com'
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

type WorkflowInfo = {
  id: string
  name: string
  active: boolean
  updatedAt?: string
}

type ModuleHealth = {
  key: string
  name: string
  status: 'ok' | 'warning' | 'error'
  message: string
  n8n_active?: boolean
  last_run?: string | null
  details?: string
}

async function getN8nWorkflows(): Promise<WorkflowInfo[]> {
  try {
    const r = await fetch(`${N8N_BASE}/workflows`, {
      headers: { 'X-N8N-API-KEY': N8N_KEY },
      signal: AbortSignal.timeout(10000),
    })
    if (!r.ok) return []
    const data = await r.json()
    return (data.data || [])
      .filter((w: { name: string }) => w.name.includes('Shinhan') || w.name.includes('Auto'))
      .map((w: { id: string; name: string; active: boolean; updatedAt?: string }) => ({
        id: w.id, name: w.name, active: w.active, updatedAt: w.updatedAt
      }))
  } catch {
    return []
  }
}

async function getPostStats() {
  try {
    const headers = {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Accept-Profile': 'site_shinhan',
    }
    const [pubR, schedR] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/posts?status=eq.published&select=id`, { headers }),
      fetch(`${SB_URL}/rest/v1/posts?status=eq.scheduled&select=id,published_at&order=published_at.asc`, { headers }),
    ])
    const published = await pubR.json()
    const scheduled = await schedR.json()
    const nextPublish = Array.isArray(scheduled) && scheduled.length > 0 ? scheduled[0].published_at : null
    const lastPublish = Array.isArray(scheduled) && scheduled.length > 0 ? scheduled[scheduled.length - 1].published_at : null
    return {
      published: Array.isArray(published) ? published.length : 0,
      scheduled: Array.isArray(scheduled) ? scheduled.length : 0,
      nextPublish,
      lastPublish,
    }
  } catch {
    return { published: 0, scheduled: 0, nextPublish: null, lastPublish: null }
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  if (secret !== 'shinhan2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parallel fetch
  const [workflows, postStats] = await Promise.all([
    getN8nWorkflows(),
    getPostStats(),
  ])

  const modules: ModuleHealth[] = []

  // 1. Scraper
  const scraper = workflows.find(w => w.name.includes('Scrape'))
  modules.push({
    key: 'shinhan_scraper',
    name: 'Cập nhật tin Shinhan',
    status: scraper?.active ? 'ok' : 'warning',
    message: scraper?.active ? 'Đang hoạt động ổn định' : 'Workflow chưa active trên n8n',
    n8n_active: scraper?.active,
  })

  // 2. Auto-publish
  const autoPublish = workflows.find(w => w.name.includes('Auto Publish'))
  modules.push({
    key: 'auto_publish',
    name: 'Tự động đăng bài lên lịch',
    status: autoPublish?.active ? 'ok' : 'error',
    message: autoPublish?.active
      ? `Đang hoạt động. ${postStats.scheduled} bài chờ publish`
      : 'Workflow chưa active — bài scheduled sẽ không tự đăng',
    n8n_active: autoPublish?.active,
    details: postStats.nextPublish ? `Bài tiếp theo: ${new Date(postStats.nextPublish).toLocaleDateString('vi-VN')}` : undefined,
  })

  // 3. AI Finance News
  const aiNews = workflows.find(w => w.name.includes('AI Finance'))
  modules.push({
    key: 'ai_finance_news',
    name: 'Viết bài tự động',
    status: aiNews?.active ? 'ok' : 'warning',
    message: aiNews?.active ? 'Đang hoạt động' : 'Chưa kích hoạt. Cần cấu hình nguồn tin trước khi bật.',
    n8n_active: aiNews?.active,
  })

  // 4. SEO Planner
  const seoPlanner = workflows.find(w => w.name.includes('SEO Keyword'))
  modules.push({
    key: 'seo_planner',
    name: 'Lên lịch nội dung SEO',
    status: seoPlanner?.active ? 'ok' : 'warning',
    message: seoPlanner?.active ? 'Đang hoạt động' : 'Chưa kích hoạt. Đã có 73 keywords thủ công, bật khi cần thêm.',
    n8n_active: seoPlanner?.active,
  })

  // 5. Auto Fanpage
  const fanpage = workflows.find(w => w.name.includes('Fanpage') || w.name.includes('fanfapge'))
  modules.push({
    key: 'auto_fanpage',
    name: 'Đăng Facebook tự động',
    status: fanpage?.active ? 'ok' : 'warning',
    message: fanpage?.active ? 'Đang hoạt động' : 'Cần cung cấp Facebook Page Token để bật.',
    n8n_active: fanpage?.active,
  })

  // Overall health
  const errors = modules.filter(m => m.status === 'error')
  const warnings = modules.filter(m => m.status === 'warning')
  const overall = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'ok'

  const contentWarning = postStats.scheduled < 7
    ? '⚠️ Còn ít hơn 7 bài scheduled — cần bổ sung nội dung!'
    : null

  const result = {
    overall,
    timestamp: new Date().toISOString(),
    modules,
    content: {
      ...postStats,
      warning: contentWarning,
    },
    workflows_total: workflows.length,
  }

  return NextResponse.json(result)
}
