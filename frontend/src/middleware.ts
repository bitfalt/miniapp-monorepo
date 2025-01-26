import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET)

interface JWTPayload {
  address: string;
  isRegistered: boolean;
}

// Add all public paths including API endpoints
const publicPaths = [
  '/sign-in',
  '/register',
  '/api/user',
  '/api/nonce',
  '/api/complete-siwe',
  '/api/check-registration',
  '/welcome'
]

const createSignInUrl = (request: NextRequest) => {
  const signInUrl = new URL("/sign-in", request.url)
  signInUrl.searchParams.set("callbackUrl", request.url)
  return signInUrl
}

const verifySession = async (sessionValue: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(sessionValue, secret)
  return payload as JWTPayload
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Allow all public paths without any checks
  if (isPublicPath) {
    return NextResponse.next()
  }

  // For protected routes, check session
  if (!session?.value) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  try {
    const decoded = await verifySession(session.value)

    // If user is not registered, redirect to register page
    if (!decoded.isRegistered && !pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL("/register", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Invalid token:', error)
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 