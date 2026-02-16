import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if needed
  const { data: { user } } = await supabase.auth.getUser()

  // Consumer protected routes
  const consumerProtectedRoutes = ['/dashboard', '/events', '/account', '/billing']
  const isConsumerProtectedRoute = consumerProtectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isConsumerProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Partner protected routes
  const partnerProtectedRoutes = ['/partner-dashboard']
  const isPartnerProtectedRoute = partnerProtectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isPartnerProtectedRoute && !user) {
    const redirectUrl = new URL('/partners/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Partner onboarding route (requires auth)
  if (request.nextUrl.pathname.startsWith('/partners/onboarding') && !user) {
    return NextResponse.redirect(new URL('/partners/login', request.url))
  }

  // Consumer auth routes - redirect to dashboard if already authenticated
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname === route
  )

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Partner auth routes - redirect to partner dashboard if already authenticated
  const partnerAuthRoutes = ['/partners/login', '/partners/signup']
  const isPartnerAuthRoute = partnerAuthRoutes.some(route => 
    request.nextUrl.pathname === route
  )

  if (isPartnerAuthRoute && user) {
    // TODO: Check if user is actually a partner before redirecting
    return NextResponse.redirect(new URL('/partner-dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
}
