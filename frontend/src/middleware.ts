import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

interface JWTPayload {
  address: string;
  isRegistered: boolean;
}

const publicPaths = ['/sign-in', '/register']

const createSignInUrl = (request: NextRequest) => {
  const signInUrl = new URL("/sign-in", request.url)
  signInUrl.searchParams.set("callbackUrl", request.url)
  return signInUrl
}

const verifySession = (sessionValue: string): JWTPayload => {
  return jwt.verify(sessionValue, JWT_SECRET, { algorithms: ['HS256'] }) as unknown as JWTPayload
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    if (session?.value) {
      try {
        const decoded = verifySession(session.value)
        
        if (decoded.isRegistered) {
          return NextResponse.redirect(new URL("/", request.url))
        }
        
        if (!decoded.isRegistered && pathname.startsWith('/register')) {
          return NextResponse.next()
        }
        
        return NextResponse.redirect(new URL("/register", request.url))
      } catch (error) {
        console.error('Invalid token in public path:', error)
        // Invalid token, continue to sign-in
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!session?.value) {
    return NextResponse.redirect(createSignInUrl(request))
  }

  try {
    const decoded = verifySession(session.value)

    if (!decoded.isRegistered) {
      return NextResponse.redirect(new URL("/register", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Invalid token in protected route:', error)
    return NextResponse.redirect(createSignInUrl(request))
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