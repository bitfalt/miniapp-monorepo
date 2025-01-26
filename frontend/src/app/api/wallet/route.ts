import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export async function GET() {
  const token = cookies().get('session')?.value;
  
  if (!token) {
    return NextResponse.json({ address: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string, { algorithms: ['HS256'] }) as unknown as { address: string };
    return NextResponse.json({ address: decoded.address });
  } catch (error: unknown) {
    // Clear invalid session cookie
    cookies().delete('session');
    return NextResponse.json({ address: null });
  }
} 