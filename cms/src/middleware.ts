import { NextRequest, NextResponse } from 'next/server'

// Payload's CSRF check requires an Origin header on cookie-authenticated requests.
// Browsers omit Origin on same-origin GET/navigate requests, causing auth to fail
// for the admin SSR. This middleware injects Origin from the host so Payload's
// csrf allowlist (which includes serverURL) always sees a matching origin.
export function middleware(request: NextRequest) {
  if (!request.headers.get('origin')) {
    const host = request.headers.get('host') ?? ''
    const proto = request.headers.get('x-forwarded-proto') ?? 'http'
    const headers = new Headers(request.headers)
    headers.set('origin', `${proto}://${host}`)
    return NextResponse.next({ request: { headers } })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
