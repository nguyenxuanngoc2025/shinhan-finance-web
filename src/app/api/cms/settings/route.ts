import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SETTINGS_PATH = path.join(process.cwd(), 'src/data/site-settings.json')

function readSettings() {
  const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
  return JSON.parse(raw)
}

function writeSettings(data: Record<string, unknown>) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /api/cms/settings — Read all or specific key
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const settings = readSettings()
    if (key) {
      // Support nested keys like "loan_products.vay_tin_chap"
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

// PUT /api/cms/settings — Full replace of a top-level key
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const settings = readSettings()
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && typeof settings[key] === 'object') {
        settings[key] = { ...settings[key], ...(value as Record<string, unknown>) }
      } else {
        settings[key] = value
      }
    }
    writeSettings(settings)
    return NextResponse.json({ success: true, data: settings })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// PATCH /api/cms/settings — Update specific product rates
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { product_key, ...updates } = body
    if (!product_key) {
      return NextResponse.json({ error: 'product_key required' }, { status: 400 })
    }
    const settings = readSettings()
    if (!settings.loan_products?.[product_key]) {
      return NextResponse.json({ error: `Product "${product_key}" not found` }, { status: 404 })
    }
    settings.loan_products[product_key] = { ...settings.loan_products[product_key], ...updates }
    writeSettings(settings)
    return NextResponse.json({ success: true, data: settings.loan_products[product_key] })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
