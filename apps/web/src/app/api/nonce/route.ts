import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface NonceResponse {
  nonce?: string;
  error?: string;
}

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  try {
    // Get language preference from header or cookie
    const languageHeader = req.headers.get("X-Language-Preference");
    const languageCookie = req.cookies.get("language")?.value;
    const languagePreference = languageHeader || languageCookie || "en";
    
    console.log("Generating nonce with language preference:", languagePreference);
    
    // Generate a simple alphanumeric nonce
    const nonce = crypto.randomBytes(32).toString("base64url");

    // Store nonce in cookie with proper settings
    const cookieStore = cookies();
    cookieStore.set("siwe", nonce, {
      secure: true,
      httpOnly: true,
      path: "/",
      maxAge: 300, // 5 minutes expiry
      sameSite: "lax", // Changed to lax to work with redirects
    });

    console.log("Nonce generated successfully:", nonce.substring(0, 10) + "...");
    
    const response: NonceResponse = { nonce };
    const nextResponse = NextResponse.json(response);
    
    // Preserve language preference
    nextResponse.cookies.set("language", languagePreference, {
      path: "/",
      maxAge: 86400, // 24 hours
      sameSite: "lax",
    });
    
    return nextResponse;
  } catch (error) {
    console.error("Error generating nonce:", error);
    
    // Get language preference from header or cookie (in case of error)
    const languageHeader = req.headers.get("X-Language-Preference");
    const languageCookie = req.cookies.get("language")?.value;
    const languagePreference = languageHeader || languageCookie || "en";
    
    const response: NonceResponse = { error: "Failed to generate nonce" };
    const nextResponse = NextResponse.json(response, { status: 500 });
    
    // Preserve language preference even on error
    nextResponse.cookies.set("language", languagePreference, {
      path: "/",
      maxAge: 86400, // 24 hours
      sameSite: "lax",
    });
    
    return nextResponse;
  }
}
