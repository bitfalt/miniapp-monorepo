import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from 'crypto';

export function GET() {
  try {
    // Generate a simple alphanumeric nonce
    const nonce = crypto.randomBytes(32).toString('base64url');

    // Store nonce in cookie with proper settings
    cookies().set("siwe", nonce, { 
      secure: true,
      httpOnly: true,
      path: '/',
      maxAge: 300, // 5 minutes expiry
      sameSite: 'lax' // Changed to lax to work with redirects
    });

    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
} 