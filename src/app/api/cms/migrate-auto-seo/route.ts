import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://studio.ngocnguyenxuan.com'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzIxMjUyMDAsImV4cCI6MTkyOTg5MTYwMH0.EswkDe7Zm8fNHw2pc08qoDYz5ahrk8koVHydLDQQSYU'

const supa = createClient(supabaseUrl, supabaseServiceKey)

async function runSQL(sql: string): Promise<{ ok: boolean; msg: string }> {
  // Use fetch directly to Supabase pg-meta SQL endpoint
  const res = await fetch(`${supabaseUrl}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })

  if (res.ok) {
    return { ok: true, msg: 'OK' }
  }

  // Fallback: try rpc
  const { error } = await supa.rpc('exec_sql', { query: sql })
  if (!error) return { ok: true, msg: 'OK via rpc' }

  return { ok: false, msg: `${res.status}: ${await res.text().catch(() => error.message)}` }
}

export async function POST() {
  const results: string[] = []

  // Step 0: Create exec_sql function
  const createFnSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE query;
    END;
    $$;
  `

  const fnResult = await runSQL(createFnSQL)
  results.push(fnResult.ok ? '✅ exec_sql function created' : `⚠️ exec_sql: ${fnResult.msg}`)

  // If pg/query didn't work, try creating via rpc after function is hopefully created
  const migrations = [
    // Columns on posts
    "ALTER TABLE site_shinhan.posts ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual'",
    "ALTER TABLE site_shinhan.posts ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal'",
    "ALTER TABLE site_shinhan.posts ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT false",
    "ALTER TABLE site_shinhan.posts ADD COLUMN IF NOT EXISTS source_url TEXT",
    "ALTER TABLE site_shinhan.posts ADD COLUMN IF NOT EXISTS keyword_target TEXT",
    "ALTER TABLE site_shinhan.posts ADD COLUMN IF NOT EXISTS author TEXT",
    "ALTER TABLE site_shinhan.posts ADD COLUMN IF NOT EXISTS canonical_url TEXT",

    // seo_keyword_plan table
    `CREATE TABLE IF NOT EXISTS site_shinhan.seo_keyword_plan (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      keyword TEXT NOT NULL,
      keyword_cluster TEXT,
      search_volume INT,
      difficulty TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      scheduled_date DATE,
      post_id UUID,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // automation_config table
    `CREATE TABLE IF NOT EXISTS site_shinhan.automation_config (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      module_key TEXT NOT NULL UNIQUE,
      module_name TEXT NOT NULL,
      enabled BOOLEAN DEFAULT false,
      config JSONB DEFAULT '{}',
      status TEXT DEFAULT 'inactive',
      last_run_at TIMESTAMPTZ,
      last_error TEXT,
      stats JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // Default automation modules
    `INSERT INTO site_shinhan.automation_config (module_key, module_name, enabled, config, status) VALUES
      ('shinhan_scraper', 'Tin chính hãng', false, '{"source_url": "shinhanfinance.com.vn", "frequency": "3x/week", "schedule_days": [1,3,5], "schedule_time": "08:00"}', 'inactive'),
      ('ai_finance_news', 'Bản tin tài chính AI', false, '{"schedule_time": "07:00", "word_count": 1000, "language": "vi"}', 'inactive'),
      ('seo_planner', 'Kế hoạch SEO', false, '{"schedule_day": "sunday", "schedule_time": "22:00", "posts_per_week": 7}', 'inactive'),
      ('auto_fanpage', 'Auto Fanpage', false, '{"page_id": "", "access_token": "", "post_delay_minutes": 15}', 'inactive')
    ON CONFLICT (module_key) DO NOTHING`,

    // Indexes
    "CREATE INDEX IF NOT EXISTS idx_posts_source ON site_shinhan.posts(source)",
    "CREATE INDEX IF NOT EXISTS idx_posts_priority ON site_shinhan.posts(priority)",
    "CREATE INDEX IF NOT EXISTS idx_posts_auto ON site_shinhan.posts(auto_generated)",
    "CREATE INDEX IF NOT EXISTS idx_kp_status ON site_shinhan.seo_keyword_plan(status)",
    "CREATE INDEX IF NOT EXISTS idx_kp_date ON site_shinhan.seo_keyword_plan(scheduled_date)",
  ]

  for (const sql of migrations) {
    const r = await runSQL(sql)
    const label = sql.substring(0, 70).replace(/\n/g, ' ').trim()
    results.push(r.ok ? `✅ ${label}...` : `❌ ${label}... → ${r.msg}`)
  }

  // Verify
  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema: 'site_shinhan' }
  })

  const { error: verifyPosts } = await adminClient.from('posts').select('source,priority,auto_generated').limit(1)
  results.push(verifyPosts ? `❌ Verify posts columns: ${verifyPosts.message}` : '✅ Verify posts columns: OK')

  const { error: verifyKP } = await adminClient.from('seo_keyword_plan').select('id').limit(1)
  results.push(verifyKP ? `❌ Verify seo_keyword_plan: ${verifyKP.message}` : '✅ Verify seo_keyword_plan: OK')

  const { error: verifyAC } = await adminClient.from('automation_config').select('id').limit(1)
  results.push(verifyAC ? `❌ Verify automation_config: ${verifyAC.message}` : '✅ Verify automation_config: OK')

  return NextResponse.json({ results })
}
