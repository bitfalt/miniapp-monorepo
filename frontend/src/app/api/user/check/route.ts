import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return new NextResponse(
        JSON.stringify({ error: 'Wallet address is required' }),
        { status: 400 }
      );
    }

    const xata = getXataClient();
    const existingUser = await xata.db.Users.filter({
      wallet_address: walletAddress.toLowerCase(),
      name: { $isNot: 'Temporary' }
    }).getFirst();

    return new NextResponse(
      JSON.stringify({
        exists: !!existingUser,
        userId: existingUser?.xata_id
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking user:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to check user existence' }),
      { status: 500 }
    );
  }
} 