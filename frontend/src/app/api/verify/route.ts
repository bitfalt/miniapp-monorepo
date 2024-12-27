import { verifyCloudProof, IVerifyResponse, ISuccessResult } from "@worldcoin/minikit-js";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { payload, action, signal } = await request.json();
  const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
  
  const verifyRes = await verifyCloudProof(
    payload,
    app_id,
    action,
    signal
  ) as IVerifyResponse;

  if (verifyRes.success) {
    return NextResponse.json({ verifyRes }, { status: 200 });
  } else {
    return NextResponse.json({ verifyRes }, { status: 400 });
  }
} 