import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/admin', '/profile', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Check for authentication token
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      // Redirect to auth page
      const authUrl = new URL('/auth', request.url)
      authUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(authUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\.).*)',
  ]
}