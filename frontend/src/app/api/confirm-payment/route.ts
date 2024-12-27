import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

export async function POST(request: Request) {
  try {
    const { payload } = await request.json() as IRequestPayload;
    const cookiesList = await cookies();
    const reference = cookiesList.get('payment-nonce')?.value;

    if (!reference || payload.reference !== reference) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.NEXT_PUBLIC_APP_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
        },
      }
    );

    const transaction = await response.json();
    
    if (transaction.reference === reference && transaction.status !== "failed") {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false });
  } catch (error: unknown) {
    console.error('Payment confirmation failed:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
} 