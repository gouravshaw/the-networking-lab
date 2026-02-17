import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromCookieHeaderEdge } from '@/lib/auth-edge'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  const cookieHeader = request.headers.get('cookie')
  const session = await getSessionFromCookieHeaderEdge(cookieHeader)
  const isLoginPage = pathname === '/admin/login'

  if (session) {
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (isLoginPage) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
