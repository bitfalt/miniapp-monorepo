import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface NonceResponse {
  nonce?: string;
  error?: string;
}

export const dynamic = "force-dynamic";

export function GET() {
  try {
    // Generate a simple alphanumeric nonce
    const nonce = crypto.randomBytes(32).toString("base64url");

    // Store nonce in cookie with proper settings
    cookies().set("siwe", nonce, {
      secure: true,
      httpOnly: true,
      path: "/",
      maxAge: 300, // 5 minutes expiry
      sameSite: "lax", // Changed to lax to work with redirects
    });

    const response: NonceResponse = { nonce };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating nonce:", error);
    const response: NonceResponse = { error: "Failed to generate nonce" };
    return NextResponse.json(response, { status: 500 });
  }
}
