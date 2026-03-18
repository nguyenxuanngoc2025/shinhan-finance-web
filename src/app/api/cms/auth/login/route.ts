import { NextResponse } from 'next/server'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'shinhan-cms-2026'

// Simple admin credentials — replace with proper DB-backed auth in production
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@shinhan.com',
  password: process.env.ADMIN_PASSWORD || 'shinhan2026',
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const response = NextResponse.json({ success: true })
      // Set auth cookie (httpOnly, 7 days)
      response.cookies.set('nexon_auth', ADMIN_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      return response
    }

    return NextResponse.json(
      { error: 'Email hoặc mật khẩu không đúng' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Lỗi xử lý request' },
      { status: 400 }
    )
  }
}
