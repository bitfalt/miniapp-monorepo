import { NextResponse } from "next/server";

export async function POST() {
  // Redirect POST requests to the sign-in page with a GET request
  return NextResponse.redirect(new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "https://app.bitfalt.xyz"));
} 