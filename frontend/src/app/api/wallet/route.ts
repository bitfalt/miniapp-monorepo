import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set');
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  const token = cookies().get('session')?.value;
  
  if (!token) {
    return NextResponse.json({ address: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { address: string };
    return NextResponse.json({ address: decoded.address });
  } catch (error) {
    // Clear invalid session cookie
    cookies().delete('session');
    return NextResponse.json({ address: null });
  }
} 