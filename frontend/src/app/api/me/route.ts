import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const token = cookies().get('session')?.value;
  
  if (!token) {
    return NextResponse.json({ address: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { address: string };
    return NextResponse.json({ address: decoded.address });
  } catch {
    return NextResponse.json({ address: null });
  }
}