import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { globalRateLimit, authRateLimit, uploadRateLimit, getClientIdentifier, securityHeaders } from '@/lib/security'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  const clientId = getClientIdentifier(request)
  const pathname = request.nextUrl.pathname

  let rateLimiter = globalRateLimit
  
  if (pathname.startsWith('/api/auth/')) {
    rateLimiter = authRateLimit
  } else if (pathname.startsWith('/api/documents/upload')) {
    rateLimiter = uploadRateLimit
  }

  // Temporarily disable rate limiting for development
  // if (rateLimiter.isRateLimited(clientId)) {
  //   return NextResponse.json(
  //     { error: 'Too many requests' },
  //     { status: 429 }
  //   )
  // }

  if (pathname.startsWith('/api/') && request.method === 'POST') {
    const contentType = request.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const contentLength = request.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB for JSON
        return NextResponse.json(
          { error: 'Request too large' },
          { status: 413 }
        )
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}