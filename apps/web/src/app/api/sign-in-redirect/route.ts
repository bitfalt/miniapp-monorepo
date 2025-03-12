import { NextResponse } from "next/server";

export async function POST() {
  // Redirect POST requests to the sign-in page with a GET request
  // Use a 303 redirect to force a GET request
  const redirectUrl = new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "https://app.bitfalt.xyz");
  return NextResponse.redirect(redirectUrl, 303);
} 