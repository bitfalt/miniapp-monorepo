import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Get language preference from header or cookie
  const languageHeader = req.headers.get("X-Language-Preference");
  const languageCookie = req.cookies.get("language")?.value;
  const languagePreference = languageHeader || languageCookie || "en";
  
  // Redirect POST requests to the sign-in page with a GET request
  // Use a 303 redirect to force a GET request
  const redirectUrl = new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "https://app.bitfalt.xyz");
  const response = NextResponse.redirect(redirectUrl, 303);
  
  // Preserve language preference
  response.cookies.set("language", languagePreference, {
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    sameSite: "lax",
  });
  
  return response;
} 