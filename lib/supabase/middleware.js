// Middleware Supabase client for session management
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  
  // Refresh session
  return supabase.auth.getUser().then(({ data: { user } }) => {
    const isProtectedRoute = 
      request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/admin')
    
    // Redirect to login if not authenticated
    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // Doctor-only route guard
    if (user && request.nextUrl.pathname.startsWith('/admin')) {
      return supabase
        .from('staff_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data: profile }) => {
          if (!profile || profile.role !== 'doctor') {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
          }
          return supabaseResponse
        })
    }
    
    return supabaseResponse
  })
}
