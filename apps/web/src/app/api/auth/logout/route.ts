import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

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
function clearCookiesAndCreateResponse(req: NextRequest) {
  try {
    const cookieStore = cookies();
    
    // Get language preference from header or cookie
    const languageHeader = req.headers.get("X-Language-Preference");
    const languageCookie = req.cookies.get("language")?.value;
    const languagePreference = languageHeader || languageCookie || "en";

    // Clear all session-related cookies except language
    for (const cookie of COOKIES_TO_CLEAR) {
      cookieStore.delete(cookie);
    }

    // Use a 303 redirect to force a GET request
    const redirectUrl = new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "https://app.bitfalt.xyz");
    const response = NextResponse.redirect(redirectUrl, 303);

    // Set all cookies to expire
    for (const cookie of COOKIES_TO_CLEAR) {
      response.headers.append(
        "Set-Cookie",
        `${cookie}=; Path=/; Expires=${COOKIE_EXPIRY}`,
      );
    }
    
    // Preserve language preference
    response.headers.append(
      "Set-Cookie",
      `language=${languagePreference}; Path=/; Max-Age=86400; SameSite=Lax`,
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}

// Support both POST and GET methods
export async function POST(req: NextRequest) {
  return clearCookiesAndCreateResponse(req);
}

export async function GET(req: NextRequest) {
  return clearCookiesAndCreateResponse(req);
}
