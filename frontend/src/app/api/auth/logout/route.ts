import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear all session-related cookies
    const cookieStore = cookies();
    cookieStore.delete('session');
    cookieStore.delete('next-auth.session-token');
    cookieStore.delete('next-auth.callback-url');
    cookieStore.delete('next-auth.csrf-token');

    // Create response with all cookies cleared
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });

    // Set all cookies to expire
    response.headers.set('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    response.headers.append('Set-Cookie', 'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    response.headers.append('Set-Cookie', 'next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    response.headers.append('Set-Cookie', 'next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      error: 'Failed to logout'
    }, { 
      status: 500 
    });
  }
} 