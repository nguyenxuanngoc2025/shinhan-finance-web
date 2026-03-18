import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://studio.ngocnguyenxuan.com'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcyMTI1MjAwLCJleHAiOjE5Mjk4OTE2MDB9.t3KJySUYE2wo5x4lkyAdAue3u2or2Nk0aYp7De4t_3I'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzIxMjUyMDAsImV4cCI6MTkyOTg5MTYwMH0.EswkDe7Zm8fNHw2pc08qoDYz5ahrk8koVHydLDQQSYU'

// Client-side (anon key, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side (service role, bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'site_shinhan' }
})

// Core schema client
export const supabaseCore = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'nexon_core' }
})

// Helper: query from site_shinhan schema
export function fromSite(table: string) {
  return supabaseAdmin.from(table)
}

export function fromCore(table: string) {
  return supabaseCore.from(table)
}
