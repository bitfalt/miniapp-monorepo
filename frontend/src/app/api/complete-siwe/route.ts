import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifySiweMessage } from '@worldcoin/minikit-js';

const JWT_SECRET = process.env.JWT_SECRET!;

interface IRequestPayload {
  payload: any;
  nonce: string;
}

export const POST = async (req: NextRequest) => {
  const { payload, nonce } = (await req.json()) as IRequestPayload;
  const storedNonce = cookies().get('siwe')?.value;

  if (nonce !== storedNonce) {
    return NextResponse.json({ error: 'Invalid nonce' }, { status: 401 });
  }

  try {
    const validMessage = await verifySiweMessage(payload, nonce);
    
    const isValid = validMessage.isValid;
    const address = validMessage.siweMessageData.address;
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '24h' });
    
    const response = NextResponse.json({ success: true, address });
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}; 