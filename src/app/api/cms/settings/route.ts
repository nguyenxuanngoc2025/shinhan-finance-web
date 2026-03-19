import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { supabaseAdmin } from '@/lib/supabase'

// ─── File-based settings (fallback & non-loan settings) ────────────────────
const SETTINGS_PATH = path.join(process.cwd(), 'src/data/site-settings.json')

function readFileSettings(): Record<string, unknown> {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function writeFileSettings(data: Record<string, unknown>) {
  try {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch {
    // Ignore write errors in production (read-only container)
  }
}

// ─── DB helpers: lưu loan_products vào site_shinhan.site_settings ─────────
// Key = 'loan_products', value = JSON string
async function readLoanProductsFromDB(): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'loan_products')
      .single()

    if (error || !data) return null

    const val = data.value
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return null }
    }
    return val as Record<string, unknown>
  } catch {
    return null
  }
}

async function writeLoanProductsToDB(data: Record<string, unknown>) {
  const jsonStr = JSON.stringify(data)
  await supabaseAdmin
    .from('site_settings')
    .upsert(
      { key: 'loan_products', value: jsonStr, grp: 'rates', updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )
}

// ─── Merged settings: DB overrides file for loan_products ──────────────────
async function readSettings(): Promise<Record<string, unknown>> {
  const fileSettings = readFileSettings()
  const dbLoanProducts = await readLoanProductsFromDB()
  if (dbLoanProducts) {
    return { ...fileSettings, loan_products: dbLoanProducts }
  }
  return fileSettings
}

// ─── GET /api/cms/settings ──────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const settings = await readSettings()
    if (key) {
      const parts = key.split('.')
      let result: unknown = settings
      for (const p of parts) {
        if (result && typeof result === 'object') {
          result = (result as Record<string, unknown>)[p]
        } else {
          result = null
          break
        }
      }
      return NextResponse.json({ data: result })
    }
    return NextResponse.json({ data: settings })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// ─── PUT /api/cms/settings — Full replace of a top-level key ───────────────
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const settings = await readSettings()
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && typeof settings[key] === 'object') {
        settings[key] = { ...settings[key] as Record<string, unknown>, ...(value as Record<string, unknown>) }
      } else {
        settings[key] = value
      }
    }
    if (settings.loan_products) {
      await writeLoanProductsToDB(settings.loan_products as Record<string, unknown>)
    }
    const { loan_products, ...rest } = settings
    void loan_products
    writeFileSettings(rest)
    return NextResponse.json({ success: true, data: settings })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// ─── PATCH /api/cms/settings — Update specific product rates ───────────────
// Body: { product_key: 'vay_tin_chap', min_rate: 11, max_amount: 300000000, ... }
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { product_key, ...updates } = body
    if (!product_key) {
      return NextResponse.json({ error: 'product_key required' }, { status: 400 })
    }
    const settings = await readSettings()
    const loanProducts = (settings.loan_products || {}) as Record<string, unknown>
    if (!loanProducts[product_key]) {
      return NextResponse.json({ error: `Product "${product_key}" not found` }, { status: 404 })
    }
    // Merge updates
    loanProducts[product_key] = {
      ...(loanProducts[product_key] as Record<string, unknown>),
      ...updates,
    }
    // Persist to Supabase — data tồn tại qua Docker rebuild
    await writeLoanProductsToDB(loanProducts)
    return NextResponse.json({ success: true, data: loanProducts[product_key] })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
