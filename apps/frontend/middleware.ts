import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/market-analysis',
  '/place',
  '/product',
  '/price',
  '/promotion',
  '/reports',
  '/restaurant-settings',
  '/settings',
];

// Define admin routes that require admin role
const adminRoutes = [
  '/admin',
  '/admin/seo',
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if the route is admin-only
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  // Get the authentication token from cookies
  const authToken = req.cookies.get('auth_token')?.value;
  
  // Get the user role from cookies
  const userRole = req.cookies.get('user_role')?.value;
  
  // Redirect to login if accessing a protected route without auth token
  if (isProtectedRoute && !authToken) {
    const url = new URL('/auth', req.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Redirect to dashboard if accessing an admin route without admin role
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // For demo purposes, we'll allow direct access to admin routes
  // In production, you would strictly enforce the admin role check above
  
  // Continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api|assets).*)',
  ],
}; 