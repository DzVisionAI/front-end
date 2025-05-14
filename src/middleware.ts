import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl
  // Auth routes - redirect to dashboard if logged in
  if (pathname.startsWith('/(auth)') || pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protect /dashboard, /users, /black-lists for authenticated users only
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/black-lists')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // /black-lists is admin only
    if (pathname.startsWith('/black-lists') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/users/:path*',
    '/black-lists/:path*',
    '/(auth)/:path*'
  ]
}