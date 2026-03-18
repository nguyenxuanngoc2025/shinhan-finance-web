import { supabaseAdmin } from './supabase'

// ============================================
// Data Layer — Reads from Supabase (site_shinhan schema)
// Falls back to empty arrays on error
// ============================================

export type SliderData = {
  id: string
  title: string
  description: string
  image: string
  cta_text: string
  cta_link: string
  order_index: number
  visible: boolean
}

export type ProductData = {
  id: string
  name: string
  slug: string
  description: string
  content: { features?: string[]; image?: string }
  icon: string
  interest_rate: string
  loan_limit: string
  loan_term: string | null
  order_index: number
  status: string
}

export type PostData = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any
  cover_image: string
  category: string
  tags: string[]
  seo_title: string
  seo_description: string
  status: string
  published_at: string
  created_at: string
}

// --- Sliders ---
export async function getSliders(): Promise<SliderData[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sliders')
      .select('*')
      .eq('visible', true)
      .order('order_index')

    if (error || !data || data.length === 0) return []
    return data
  } catch {
    return []
  }
}

// --- Products ---
export async function getProducts(): Promise<ProductData[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('order_index')

    if (error || !data || data.length === 0) return []
    return data
  } catch {
    return []
  }
}

// --- Posts (published only) ---
export async function getPublishedPosts(limit = 10): Promise<PostData[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) return []
    return data
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

// --- Site Settings ---
export async function getSiteSettings(): Promise<Record<string, any>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')

    if (error || !data) return {}
    const settings: Record<string, any> = {}
    data.forEach((row: any) => { settings[row.key] = row.value })
    return settings
  } catch {
    return {}
  }
}
