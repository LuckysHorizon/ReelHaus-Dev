import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname
  const lowerPath = pathname.toLowerCase()

  // 1) Normalize simple marketing routes to lowercase
  const known = ["/about", "/team", "/join"]
  if (pathname !== lowerPath && known.includes(lowerPath)) {
    url.pathname = lowerPath
    return NextResponse.redirect(url)
  }

  // 2) Legacy redirects for legal/contact pages
  const redirects: Record<string, string> = {
    "/terms": "/legal/terms",
    "/privacy": "/legal/privacy",
    "/refunds": "/legal/refunds",
    "/cancellation-and-refunds": "/legal/refunds",
    "/shipping": "/legal/shipping",
    "/delivery": "/legal/shipping",
    "/pricing": "/legal/pricing",
    "/product-details": "/legal/pricing",
    "/contact": "/legal/contact",
  }
  const dest = redirects[pathname]
  if (dest) {
    return NextResponse.redirect(new URL(dest, url), 308)
  }

  // 3) Performance headers and light caching
  const response = NextResponse.next()
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")

  if (pathname.startsWith("/_next/static/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  }
  if (pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
    response.headers.set("Cache-Control", "public, max-age=86400")
  }
  if (pathname.startsWith("/api/events") && request.method === "GET") {
    response.headers.set("Cache-Control", "public, max-age=300")
  }

  return response
}

export const config = {
  matcher: [
    // Run on everything except static/image/api assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}