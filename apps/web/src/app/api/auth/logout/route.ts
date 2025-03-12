import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIES_TO_CLEAR = [
  "session",
  "next-auth.session-token",
  "next-auth.callback-url",
  "next-auth.csrf-token",
  "worldcoin_verified",
  "siwe_verified",
  "registration_status",
] as const;

const COOKIE_EXPIRY = "Thu, 01 Jan 1970 00:00:00 GMT";

// Helper function to clear cookies and create response
function clearCookiesAndCreateResponse() {
  try {
    const cookieStore = cookies();

    // Clear all session-related cookies
    for (const cookie of COOKIES_TO_CLEAR) {
      cookieStore.delete(cookie);
    }

    const response = NextResponse.redirect(new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "https://app.bitfalt.xyz"));

    // Set all cookies to expire
    for (const cookie of COOKIES_TO_CLEAR) {
      response.headers.append(
        "Set-Cookie",
        `${cookie}=; Path=/; Expires=${COOKIE_EXPIRY}`,
      );
    }

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}

// Support both POST and GET methods
export async function POST() {
  return clearCookiesAndCreateResponse();
}

export async function GET() {
  return clearCookiesAndCreateResponse();
}
