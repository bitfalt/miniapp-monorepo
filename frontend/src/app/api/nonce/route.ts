import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  cookies().set('siwe', nonce, { 
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  });
  
  return NextResponse.json({ nonce });
}