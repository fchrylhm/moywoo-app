import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // 1. Ambil cookie 'seller_session' yang diset oleh loginSeller di action.ts
  const sellerSession = request.cookies.get('seller_session')?.value

  // 2. PROTEKSI AREA DASHBOARD: Jika akses /dashboard tanpa session -> lempar ke /login
  if (pathname.startsWith('/dashboard')) {
    if (!sellerSession) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Matikan total browser bfcache & cache memory untuk area terproteksi
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  // 3. PROTEKSI AREA LOGIN: Jika sudah login tapi buka /login -> lempar ke /dashboard
  if (pathname === '/login' && sellerSession) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}