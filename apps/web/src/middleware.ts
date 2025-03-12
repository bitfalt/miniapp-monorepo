import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// List of public paths that don't require authentication
const publicPaths = [
  "/sign-in",
  "/api/auth/session",
  "/api/auth/logout",
  "/api/sign-in-redirect",
  "/api/user",
  "/api/user/check",
  "/api/user/by-wallet",
  "/api/nonce",
  "/api/complete-siwe",
  "/_next",
  "/favicon.ico",
  "/register",
  "/welcome",
  "/MindVaultLogoTransparentHD.svg",
];

// Get the secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Create secret for JWT tokens
const secret = new TextEncoder().encode(JWT_SECRET);

interface JWTPayload {
  walletAddress?: string;
  sub?: string;
  exp?: number;
}

// Function to verify JWT token
async function verifyToken(token: string) {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const verified = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    // Validate payload structure
    const payload = verified.payload as JWTPayload;
    if (!payload || typeof payload !== "object") {
      return null;
    }

    // Ensure required fields exist
    if (!payload.walletAddress || !payload.sub) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;
  
  // Get language preference from cookie
  const languageCookie = request.cookies.get("language")?.value || "en";

  // Special case for POST requests to /sign-in
  if (pathname === "/sign-in" && method === "POST") {
    // Create a new URL object for the redirect
    const redirectUrl = new URL("/sign-in", request.url);
    
    // Create a new response with a 303 See Other status code
    // This forces the browser to use a GET request for the redirect
    const response = NextResponse.redirect(redirectUrl, 303);
    
    // Preserve language preference
    response.cookies.set("language", languageCookie, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax"
    });
    
    return response;
  }

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Special case for welcome page - check for registration_complete in cookies
  if (pathname === "/welcome") {
    // If we have registration_status cookie set to complete, allow access
    const registrationStatus = request.cookies.get("registration_status")?.value;
    if (registrationStatus === "complete") {
      return NextResponse.next();
    }
  }

  // Get session token and registration status
  const sessionToken = request.cookies.get("session")?.value;
  const registrationStatus = request.cookies.get("registration_status")?.value;

  // For all protected routes
  if (!sessionToken) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    // Preserve language preference
    response.cookies.set("language", languageCookie, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax"
    });
    return response;
  }

  try {
    const decoded = await verifyToken(sessionToken);
    if (!decoded) {
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("session");
      response.cookies.delete("registration_status");
      // Preserve language preference
      response.cookies.set("language", languageCookie, {
        path: "/",
        maxAge: 86400,
        sameSite: "lax"
      });
      return response;
    }

    // Handle registration flow
    if (pathname !== "/register" && registrationStatus !== "complete") {
      const url = new URL("/register", request.url);
      if (decoded.walletAddress) {
        url.searchParams.set("walletAddress", decoded.walletAddress);
      }
      const response = NextResponse.redirect(url);
      // Preserve language preference
      response.cookies.set("language", languageCookie, {
        path: "/",
        maxAge: 86400,
        sameSite: "lax"
      });
      return response;
    }

    // Add user info to request headers for API routes
    if (pathname.startsWith("/api/")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", decoded.sub as string);
      requestHeaders.set("x-wallet-address", decoded.walletAddress as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch {
    // Clear invalid session
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("session");
    response.cookies.delete("registration_status");
    // Preserve language preference
    response.cookies.set("language", languageCookie, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax"
    });
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
