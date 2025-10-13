import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  // Redirect legacy legal routes to new paths
  const redirects: Record<string, string> = {
    '/terms': '/legal/terms',
    '/privacy': '/legal/privacy',
    '/refunds': '/legal/refunds',
    '/cancellation-and-refunds': '/legal/refunds',
    '/shipping': '/legal/shipping',
    '/delivery': '/legal/shipping',
    '/pricing': '/legal/pricing',
    '/product-details': '/legal/pricing',
    '/contact': '/legal/contact',
  }

  const dest = redirects[url.pathname]
  if (dest) {
    return NextResponse.redirect(new URL(dest, url), 308)
  }

  const response = NextResponse.next()

  // Add performance headers for faster loading
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Cache static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Cache images
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=86400')
  }
  
  // Cache API responses for events (with short TTL)
  if (request.nextUrl.pathname.startsWith('/api/events') && request.method === 'GET') {
    response.headers.set('Cache-Control', 'public, max-age=300') // 5 minutes
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}