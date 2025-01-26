import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifySiweMessage } from '@worldcoin/minikit-js';
import { getXataClient } from '@/lib/utils';

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

const xata = getXataClient();

interface IRequestPayload {
  payload: any;
  nonce: string;
}

export const POST = async (req: NextRequest) => {
  const { payload, nonce } = (await req.json()) as IRequestPayload;
  const storedNonce = cookies().get('siwe')?.value;

  console.log('Received SIWE payload:', {
    payload,
    nonce,
    storedNonce
  });

  if (nonce !== storedNonce) {
    console.error('Nonce mismatch:', { received: nonce, stored: storedNonce });
    return NextResponse.json({ error: 'Invalid nonce' }, { status: 401 });
  }

  try {
    console.log('Verifying SIWE message...');
    const validMessage = await verifySiweMessage(payload, nonce);
    console.log('SIWE verification result:', validMessage);
    
    const isValid = validMessage.isValid;
    const address = validMessage.siweMessageData.address;
    
    if (!isValid) {
      console.error('Invalid SIWE signature:', validMessage);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('Checking user in database...');
    const existingUser = await xata.db.Users.filter({
      wallet_address: address
    }).getFirst();
    console.log('Database lookup result:', existingUser);

    const token = jwt.sign({ 
      address,
      isRegistered: !!existingUser 
    }, JWT_SECRET, { 
      expiresIn: '24h' 
    });
    
    const response = NextResponse.json({ 
      success: true, 
      address,
      isRegistered: !!existingUser
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('SIWE Verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    );
  }
}; 