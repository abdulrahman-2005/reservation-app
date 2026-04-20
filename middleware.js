// Root middleware for route protection
import { updateSession } from './lib/supabase/middleware.js'

export function middleware(request) {
  return updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
}
