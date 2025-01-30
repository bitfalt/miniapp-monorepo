import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js';

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = (await req.json()) as IRequestPayload;
    const storedNonce = cookies().get('siwe')?.value;

    console.log('SIWE verification request:', {
      payload,
      nonce,
      storedNonce
    });

    // Strict nonce comparison
    if (!storedNonce || storedNonce.trim() !== nonce.trim()) {
      console.error('Nonce mismatch:', { 
        received: nonce, 
        stored: storedNonce,
        receivedLength: nonce?.length,
        storedLength: storedNonce?.length
      });
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid nonce',
      });
    }

    try {
      console.log('Verifying SIWE message...');
      const validMessage = await verifySiweMessage(payload, storedNonce);
      console.log('SIWE verification result:', validMessage);

      if (!validMessage.isValid || !validMessage.siweMessageData?.address) {
        throw new Error('Invalid SIWE message');
      }

      // Clear the nonce cookie after successful verification
      cookies().delete('siwe');

      return NextResponse.json({
        status: 'success',
        isValid: true,
        address: validMessage.siweMessageData.address
      });
    } catch (error) {
      console.error('SIWE verification error:', error);
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: error instanceof Error ? error.message : 'SIWE verification failed',
      });
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: error instanceof Error ? error.message : 'Request processing failed',
    });
  }
} 