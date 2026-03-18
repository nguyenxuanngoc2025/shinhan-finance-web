import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple token-based auth for admin CMS
// In production, replace with proper session/JWT auth
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'shinhan-cms-2026'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Payload CMS redirect ---
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    const referer = request.headers.get('referer') || ''
    if (!referer.includes('/admin-login')) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  // --- Admin CMS Auth Guard ---
  // Protect /admin/* routes (except login-related)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
    // Allow API routes to pass through (they have their own auth if needed)
    if (pathname.startsWith('/api/')) return NextResponse.next()

    // Check for auth cookie
    const authCookie = request.cookies.get('nexon_auth')?.value
    if (authCookie !== ADMIN_TOKEN) {
      // Redirect to login page
      const loginUrl = new URL('/admin-login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
}
