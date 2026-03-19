import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { supabaseAdmin } from '@/lib/supabase'

// ─── File-based settings (fallback & non-critical settings) ─────────────────
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

// ─── Generic DB helpers for any settings key ────────────────────────────────
async function readFromDB(key: string): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', key)
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

async function writeToDB(key: string, grp: string, data: Record<string, unknown>) {
  const jsonStr = JSON.stringify(data)
  await supabaseAdmin
    .from('site_settings')
    .upsert(
      { key, value: jsonStr, grp, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )
}

// ─── Merged settings: DB overrides file for persistent keys ─────────────────
async function readSettings(): Promise<Record<string, unknown>> {
  const fileSettings = readFileSettings()

  // Fetch loan_products and general from DB (they survive Docker rebuilds)
  const [dbLoanProducts, dbGeneral] = await Promise.all([
    readFromDB('loan_products'),
    readFromDB('general'),
  ])

  const result = { ...fileSettings }
  if (dbLoanProducts) result.loan_products = dbLoanProducts
  if (dbGeneral) result.general = dbGeneral

  return result
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

    // Persist critical keys to Supabase (survive Docker rebuilds)
    const persistJobs: Promise<void>[] = []
    if (settings.loan_products) {
      persistJobs.push(writeToDB('loan_products', 'rates', settings.loan_products as Record<string, unknown>))
    }
    if (settings.general) {
      persistJobs.push(writeToDB('general', 'appearance', settings.general as Record<string, unknown>))
    }
    if (persistJobs.length) await Promise.all(persistJobs)

    // Also write non-critical settings to file (best effort)
    const { loan_products, general, ...rest } = settings
    void loan_products
    void general
    writeFileSettings({ ...rest, general: settings.general, loan_products: settings.loan_products })

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
    await writeToDB('loan_products', 'rates', loanProducts)
    return NextResponse.json({ success: true, data: loanProducts[product_key] })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
