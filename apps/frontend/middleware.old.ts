import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Define supported locales
const locales = ['en', 'th'];
const defaultLocale = 'en';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

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
  
  // Handle internationalization first
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse;
  }
  
  // Extract locale from pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  
  // Get the actual pathname without locale prefix
  let actualPathname = pathname;
  if (!pathnameIsMissingLocale) {
    actualPathname = pathname.slice(3); // Remove /en or /th
  }
  
  // Check if the route is protected (use actual pathname without locale)
  const isProtectedRoute = protectedRoutes.some(route => actualPathname.startsWith(route));
  
  // Check if the route is admin-only (use actual pathname without locale)
  const isAdminRoute = adminRoutes.some(route => actualPathname.startsWith(route));
  
  // Get the authentication token from cookies
  const authToken = req.cookies.get('auth_token')?.value;
  
  // Get the user role from cookies
  const userRole = req.cookies.get('user_role')?.value;
  
  // Redirect to login if accessing a protected route without auth token
  if (isProtectedRoute && !authToken) {
    const url = new URL('/auth/login', req.url);
    url.searchParams.set('callbackUrl', encodeURI(actualPathname));
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
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(th|en)/:path*',
    
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
}; 