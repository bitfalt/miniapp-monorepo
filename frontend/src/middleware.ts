import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const publicPaths = ['/sign-in', '/register']

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    if (session) {
      try {
        const decoded = jwt.verify(session.value, JWT_SECRET) as { 
          address: string;
          isRegistered: boolean;
        }
        
        // If user is registered, redirect to home
        if (decoded.isRegistered) {
          return NextResponse.redirect(new URL("/", request.url))
        }
        
        // If user is not registered and trying to access register, allow it
        if (!decoded.isRegistered && pathname.startsWith('/register')) {
          return NextResponse.next()
        }
        
        // If user is not registered and not on register page, redirect to register
        return NextResponse.redirect(new URL("/register", request.url))
      } catch {
        // Invalid token, continue to sign-in
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!session) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }

  try {
    const decoded = jwt.verify(session.value, JWT_SECRET) as {
      address: string;
      isRegistered: boolean;
    }

    // If user is not registered, redirect to register
    if (!decoded.isRegistered) {
      return NextResponse.redirect(new URL("/register", request.url))
    }

    return NextResponse.next()
  } catch {
    // Invalid token
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }
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