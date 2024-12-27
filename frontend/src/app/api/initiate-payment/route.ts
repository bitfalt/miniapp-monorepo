import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const id = crypto.randomUUID().replace(/-/g, "");
    const response = NextResponse.json({ id });
    response.cookies.set('payment-nonce', id, { 
      httpOnly: true,
      sameSite: 'strict'
    });
    
    return response;
  } catch (error: unknown) {
    console.error('Payment initiation failed:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
} 