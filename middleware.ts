import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwt, getJwtFromRequest } from './lib/edge-jwt'

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/about',
    '/contact',
    '/vision',
    '/projects',
    '/career',
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ]

  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith('/_next/') || 
    path.startsWith('/api/auth/') || 
    path.includes('.') ||
    path.startsWith('/favicon')
  )

  // If it's a public path, allow the request
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Get the token from cookies
  const token = getJwtFromRequest(request)

  // If there's no token, redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  try {
    // Verify the token
    const payload = await verifyJwt(token)
    
    // Check the role and redirect if needed
    if (path.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (path.startsWith('/manager') && payload.role !== 'manager') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Continue with the request
    return NextResponse.next()
  } catch (error) {
    console.error('Token verification error:', error)
    // If token is invalid, clear the cookie and redirect to signin
    const response = NextResponse.redirect(new URL('/signin', request.url))
    response.cookies.delete('auth-token')
    return response
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|signin|signup|forgot-password).*)',
  ],
}
