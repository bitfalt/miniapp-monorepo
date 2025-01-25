import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from 'jsonwebtoken'
import { getToken } from "next-auth/jwt"

// Add paths that don't require authentication
const publicPaths = ['/sign-in', '/sign-up', '/forgot-password']
const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(request: NextRequest) {
  // Check both SIWE JWT and NextAuth session
  const siweSession = request.cookies.get('session')
  const nextAuthToken = await getToken({ req: request })
  const { pathname } = request.nextUrl
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Handle auth pages (sign-in, sign-up, etc.)
  if (isPublicPath) {
    // Check if user is authenticated with either method
    if (siweSession) {
      try {
        jwt.verify(siweSession.value, JWT_SECRET)
        return NextResponse.redirect(new URL("/", request.url))
      } catch {
        // Invalid token, continue
      }
    }
    if (nextAuthToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Protected routes - check both auth methods
  if (!siweSession && !nextAuthToken) {
    const signInUrl = new URL("/sign-in", request.url)
    // Use the full URL including protocol and host
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }

  if (siweSession) {
    try {
      jwt.verify(siweSession.value, JWT_SECRET)
      return NextResponse.next()
    } catch {
      // Invalid SIWE token, fall through to check NextAuth
    }
  }

  if (nextAuthToken) {
    return NextResponse.next()
  }

  const signInUrl = new URL("/sign-in", request.url)
  signInUrl.searchParams.set("callbackUrl", request.url)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
} 